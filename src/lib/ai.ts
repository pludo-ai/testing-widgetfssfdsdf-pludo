interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

// Get API configuration from environment variables
const API_PROVIDER = import.meta.env.VITE_API_PROVIDER || 'openrouter';
const API_KEY = import.meta.env.VITE_API_KEY || 'Testing widget';
const AI_MODEL = import.meta.env.VITE_AI_MODEL || 'deepseek/deepseek-r1';

export async function sendMessage(message: string, history: Message[], config: any): Promise<string> {
  const systemPrompt = await createSystemPrompt(config);
  const conversationHistory = history.slice(-10).map(msg => ({
    role: msg.isUser ? 'user' : 'assistant',
    content: msg.text
  }));

  try {
    
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': window.location.origin,
        'X-Title': `${config.brandName} AI Assistant`
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-r1',
        messages: [
          { role: 'system', content: systemPrompt },
          ...conversationHistory,
          { role: 'user', content: message }
        ],
        temperature: 0.7,
        max_tokens: 500,
        top_p: 0.9,
        frequency_penalty: 0.1,
        presence_penalty: 0.1
      })
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || 'Sorry, I could not process your request.';
  } catch (error) {
    console.error('AI Service Error:', error);
    return 'I apologize, but I\'m having trouble connecting right now. Please try again in a moment.';
  }
}

async function createSystemPrompt(config: any): Promise<string> {
  const currentTime = new Date();
  const timeString = currentTime.toLocaleTimeString();
  const dateString = currentTime.toLocaleDateString();
  
  let officeHoursNote = '';
  if (config.officeHours) {
    officeHoursNote = `Our office hours are ${config.officeHours}. Current time is ${timeString} on ${dateString}.`;
  }

  const faqsText = config.faqs.map((faq: any) => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n');
  const servicesText = config.services.join(', ');

  // Load knowledge from knowledge.txt if available
  let knowledgeContent = config.knowledge || '';
  try {
    const knowledgeResponse = await fetch('/knowledge.txt');
    if (knowledgeResponse.ok) {
      knowledgeContent = await knowledgeResponse.text();
    }
  } catch (error) {
    console.log('Could not load knowledge.txt, using config knowledge');
  }

  return `You are ${config.name}, an AI assistant for ${config.brandName}. You are helpful, knowledgeable, and ${config.tone}.

IMPORTANT INSTRUCTIONS:
- Always stay in character as ${config.name}
- Be ${config.tone} in your communication style
- Focus on helping with ${config.brandName} related questions
- If asked about something outside your knowledge, politely redirect to contacting us directly
- Keep responses concise but informative (aim for 1-3 sentences unless more detail is specifically requested)
- Use the FAQ information when relevant questions are asked
- Be proactive in suggesting how you can help

YOUR ROLE: ${config.roleDescription}

SERVICES WE OFFER: ${servicesText}

FREQUENTLY ASKED QUESTIONS:
${faqsText}

KNOWLEDGE BASE:
${knowledgeContent}

${officeHoursNote}

COMMUNICATION STYLE: ${config.tone}
- If friendly: Be warm, approachable, and use casual language
- If professional: Be formal, precise, and business-focused  
- If witty: Be clever, engaging, and use appropriate humor
- If minimal: Be concise, direct, and to-the-point

Remember: You represent ${config.brandName} and should always be helpful while staying within your knowledge domain.`;
}