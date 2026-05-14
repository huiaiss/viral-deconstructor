-- 001_init.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  nickname VARCHAR(100),
  free_uses INT DEFAULT 0,
  subscription_status VARCHAR(20) DEFAULT 'free',
  subscription_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE deconstructions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  platform VARCHAR(50),
  source_url TEXT NOT NULL,
  video_s3_key TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  result JSONB,
  meta JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  deconstruction_id UUID REFERENCES deconstructions(id),
  track VARCHAR(100),
  reference_url TEXT,
  result JSONB,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_deconstructions_user ON deconstructions(user_id, created_at DESC);
CREATE INDEX idx_plans_user ON plans(user_id, created_at DESC);
