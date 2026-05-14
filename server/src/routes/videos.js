const { Router } = require('express');
const authMiddleware = require('../middleware/auth');
const { download, detectPlatform } = require('../services/video-downloader');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const config = require('../config');
const fs = require('fs');

const router = Router();

function getS3() {
  return new S3Client({
    region: 'us-east-1',
    endpoint: config.s3.endpoint,
    credentials: {
      accessKeyId: config.s3.accessKey,
      secretAccessKey: config.s3.secretKey,
    },
    forcePathStyle: true,
  });
}

router.post('/parse', authMiddleware, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: '请提供视频链接' });
    const platform = detectPlatform(url);
    res.json({ platform, url });
  } catch (e) {
    res.status(400).json({ error: '链接解析失败' });
  }
});

router.post('/download', authMiddleware, async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: '请提供视频链接' });
    const result = await download(url);
    const s3 = getS3();
    const fileStream = fs.createReadStream(result.filePath);
    const key = `videos/${result.filename}`;
    await s3.send(new PutObjectCommand({
      Bucket: config.s3.bucket,
      Key: key,
      Body: fileStream,
      ContentType: 'video/mp4',
    }));
    fs.unlinkSync(result.filePath);
    const signedUrl = await getSignedUrl(s3, new GetObjectCommand({ Bucket: config.s3.bucket, Key: key }), { expiresIn: 3600 });
    res.json({
      s3Key: key,
      downloadUrl: signedUrl,
      platform: result.platform,
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
