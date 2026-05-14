class Shot {
  final int index;
  final double startTime;
  final double endTime;
  final double duration;
  final String shotType;
  final String cameraMovement;
  final String angle;
  final String transition;
  final String description;
  final String onScreenText;
  final String emotion;

  Shot({
    required this.index,
    required this.startTime,
    required this.endTime,
    required this.duration,
    required this.shotType,
    required this.cameraMovement,
    required this.angle,
    required this.transition,
    required this.description,
    required this.onScreenText,
    required this.emotion,
  });

  factory Shot.fromJson(Map<String, dynamic> json) => Shot(
    index: json['index'] ?? 0,
    startTime: (json['startTime'] ?? 0).toDouble(),
    endTime: (json['endTime'] ?? 0).toDouble(),
    duration: (json['duration'] ?? 0).toDouble(),
    shotType: json['shotType'] ?? '',
    cameraMovement: json['cameraMovement'] ?? '',
    angle: json['angle'] ?? '',
    transition: json['transition'] ?? '',
    description: json['description'] ?? '',
    onScreenText: json['onScreenText'] ?? '',
    emotion: json['emotion'] ?? '',
  );
}
