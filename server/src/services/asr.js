const config = require('../config');
const fs = require('fs');

const BASE_URL = config.ai.doubaoBaseUrl;
const KEY = config.ai.doubaoKey;

async function transcribe(audioFilePath) {
  const audioBuffer = fs.readFileSync(audioFilePath);
  const audioBase64 = audioBuffer.toString('base64');

  const res = await fetch(`${BASE_URL}/audio/transcriptions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${KEY}`,
    },
    body: JSON.stringify({
      model: 'doubao-whisper',
      file: audioBase64,
      response_format: 'verbose_json',
      timestamp_granularities: ['word'],
    }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`豆包语音识别错误: ${JSON.stringify(json)}`);
  return json;
}

module.exports = { transcribe };
