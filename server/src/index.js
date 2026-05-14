const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const config = require('./config');
const authRoutes = require('./routes/auth');
const videoRoutes = require('./routes/videos');
const deconstructionRoutes = require('./routes/deconstructions');
const planRoutes = require('./routes/plans');
const exportRoutes = require('./routes/export');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('short'));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/deconstructions', deconstructionRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/export', exportRoutes);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(config.port, () => {
  console.log(`Server running on port ${config.port}`);
});
