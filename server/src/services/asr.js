const { execFile } = require('child_process');
const path = require('path');
const { v4: uuid } = require('uuid');

const TMP = path.join(__dirname, '..', '..', 'tmp');

async function transcribe(audioFilePath) {
  const subtitlePath = path.join(TMP, `${uuid()}.srt`);
  const whisperModel = process.env.WHISPER_MODEL || 'medium';

  return new Promise((resolve, reject) => {
    execFile('whisper', [
      audioFilePath,
      '--model', whisperModel,
      '--output_format', 'json',
      '--output_dir', path.dirname(subtitlePath),
      '--task', 'transcribe',
      '--language', 'zh',
    ], { timeout: 300000 }, (err, stdout) => {
      if (err) {
        console.error('Whisper error:', err.message);
        return reject(new Error(`语音识别失败: ${err.message}。请确保已安装 openai-whisper (pip install openai-whisper)`));
      }
      try {
        const jsonPath = audioFilePath.replace(/\.[^.]+$/, '.json');
        const fs = require('fs');
        const result = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
        resolve({
          text: result.text,
          segments: (result.segments || []).map(s => ({
            start: s.start,
            end: s.end,
            text: s.text,
            words: (s.words || []).map(w => ({ word: w.word, start: w.start, end: w.end })),
          })),
        });
      } catch (e) {
        reject(new Error(`解析语音识别结果失败: ${e.message}`));
      }
    });
  });
}

module.exports = { transcribe };
