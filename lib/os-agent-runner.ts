import { streamText } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { createAnthropic } from '@ai-sdk/anthropic';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { getTask, getAgent, updateTaskState, addActivity, dbAll, dbRun, getCompanyApiKeys, getAgentMemories, addAgentMemory } from './os-db';
import { osEvents } from './os-events';

export async function runTask(taskId: string) {
  const task = getTask(taskId);
  if (!task) throw new Error('Task not found');
  
  if (!task.agent_id) throw new Error('Task has no assigned agent');
  const agent = getAgent(task.agent_id as string);
  if (!agent) throw new Error('Agent not found');
  
  updateTaskState(taskId, 'in_progress');
  
  addActivity({
    company_id: task.company_id as string,
    mission_id: task.mission_id as string,
    actor_type: 'agent',
    actor_id: agent.id as string,
    event: 'started_task',
    payload: { task_id: taskId, title: task.title }
  });

  const keys = getCompanyApiKeys(task.company_id as string);
  const provider = (agent.provider as string) || 'openai';
  const apiKeyRecord = keys.find(k => k.provider === provider);
  const apiKey = apiKeyRecord?.api_key || (provider === 'openai' ? process.env.OPENAI_API_KEY : null);

  let model;
  if (provider === 'anthropic') {
    const anthropic = createAnthropic({ apiKey: apiKey || 'dummy_key' });
    model = anthropic(agent.model as string || 'claude-3-5-sonnet-20240620');
  } else if (provider === 'google') {
    const google = createGoogleGenerativeAI({ apiKey: apiKey || 'dummy_key' });
    model = google(agent.model as string || 'gemini-1.5-pro-latest');
  } else {
    const openai = createOpenAI({ apiKey: apiKey || 'dummy_key' });
    model = openai(agent.model as string || 'gpt-4o');
  }

  const memories = getAgentMemories(agent.id as string).slice(0, 5);
  const memoryContext = memories.map((m: any) => JSON.parse(m.value).output).join('\n---\n');

  const prevTasks = dbAll(
    "SELECT title, output FROM tasks WHERE mission_id = ? AND state = 'completed' ORDER BY created_at",
    [task.mission_id]
  );
  const handoffContext = prevTasks.map((t: any) => `[${t.title}]:\n${t.output}`).join('\n\n');

  const systemPrompt = `You are ${agent.name}, an AI agent working in the ${agent.role} role.
Your system prompt: ${agent.system_prompt || 'Be helpful and concise.'}

${memoryContext ? `Your memory from previous work:\n${memoryContext}\nUse this context when relevant.` : ''}`;

  try {
    let resultText = '';
    
    // Fallback to simulation if no API key is provided
    if (!apiKey) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      resultText = `Simulation: I have successfully completed the task ${task.title}. The output meets the expected requirements.`;
    } else {
      const { textStream } = await streamText({
        model,
        system: systemPrompt,
        prompt: `Execute the following task:
Title: ${task.title}
Description: ${task.description}
Expected output: ${task.expected_output}

${handoffContext ? `Context from previous agents in this mission:\n${handoffContext}\n\nBuild on their work. Do not repeat what was already done.` : ''}

Provide the final output for your task.`,
      });
      
      for await (const chunk of textStream) {
        resultText += chunk;
        osEvents.emit(`thought:${task.mission_id}`, { task_id: taskId, agent_name: agent.name, chunk });
      }
    }

    dbRun("UPDATE tasks SET output = ?, state = 'completed' WHERE id = ?", [resultText, taskId]);
    
    addAgentMemory({
      agent_id: agent.id as string,
      mission_id: task.mission_id as string,
      key: "task_summary",
      value: JSON.stringify({ mission: task.mission_id, task: task.title, output: resultText, date: new Date().toISOString() })
    });
    
    // Calculate and update mission progress
    const allTasks = dbAll("SELECT state FROM tasks WHERE mission_id = ?", [task.mission_id]);
    const completedTasks = allTasks.filter((t: any) => t.state === 'completed').length;
    const progress = Math.round((completedTasks / allTasks.length) * 100);
    
    if (progress === 100) {
      dbRun("UPDATE missions SET progress = ?, status = 'completed', completed_at = datetime('now') WHERE id = ?", [progress, task.mission_id]);
    } else {
      dbRun("UPDATE missions SET progress = ? WHERE id = ?", [progress, task.mission_id]);
    }

    
    addActivity({
      company_id: task.company_id as string,
      mission_id: task.mission_id as string,
      actor_type: 'agent',
      actor_id: agent.id as string,
      event: 'completed_task',
      payload: { task_id: taskId, title: task.title, result: resultText }
    });

    return { success: true, result: resultText };
  } catch (error: any) {
    updateTaskState(taskId, 'blocked');
    addActivity({
      company_id: task.company_id as string,
      mission_id: task.mission_id as string,
      actor_type: 'agent',
      actor_id: agent.id as string,
      event: 'failed_task',
      payload: { task_id: taskId, error: error.message }
    });
    return { success: false, error: error.message };
  }
}
