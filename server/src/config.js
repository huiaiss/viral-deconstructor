require('dotenv').config();

module.exports = {
  port: process.env.PORT || 3000,
  db: {
    connectionString: process.env.DATABASE_URL,
  },
  redis: {
    url: process.env.REDIS_URL,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: '7d',
  },
  s3: {
    endpoint: process.env.S3_ENDPOINT,
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
    bucket: process.env.S3_BUCKET,
  },
  ai: {
    doubaoKey: process.env.DOUBAO_API_KEY,
    doubaoBaseUrl: process.env.DOUBAO_BASE_URL || 'https://ark.cn-beijing.volces.com/api/v3',
    deepseekKey: process.env.DEEPSEEK_API_KEY,
  },
  freeLimit: 3,
};
