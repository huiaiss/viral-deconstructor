const { execFile } = require('child_process');
const path = require('path');
const { v4: uuid } = require('uuid');

const TMP = path.join(__dirname, '..', '..', 'tmp');

async function ffmpeg(args) {
  return new Promise((resolve, reject) => {
    execFile('ffmpeg', args, { timeout: 60000 }, (err, stdout, stderr) => {
      if (err) reject(new Error(stderr));
      else resolve(stdout);
    });
  });
}

async function getVideoDuration(filePath) {
  const out = await new Promise((resolve, reject) => {
    execFile('ffprobe', [
      '-v', 'error', '-show_entries', 'format=duration',
      '-of', 'default=noprint_wrappers=1:nokey=1', filePath,
    ], { timeout: 10000 }, (err, stdout) => {
      if (err) reject(err);
      else resolve(stdout.trim());
    });
  });
  return parseFloat(out);
}

async function extractAudio(videoPath) {
  const audioPath = path.join(TMP, `${uuid()}.mp3`);
  await ffmpeg(['-i', videoPath, '-vn', '-acodec', 'libmp3lame', '-q:a', '2', audioPath, '-y']);
  return audioPath;
}

async function extractKeyFrames(videoPath, count = 10) {
  const duration = await getVideoDuration(videoPath);
  const interval = duration / (count + 1);
  const frames = [];

  for (let i = 1; i <= count; i++) {
    const time = interval * i;
    const framePath = path.join(TMP, `${uuid()}.jpg`);
    await ffmpeg(['-ss', String(time), '-i', videoPath, '-vframes', '1', '-q:v', '2', framePath, '-y']);
    frames.push(framePath);
  }

  return frames;
}

module.exports = { getVideoDuration, extractAudio, extractKeyFrames };
