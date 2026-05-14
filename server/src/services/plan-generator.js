const { chat } = require('./ai-text');

const PLAN_PROMPT = `你是一位给零基础小白上课的视频拍摄教练。请根据拆解报告和适配方案，生成一份小白拿到就能拍的分镜拍摄方案。

要求：
1. 每个镜头写清楚：怎么站位、相机怎么动、说什么话、需要什么道具
2. 用最直白的语言，避免专业术语
3. 如果某步有难度，提供"偷懒替代方案"
4. 输出 JSON 格式

输出 JSON 模板：
{
  "shootingPlan": {
    "title": "拍摄方案标题",
    "estimatedTotalTime": "总预计拍摄时长",
    "difficulty": "简单/中等/困难",
    "preparations": {
      "equipment": ["需要的设备"],
      "props": ["道具清单"],
      "location": "推荐拍摄地点",
      "costume": "服装建议",
      "lighting": "光线/灯光建议"
    },
    "shots": [
      {
        "index": 1,
        "duration": 0,
        "shotType": "景别说明（简单说）",
        "cameraHowTo": "怎么拍（小白能懂的说法，如'手机放在桌子上，对着自己拍'）",
        "script": "这个镜头要说的台词",
        "actingTip": "表演提示（表情、语气、动作）",
        "prop": "需要用的道具",
        "easyAlternative": "如果觉得难，可以这样简化...",
        "checkPoint": "拍完检查：xxx"
      }
    ],
    "editingGuide": {
      "app": "推荐剪辑软件（剪映）",
      "cuts": ["剪辑要点1", "剪辑要点2"],
      "musicStart": "BGM起的时间点",
      "captions": "字幕风格建议"
    },
    "postingGuide": {
      "title": "建议标题",
      "hashtags": ["标签1", "标签2"],
      "bestTime": "最佳发布时间",
      "coverTip": "封面建议"
    }
  }
}`;

async function generatePlan(deconstruction, adaptation) {
  const userMessage = `
## 原视频拆解
${JSON.stringify(deconstruction, null, 2)}

## 赛道适配方案
${JSON.stringify(adaptation, null, 2)}

请生成小白可执行的分镜拍摄方案，输出 JSON。
`;

  const text = await chat(PLAN_PROMPT, userMessage);
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('方案生成 AI 未返回有效 JSON');
  return JSON.parse(jsonMatch[0]);
}

module.exports = { generatePlan };
