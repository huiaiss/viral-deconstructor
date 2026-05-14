const config = require('../config');

async function claudeChat(systemPrompt, userMessage) {
  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': config.ai.claudeKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 8192,
      temperature: 0.4,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Claude API error: ${JSON.stringify(json)}`);
  return json.content[0].text;
}

async function deepseekChat(systemPrompt, userMessage) {
  const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.ai.deepseekKey}`,
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      temperature: 0.4,
      max_tokens: 8192,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`DeepSeek API error: ${JSON.stringify(json)}`);
  return json.choices[0].message.content;
}

async function chat(systemPrompt, userMessage) {
  try { return await claudeChat(systemPrompt, userMessage); }
  catch (e) { console.warn('Claude failed, falling back to DeepSeek:', e.message); }
  return deepseekChat(systemPrompt, userMessage);
}

module.exports = { chat, claudeChat, deepseekChat };
