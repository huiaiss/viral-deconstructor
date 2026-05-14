const { chat } = require('./ai-text');

const DECONSTRUCT_PROMPT = `你是一位顶级短视频编导。请根据以下视频分析数据，输出一份完整的爆款拆解报告。

要求输出 JSON 格式（不要其他内容）：

{
  "overview": {
    "title": "视频标题/主题",
    "totalDuration": 0,
    "shotCount": 0,
    "niche": "所属赛道",
    "viralScore": 0
  },
  "shots": [
    {
      "index": 1,
      "startTime": 0,
      "endTime": 0,
      "duration": 0,
      "shotType": "特写/近景/中景/全景/远景",
      "cameraMovement": "固定/推/拉/摇/移/跟/甩",
      "angle": "平拍/俯拍/仰拍",
      "transition": "硬切/淡入淡出/闪白/无",
      "description": "画面内容描述（小白能看懂）",
      "onScreenText": "画面上的文字/字幕",
      "emotion": "情绪（紧张/轻松/感动/好奇等）"
    }
  ],
  "script": {
    "fullText": "完整口播文案",
    "hook": "开头钩子句",
    "keywords": ["关键词1"],
    "cta": "引导互动的话术"
  },
  "rhythm": {
    "bpm": 0,
    "cutSpeed": "快/中/慢",
    "musicMood": "BGM情绪",
    "climaxPoints": [{"time": 0, "description": "高潮点描述"}]
  },
  "emotionCurve": [
    {"time": 0, "level": 5, "description": "情绪描述"}
  ],
  "engagement": {
    "hookType": "开头钩子类型（悬念/反常识/痛点/共鸣）",
    "hookPosition": 0,
    "interactionHooks": ["互动设计1"],
    "commentBait": "评论区引导话术"
  }
}`;

async function runDeconstruction({ asrResult, frameDescriptions, duration, platformMeta }) {
  const userMessage = `
## 视频基本信息
- 时长: ${duration}秒
- 平台: ${platformMeta?.platform || '未知'}

## 语音识别结果（含时间戳）
${JSON.stringify(asrResult, null, 2)}

## 关键帧画面描述
${JSON.stringify(frameDescriptions, null, 2)}

请根据以上数据，按照 JSON 模板输出拆解报告。
`;

  const text = await chat(DECONSTRUCT_PROMPT, userMessage);
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('AI 未返回有效 JSON');
  return JSON.parse(jsonMatch[0]);
}

module.exports = { runDeconstruction };
