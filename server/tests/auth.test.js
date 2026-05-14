const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/auth');

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

describe('POST /api/auth/register', () => {
  it('rejects missing email', async () => {
    const res = await request(app).post('/api/auth/register').send({ password: '123456' });
    expect(res.status).toBe(400);
  });

  it('rejects missing password', async () => {
    const res = await request(app).post('/api/auth/register').send({ email: 'test@test.com' });
    expect(res.status).toBe(400);
  });
});
