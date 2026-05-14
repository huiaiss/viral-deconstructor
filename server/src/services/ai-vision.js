const config = require('../config');

async function analyzeFrames(frameUrls, prompt) {
  const key = config.ai.geminiKey;
  const parts = [
    { text: prompt },
    ...frameUrls.map(url => ({
      fileData: { fileUri: url, mimeType: 'image/jpeg' },
    })),
  ];

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent?key=${key}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ role: 'user', parts }],
        generationConfig: { temperature: 0.4, maxOutputTokens: 8192 },
      }),
    }
  );
  const json = await res.json();
  if (!res.ok) throw new Error(`Gemini API error: ${JSON.stringify(json)}`);
  return json.candidates[0].content.parts[0].text;
}

async function describeShot(imageUrl) {
  return analyzeFrames([imageUrl], `请详细描述这张视频截图的画面内容，包括：景别（特写/近景/中景/全景/远景）、拍摄角度、光线、构图、人物动作和表情、场景环境。用中文输出。`);
}

module.exports = { analyzeFrames, describeShot };
