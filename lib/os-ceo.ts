import { generateObject } from 'ai';
import { createOpenAI } from '@ai-sdk/openai';
import { z } from 'zod';
import { getAgents, createTask, updateMission, getMission, getCompanyApiKeys } from './os-db';

export async function orchestrateMission(missionId: string) {
  const mission = getMission(missionId);
  if (!mission) throw new Error("Mission not found");
  
  const agents = getAgents(mission.company_id as string);
  const agentDescriptions = agents.map(a => 
    `ID: ${a.id} | Name: ${a.name} | Role: ${a.role} | Dept: ${a.department_name}`
  ).join('\n');

  updateMission(missionId, { status: 'in_progress', ceo_plan: 'Analyzing objective and generating execution plan...' });

  const keys = getCompanyApiKeys(mission.company_id as string);
  const openaiKey = keys.find(k => k.provider === 'openai')?.api_key || process.env.OPENAI_API_KEY;

  let ceoPlan = "";
  let generatedTasks: any[] = [];

  try {
    if (!openaiKey) throw new Error("No OpenAI API Key found");

    const openai = createOpenAI({ apiKey: openaiKey });

    const { object } = await generateObject({
      model: openai('gpt-4o'),
      schema: z.object({
        ceo_plan: z.string().describe("A concise strategic plan on how to execute this objective."),
        tasks: z.array(z.object({
          title: z.string(),
          description: z.string(),
          agent_id: z.string().nullable().describe("ID of the agent assigned. Must exactly match one of the provided IDs, or null if unassigned."),
          expected_output: z.string()
        }))
      }),
      prompt: `You are the AI CEO. 
Your objective: "${mission.objective}"

Available agents in your company:
${agentDescriptions}

Create a strategic plan and break it down into 3 to 6 logical sequential tasks. Assign each task to the most appropriate agent by their ID.
`
    });
    
    ceoPlan = object.ceo_plan;
    generatedTasks = object.tasks;
  } catch (error) {
    console.error("AI CEO Generation failed (likely missing OPENAI_API_KEY):", error);
    // Fallback if no API key is set
    ceoPlan = "We will execute a standard 3-step protocol since no API key is active. Research, Build, Review.";
    generatedTasks = [
      { title: "Initial Research", description: "Analyze the core requirements of the objective.", agent_id: agents[0]?.id || null, expected_output: "Research notes" },
      { title: "Draft Solution", description: "Create the initial implementation.", agent_id: agents.length > 1 ? agents[1]?.id : agents[0]?.id, expected_output: "Draft deliverable" },
      { title: "Final Review", description: "Review against the original objective.", agent_id: agents[0]?.id || null, expected_output: "Final approval" }
    ];
  }

  // Update mission with the plan
  updateMission(missionId, { ceo_plan: ceoPlan });

  // Create tasks in DB
  const createdTaskRecords = [];
  for (const t of generatedTasks) {
    const agent = agents.find(a => a.id === t.agent_id);
    const dbTask = createTask({
      mission_id: missionId,
      company_id: mission.company_id as string,
      agent_id: t.agent_id,
      department_id: agent?.department_id,
      title: t.title,
      description: t.description,
      expected_output: t.expected_output,
      priority: 'normal',
    });
    createdTaskRecords.push(dbTask);
  }

  return { plan: ceoPlan, tasks: createdTaskRecords };
}
