const { execFile } = require('child_process');
const path = require('path');
const fs = require('fs');
const { v4: uuid } = require('uuid');

const DOWNLOAD_DIR = path.join(__dirname, '..', '..', 'tmp');

if (!fs.existsSync(DOWNLOAD_DIR)) {
  fs.mkdirSync(DOWNLOAD_DIR, { recursive: true });
}

function detectPlatform(url) {
  if (url.includes('douyin.com') || url.includes('iesdouyin.com')) return 'douyin';
  if (url.includes('tiktok.com')) return 'tiktok';
  if (url.includes('xiaohongshu.com') || url.includes('xhslink.com')) return 'xiaohongshu';
  if (url.includes('kuaishou.com')) return 'kuaishou';
  if (url.includes('bilibili.com') || url.includes('b23.tv')) return 'bilibili';
  return 'unknown';
}

async function download(url) {
  const platform = detectPlatform(url);
  const filename = `${uuid()}.mp4`;
  const outputPath = path.join(DOWNLOAD_DIR, filename);

  return new Promise((resolve, reject) => {
    const args = [
      '-f', 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
      '-o', outputPath,
      '--no-playlist',
      '--socket-timeout', '30',
      url,
    ];

    execFile('yt-dlp', args, { timeout: 120000 }, (err, stdout, stderr) => {
      if (err) {
        console.error('yt-dlp error:', stderr);
        return reject(new Error(`下载失败: ${stderr}`));
      }
      if (!fs.existsSync(outputPath)) {
        return reject(new Error('下载完成但文件不存在'));
      }
      resolve({ filePath: outputPath, filename, platform, meta: stdout });
    });
  });
}

module.exports = { download, detectPlatform };
