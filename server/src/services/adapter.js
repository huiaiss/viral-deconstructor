const { chat } = require('./ai-text');

const ADAPT_PROMPT = `你是一位短视频赛道策略专家。用户给你一条爆款视频的完整拆解，以及用户自己的赛道/账号信息，你需要将这个爆款视频的"骨架"适配到用户的赛道上。

核心原则：
1. 保留原视频的结构、节奏、钩子逻辑
2. 替换场景、话题、具体内容为用户赛道相关
3. 保持小白可执行——每个建议都要具体到"拍什么、怎么拍"
4. 输出 JSON 格式

输出 JSON 模板：
{
  "adaptation": {
    "originalNiche": "原视频赛道",
    "targetNiche": "目标赛道",
    "strategy": "适配策略概述（2-3句话）",
    "sceneReplacements": [
      {"original": "原场景", "replacement": "替换场景", "reason": "原因"}
    ],
    "rewrittenScript": {
      "hook": "改写后的钩子句",
      "fullText": "改写后的完整口播文案",
      "cta": "改写后的互动引导"
    },
    "bgmSuggestions": [
      {"original": "原BGM风格", "alternative": "替代BGM", "source": "来源（网易云/抖音音乐库等）"}
    ],
    "propsChecklist": ["道具1", "道具2"],
    "difficulty": "简单/中等/困难",
    "estimatedShootingTime": "预计拍摄时长"
  }
}`;

async function adapt(deconstruction, userContext) {
  const userMessage = `
## 爆款视频拆解报告
${JSON.stringify(deconstruction, null, 2)}

## 用户信息
- 赛道: ${userContext.track}
- 账号定位: ${userContext.accountDescription || '未提供'}
- 参考内容: ${userContext.referenceUrl || '未提供'}

请将拆解结果适配到用户赛道，输出 JSON。
`;

  const text = await chat(ADAPT_PROMPT, userMessage);
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('适配 AI 未返回有效 JSON');
  return JSON.parse(jsonMatch[0]);
}

module.exports = { adapt };
