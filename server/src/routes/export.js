const { Router } = require('express');
const authMiddleware = require('../middleware/auth');
const Plan = require('../models/plan');
const { generatePDF } = require('../services/pdf-exporter');
const fs = require('fs');

const router = Router();
router.use(authMiddleware);

router.get('/pdf/:planId', async (req, res) => {
  try {
    const plan = await Plan.findById(req.params.planId);
    if (!plan || plan.user_id !== req.userId) {
      return res.status(404).json({ error: '方案不存在' });
    }
    if (plan.status !== 'completed') {
      return res.status(400).json({ error: '方案尚未生成完成' });
    }

    const filePath = await generatePDF(plan.result);
    res.download(filePath, '拍摄方案.pdf', () => {
      fs.unlinkSync(filePath);
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: '导出失败' });
  }
});

module.exports = router;
