class ShootingPlan {
  final String title;
  final String estimatedTotalTime;
  final String difficulty;
  final Preparations preparations;
  final List<PlanShot> shots;
  final EditingGuide editingGuide;
  final PostingGuide postingGuide;

  ShootingPlan({
    required this.title,
    required this.estimatedTotalTime,
    required this.difficulty,
    required this.preparations,
    required this.shots,
    required this.editingGuide,
    required this.postingGuide,
  });

  factory ShootingPlan.fromJson(Map<String, dynamic> json) {
    final p = json['shootingPlan'] ?? json;
    return ShootingPlan(
      title: p['title'] ?? '',
      estimatedTotalTime: p['estimatedTotalTime'] ?? '',
      difficulty: p['difficulty'] ?? '',
      preparations: Preparations.fromJson(p['preparations'] ?? {}),
      shots: (p['shots'] as List? ?? []).map((s) => PlanShot.fromJson(s)).toList(),
      editingGuide: EditingGuide.fromJson(p['editingGuide'] ?? {}),
      postingGuide: PostingGuide.fromJson(p['postingGuide'] ?? {}),
    );
  }
}

class Preparations {
  final List<String> equipment;
  final List<String> props;
  final String location;
  final String costume;
  final String lighting;
  Preparations({required this.equipment, required this.props, required this.location, required this.costume, required this.lighting});
  factory Preparations.fromJson(Map<String, dynamic> json) => Preparations(
    equipment: List<String>.from(json['equipment'] ?? []),
    props: List<String>.from(json['props'] ?? []),
    location: json['location'] ?? '',
    costume: json['costume'] ?? '',
    lighting: json['lighting'] ?? '',
  );
}

class PlanShot {
  final int index;
  final double duration;
  final String shotType;
  final String cameraHowTo;
  final String script;
  final String actingTip;
  final String prop;
  final String easyAlternative;
  final String checkPoint;
  PlanShot({required this.index, required this.duration, required this.shotType, required this.cameraHowTo, required this.script, required this.actingTip, required this.prop, required this.easyAlternative, required this.checkPoint});
  factory PlanShot.fromJson(Map<String, dynamic> json) => PlanShot(
    index: json['index'] ?? 0,
    duration: (json['duration'] ?? 0).toDouble(),
    shotType: json['shotType'] ?? '',
    cameraHowTo: json['cameraHowTo'] ?? '',
    script: json['script'] ?? '',
    actingTip: json['actingTip'] ?? '',
    prop: json['prop'] ?? '',
    easyAlternative: json['easyAlternative'] ?? '',
    checkPoint: json['checkPoint'] ?? '',
  );
}

class EditingGuide {
  final String app;
  final List<String> cuts;
  final String musicStart;
  final String captions;
  EditingGuide({required this.app, required this.cuts, required this.musicStart, required this.captions});
  factory EditingGuide.fromJson(Map<String, dynamic> json) => EditingGuide(
    app: json['app'] ?? '剪映',
    cuts: List<String>.from(json['cuts'] ?? []),
    musicStart: json['musicStart'] ?? '',
    captions: json['captions'] ?? '',
  );
}

class PostingGuide {
  final String title;
  final List<String> hashtags;
  final String bestTime;
  final String coverTip;
  PostingGuide({required this.title, required this.hashtags, required this.bestTime, required this.coverTip});
  factory PostingGuide.fromJson(Map<String, dynamic> json) => PostingGuide(
    title: json['title'] ?? '',
    hashtags: List<String>.from(json['hashtags'] ?? []),
    bestTime: json['bestTime'] ?? '',
    coverTip: json['coverTip'] ?? '',
  );
}
