import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../models/deconstruction.dart';

class EmotionCurve extends StatelessWidget {
  final List<EmotionPoint> points;
  const EmotionCurve({super.key, required this.points});

  @override
  Widget build(BuildContext context) {
    if (points.isEmpty) return const SizedBox.shrink();
    final spots = points.map((p) => FlSpot(p.time, p.level.toDouble())).toList();
    return SizedBox(
      height: 200,
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: LineChart(
          LineChartData(
            gridData: const FlGridData(show: false),
            titlesData: const FlTitlesData(show: false),
            borderData: FlBorderData(show: false),
            lineBarsData: [
              LineChartBarData(
                spots: spots,
                isCurved: true,
                color: Theme.of(context).colorScheme.primary,
                barWidth: 3,
                dotData: const FlDotData(show: false),
                belowBarData: BarAreaData(show: true, color: Theme.of(context).colorScheme.primary.withAlpha(40)),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
