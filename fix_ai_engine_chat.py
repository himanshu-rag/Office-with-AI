with open('lib/ai-engine.ts', 'r') as f:
    content = f.read()

chat_func = """
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
"""

if "processChat" not in content:
    content += chat_func

with open('lib/ai-engine.ts', 'w') as f:
    f.write(content)
