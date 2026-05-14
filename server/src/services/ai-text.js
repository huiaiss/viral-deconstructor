const config = require('../config');

const DOUBAO_URL = `${config.ai.doubaoBaseUrl}/chat/completions`;
const DOUBAO_KEY = config.ai.doubaoKey;

async function doubaoChat(systemPrompt, userMessage) {
  const res = await fetch(DOUBAO_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${DOUBAO_KEY}`,
    },
    body: JSON.stringify({
      model: 'doubao-pro-32k',
      temperature: 0.4,
      max_tokens: 8192,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userMessage },
      ],
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`豆包 API 错误: ${JSON.stringify(json)}`);
  return json.choices[0].message.content;
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
  if (!res.ok) throw new Error(`DeepSeek API 错误: ${JSON.stringify(json)}`);
  return json.choices[0].message.content;
}

// 豆包优先，DeepSeek 作为 fallback
async function chat(systemPrompt, userMessage) {
  try { return await doubaoChat(systemPrompt, userMessage); }
  catch (e) { console.warn('豆包失败，回退 DeepSeek:', e.message); }
  return deepseekChat(systemPrompt, userMessage);
}

module.exports = { chat, doubaoChat, deepseekChat };
