import { generateText, generateObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { google } from '@ai-sdk/google';
import { anthropic } from '@ai-sdk/anthropic';
import { getAgent, updateTaskState, addActivity, addLog } from './os-db';

export function getProvider() {
  if (process.env.OPENAI_API_KEY) return openai('gpt-4o');
  if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) return google('gemini-2.5-pro');
  if (process.env.ANTHROPIC_API_KEY) return anthropic('claude-3-7-sonnet-20250219');
  
  // Fallback to a mock/simulated provider if no keys are set
  return null;
}

export async function processTask(taskId: string, companyId: string, agentId: string, title: string, description: string) {
  const agent = getAgent(agentId);
  const provider = getProvider();

  // 1. Mark as WORKING
  updateTaskState(taskId, 'WORKING');
  addActivity({
    company_id: companyId,
    actor_type: 'agent',
    actor_id: agentId,
    event: `Started working on task: ${title}`
  });

  addLog({
    task_id: taskId,
    agent_id: agentId,
    event_type: 'task_started',
    input: title
  });

  let outputText = '';
  let duration = 0;
  const startTime = Date.now();

  try {
    if (!provider) {
      // MOCK LOGIC (No API Keys)
      await new Promise(r => setTimeout(r, 2000));
      
      addLog({
        task_id: taskId,
        agent_id: agentId,
        event_type: 'tool_execution',
        tool: 'search_knowledge_base',
        input: 'Checking existing procedures...',
        output: 'No procedures found. Generating from scratch.'
      });
      
      await new Promise(r => setTimeout(r, 3000));
      outputText = `Mock Execution Completed for "${title}".\n\n(Note: Add an OPENAI_API_KEY, GOOGLE_GENERATIVE_AI_API_KEY, or ANTHROPIC_API_KEY to your .env file to enable real AI execution).`;
    } else {
      // REAL AI EXECUTION
      addLog({
        task_id: taskId,
        agent_id: agentId,
        event_type: 'llm_reasoning',
        input: 'Analyzing task parameters...'
      });

      const sysPrompt = agent?.system_prompt 
        ? agent.system_prompt 
        : `You are an AI agent named ${agent?.name} with the role of ${agent?.role}. Execute the task efficiently and thoroughly.`;

      const { text, usage } = await generateText({
        model: provider,
        system: sysPrompt,
        prompt: `Task: ${title}\nDescription: ${description || 'No description provided.'}\n\nPlease execute this task and provide the final output.`,
      });
      
      outputText = text;

      addLog({
        task_id: taskId,
        agent_id: agentId,
        event_type: 'llm_completion',
        output: text,
        tokens: usage.totalTokens
      });
    }

    duration = Date.now() - startTime;

    // 2. Mark as DONE
    updateTaskState(taskId, 'DONE');
    addActivity({
      company_id: companyId,
      actor_type: 'agent',
      actor_id: agentId,
      event: `Completed task: ${title}`
    });

    addLog({
      task_id: taskId,
      agent_id: agentId,
      event_type: 'task_completed',
      output: outputText,
      duration_ms: duration
    });

    return { success: true, output: outputText };

  } catch (error: any) {
    // 3. Mark as ERROR / FAILED
    updateTaskState(taskId, 'TODO'); // Revert to TODO or add a FAILED state
    
    addLog({
      task_id: taskId,
      agent_id: agentId,
      event_type: 'error',
      output: error.message || 'Unknown error occurred during execution'
    });

    addActivity({
      company_id: companyId,
      actor_type: 'agent',
      actor_id: agentId,
      event: `Failed to complete task: ${title}`
    });

    return { success: false, error: error.message };
  }
}

export async function processChat(companyId: string, missionId: string | null, messageText: string) {
  const provider = getProvider();
  
  if (!provider) {
    // Mock reply
    setTimeout(() => {
      addActivity({
        company_id: companyId,
        actor_type: 'agent',
        actor_id: 'Alex',
        event: `Replying to your message: "${messageText.substring(0, 20)}..."`,
        payload: { content: 'Please configure an API key (OPENAI_API_KEY) in .env to enable true chat capabilities. For now, I am running in offline mock mode.' }
      });
    }, 2000);
    return { success: true };
  }

  // Real LLM Chat
  try {
    const { text } = await generateText({
      model: provider,
      system: 'You are Alex, the CEO Agent of this autonomous AI organization. Respond concisely to the user in the team chat. Only respond if asked a question or if it is a general directive.',
      prompt: `User said: ${messageText}`
    });

    addActivity({
      company_id: companyId,
      actor_type: 'agent',
      actor_id: 'Alex',
      event: `Message: ${text}`,
    });

    return { success: true, text };
  } catch (error: any) {
    console.error('Chat error:', error);
    return { success: false, error: error.message };
  }
}
