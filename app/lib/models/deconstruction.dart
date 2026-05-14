import 'shot.dart';

class DeconstructionResult {
  final Overview overview;
  final List<Shot> shots;
  final Script script;
  final Rhythm rhythm;
  final List<EmotionPoint> emotionCurve;
  final Engagement engagement;

  DeconstructionResult({
    required this.overview,
    required this.shots,
    required this.script,
    required this.rhythm,
    required this.emotionCurve,
    required this.engagement,
  });

  factory DeconstructionResult.fromJson(Map<String, dynamic> json) => DeconstructionResult(
    overview: Overview.fromJson(json['overview'] ?? {}),
    shots: (json['shots'] as List? ?? []).map((s) => Shot.fromJson(s)).toList(),
    script: Script.fromJson(json['script'] ?? {}),
    rhythm: Rhythm.fromJson(json['rhythm'] ?? {}),
    emotionCurve: (json['emotionCurve'] as List? ?? [])
        .map((e) => EmotionPoint.fromJson(e)).toList(),
    engagement: Engagement.fromJson(json['engagement'] ?? {}),
  );
}

class Overview {
  final String title;
  final double totalDuration;
  final int shotCount;
  final String niche;
  final double viralScore;
  Overview({required this.title, required this.totalDuration, required this.shotCount, required this.niche, required this.viralScore});
  factory Overview.fromJson(Map<String, dynamic> json) => Overview(
    title: json['title'] ?? '',
    totalDuration: (json['totalDuration'] ?? 0).toDouble(),
    shotCount: json['shotCount'] ?? 0,
    niche: json['niche'] ?? '',
    viralScore: (json['viralScore'] ?? 0).toDouble(),
  );
}

class Script {
  final String fullText;
  final String hook;
  final List<String> keywords;
  final String cta;
  Script({required this.fullText, required this.hook, required this.keywords, required this.cta});
  factory Script.fromJson(Map<String, dynamic> json) => Script(
    fullText: json['fullText'] ?? '',
    hook: json['hook'] ?? '',
    keywords: List<String>.from(json['keywords'] ?? []),
    cta: json['cta'] ?? '',
  );
}

class Rhythm {
  final double bpm;
  final String cutSpeed;
  final String musicMood;
  final List<ClimaxPoint> climaxPoints;
  Rhythm({required this.bpm, required this.cutSpeed, required this.musicMood, required this.climaxPoints});
  factory Rhythm.fromJson(Map<String, dynamic> json) => Rhythm(
    bpm: (json['bpm'] ?? 0).toDouble(),
    cutSpeed: json['cutSpeed'] ?? '',
    musicMood: json['musicMood'] ?? '',
    climaxPoints: (json['climaxPoints'] as List? ?? []).map((c) => ClimaxPoint.fromJson(c)).toList(),
  );
}

class ClimaxPoint {
  final double time;
  final String description;
  ClimaxPoint({required this.time, required this.description});
  factory ClimaxPoint.fromJson(Map<String, dynamic> json) => ClimaxPoint(
    time: (json['time'] ?? 0).toDouble(),
    description: json['description'] ?? '',
  );
}

class EmotionPoint {
  final double time;
  final int level;
  final String description;
  EmotionPoint({required this.time, required this.level, required this.description});
  factory EmotionPoint.fromJson(Map<String, dynamic> json) => EmotionPoint(
    time: (json['time'] ?? 0).toDouble(),
    level: json['level'] ?? 5,
    description: json['description'] ?? '',
  );
}

class Engagement {
  final String hookType;
  final double hookPosition;
  final List<String> interactionHooks;
  final String commentBait;
  Engagement({required this.hookType, required this.hookPosition, required this.interactionHooks, required this.commentBait});
  factory Engagement.fromJson(Map<String, dynamic> json) => Engagement(
    hookType: json['hookType'] ?? '',
    hookPosition: (json['hookPosition'] ?? 0).toDouble(),
    interactionHooks: List<String>.from(json['interactionHooks'] ?? []),
    commentBait: json['commentBait'] ?? '',
  );
}
