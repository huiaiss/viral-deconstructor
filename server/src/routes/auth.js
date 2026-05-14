const { Router } = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const User = require('../models/user');
const authMiddleware = require('../middleware/auth');

const router = Router();

function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, config.jwt.secret, { expiresIn: config.jwt.expiresIn });
}

router.post('/register', async (req, res) => {
  try {
    const { email, password, nickname } = req.body;
    if (!email || !password) return res.status(400).json({ error: '邮箱和密码必填' });
    const existing = await User.findByEmail(email);
    if (existing) return res.status(409).json({ error: '该邮箱已注册' });
    const user = await User.create({ email, password, nickname });
    res.status(201).json({ token: signToken(user), user });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: '注册失败' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findByEmail(email);
    if (!user) return res.status(401).json({ error: '邮箱或密码错误' });
    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return res.status(401).json({ error: '邮箱或密码错误' });
    const { password_hash, ...profile } = user;
    res.json({ token: signToken(user), user: profile });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: '登录失败' });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId);
  if (!user) return res.status(404).json({ error: '用户不存在' });
  res.json({ user });
});

module.exports = router;
