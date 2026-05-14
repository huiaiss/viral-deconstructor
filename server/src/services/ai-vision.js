const config = require('../config');
const fs = require('fs');

const BASE_URL = config.ai.doubaoBaseUrl;
const KEY = config.ai.doubaoKey;

async function analyzeFrames(framePaths, prompt) {
  const parts = [
    { type: 'text', text: prompt },
    ...framePaths.map(p => ({
      type: 'image_url',
      image_url: { url: `data:image/jpeg;base64,${fs.readFileSync(p).toString('base64')}` },
    })),
  ];

  const res = await fetch(`${BASE_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${KEY}`,
    },
    body: JSON.stringify({
      model: 'doubao-vision-pro-32k',
      temperature: 0.4,
      max_tokens: 8192,
      messages: [{ role: 'user', content: parts }],
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`豆包视觉 API 错误: ${JSON.stringify(json)}`);
  return json.choices[0].message.content;
}

async function describeShot(imagePath) {
  return analyzeFrames([imagePath], '请详细描述这张视频截图的画面内容，包括：景别（特写/近景/中景/全景/远景）、拍摄角度、光线、构图、人物动作和表情、场景环境。用中文输出。');
}

module.exports = { analyzeFrames, describeShot };
