import 'package:flutter/material.dart';
import '../models/deconstruction.dart';

class ShotCard extends StatelessWidget {
  final Shot shot;
  const ShotCard({super.key, required this.shot});

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.symmetric(vertical: 6, horizontal: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(radius: 14, child: Text('${shot.index}', style: const TextStyle(fontSize: 12))),
                const SizedBox(width: 12),
                Text('${shot.shotType} · ${shot.cameraMovement}', style: const TextStyle(fontWeight: FontWeight.bold)),
                const Spacer(),
                Text('${shot.duration.toStringAsFixed(1)}s', style: const TextStyle(color: Colors.grey)),
              ],
            ),
            const Divider(),
            Text(shot.description),
            if (shot.onScreenText.isNotEmpty) ...[
              const SizedBox(height: 8),
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(color: Colors.grey[100], borderRadius: BorderRadius.circular(8)),
                child: Text('字幕: ${shot.onScreenText}', style: const TextStyle(fontSize: 12)),
              ),
            ],
          ],
        ),
      ),
    );
  }
}
