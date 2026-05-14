const { Router } = require('express');
const authMiddleware = require('../middleware/auth');
const Plan = require('../models/plan');
const Deconstruction = require('../models/deconstruction');
const { adapt } = require('../services/adapter');
const { generatePlan } = require('../services/plan-generator');

const router = Router();
router.use(authMiddleware);

router.post('/', async (req, res) => {
  try {
    const { deconstructionId, track, referenceUrl } = req.body;
    if (!deconstructionId || !track) {
      return res.status(400).json({ error: '请提供拆解ID和赛道' });
    }

    const dc = await Deconstruction.findById(deconstructionId);
    if (!dc || dc.user_id !== req.userId) {
      return res.status(404).json({ error: '拆解记录不存在' });
    }
    if (dc.status !== 'completed') {
      return res.status(400).json({ error: '拆解尚未完成' });
    }

    const plan = await Plan.create({
      userId: req.userId,
      deconstructionId,
      track,
      referenceUrl,
    });

    res.status(202).json({ id: plan.id, status: 'pending' });

    (async () => {
      try {
        const adaptation = await adapt(dc.result, { track, referenceUrl });
        const result = await generatePlan(dc.result, adaptation);
        await Plan.update(plan.id, 'completed', result);
      } catch (e) {
        console.error('Plan generation failed:', e);
        await Plan.update(plan.id, 'failed', { error: e.message });
      }
    })();
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.get('/', async (req, res) => {
  const list = await Plan.findByUser(req.userId);
  res.json({ list });
});

router.get('/:id', async (req, res) => {
  const item = await Plan.findById(req.params.id);
  if (!item) return res.status(404).json({ error: '不存在' });
  if (item.user_id !== req.userId) return res.status(403).json({ error: '无权限' });
  res.json(item);
});

module.exports = router;
