const { Router } = require('express');
const authMiddleware = require('../middleware/auth');
const Deconstruction = require('../models/deconstruction');
const User = require('../models/user');
const { download } = require('../services/video-downloader');
const { transcribe } = require('../services/asr');
const { describeShot } = require('../services/ai-vision');
const { runDeconstruction } = require('../services/deconstructor');
const { extractAudio, extractKeyFrames, getVideoDuration } = require('../services/video-utils');
const config = require('../config');

const router = Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: '请提供视频链接' });

    const user = await User.findById(req.userId);
    if (user.subscription_status === 'free' && user.free_uses >= config.freeLimit) {
      return res.status(403).json({ error: '免费次数已用完，请订阅', needSubscribe: true });
    }

    const dl = await download(url);
    const deconstruction = await Deconstruction.create({
      userId: req.userId,
      platform: dl.platform,
      sourceUrl: url,
      videoS3Key: dl.filename,
    });

    res.status(202).json({ id: deconstruction.id, status: 'pending' });

    (async () => {
      try {
        await Deconstruction.updateStatus(deconstruction.id, 'analyzing');

        const duration = await getVideoDuration(dl.filePath);
        const audioPath = await extractAudio(dl.filePath);
        const framePaths = await extractKeyFrames(dl.filePath, 10);

        const [asrResult, ...frameDescriptions] = await Promise.all([
          transcribe(audioPath),
          ...framePaths.map(fp => describeShot(fp)),
        ]);

        const result = await runDeconstruction({
          asrResult,
          frameDescriptions,
          duration,
          platformMeta: { platform: dl.platform },
        });

        await Deconstruction.updateStatus(deconstruction.id, 'completed', result);
        await User.incrementFreeUses(req.userId);

        const fs = require('fs');
        fs.unlinkSync(dl.filePath);
        fs.unlinkSync(audioPath);
        framePaths.forEach(p => fs.unlinkSync(p));
      } catch (e) {
        console.error('Deconstruction failed:', e);
        await Deconstruction.updateStatus(deconstruction.id, 'failed', { error: e.message });
      }
    })();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get('/', async (req, res) => {
  const list = await Deconstruction.findByUser(req.userId);
  res.json({ list });
});

router.get('/:id', async (req, res) => {
  const item = await Deconstruction.findById(req.params.id);
  if (!item) return res.status(404).json({ error: '不存在' });
  if (item.user_id !== req.userId) return res.status(403).json({ error: '无权限' });
  res.json(item);
});

module.exports = router;
