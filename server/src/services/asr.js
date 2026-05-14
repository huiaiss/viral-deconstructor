const config = require('../config');
const fs = require('fs');

async function transcribe(audioFilePath) {
  const form = new FormData();
  form.append('file', fs.createReadStream(audioFilePath));
  form.append('model', 'whisper-1');
  form.append('response_format', 'verbose_json');
  form.append('timestamp_granularities', 'word');

  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${config.ai.openaiKey}` },
    body: form,
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Whisper error: ${JSON.stringify(json)}`);
  return json;
}

module.exports = { transcribe };
