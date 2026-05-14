import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/auth_service.dart';
import '../../services/api_service.dart';
import '../../models/plan.dart';
import '../../config/api_config.dart';
import 'package:url_launcher/url_launcher.dart';

class PlanScreen extends StatefulWidget {
  final String planId;
  const PlanScreen({super.key, required this.planId});

  @override
  State<PlanScreen> createState() => _PlanScreenState();
}

class _PlanScreenState extends State<PlanScreen> {
  ShootingPlan? _plan;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final auth = context.read<AuthService>();
    final api = ApiService(auth);
    final data = await api.getPlan(widget.planId);
    setState(() {
      _plan = ShootingPlan.fromJson(data['result'] ?? {});
      _loading = false;
    });
  }

  Future<void> _exportPdf() async {
    final auth = context.read<AuthService>();
    final token = await auth.token;
    final url = '${ApiConfig.baseUrl}/export/pdf/${widget.planId}?token=$token';
    await launchUrl(Uri.parse(url), mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    if (_loading) return const Scaffold(body: Center(child: CircularProgressIndicator()));
    final p = _plan!;
    return Scaffold(
      appBar: AppBar(
        title: Text(p.title),
        actions: [
          IconButton(icon: const Icon(Icons.download), onPressed: _exportPdf, tooltip: '导出PDF'),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          _sectionCard('基本信息', [
            '难度: ${p.difficulty}',
            '预计时长: ${p.estimatedTotalTime}',
          ]),
          _sectionCard('拍摄准备', [
            '设备: ${p.preparations.equipment.join('、')}',
            '道具: ${p.preparations.props.join('、')}',
            '场景: ${p.preparations.location}',
            '服装: ${p.preparations.costume}',
            '灯光: ${p.preparations.lighting}',
          ]),
          const Text('分镜拍摄表', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          const SizedBox(height: 12),
          ...p.shots.map((s) => Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(children: [
                    CircleAvatar(radius: 14, child: Text('${s.index}')),
                    const SizedBox(width: 8),
                    Text(s.shotType, style: const TextStyle(fontWeight: FontWeight.bold)),
                    const Spacer(),
                    Text('${s.duration}s', style: const TextStyle(color: Colors.grey)),
                  ]),
                  const Divider(),
                  _field('怎么拍', s.cameraHowTo),
                  _field('台词', s.script),
                  if (s.actingTip.isNotEmpty) _field('表演提示', s.actingTip),
                  if (s.easyAlternative.isNotEmpty) _field('偷懒方案', s.easyAlternative),
                  if (s.checkPoint.isNotEmpty) _field('拍完检查', s.checkPoint),
                ],
              ),
            ),
          )),
          _sectionCard('剪辑指南', [
            '软件: ${p.editingGuide.app}',
            ...p.editingGuide.cuts,
            'BGM起点: ${p.editingGuide.musicStart}',
            '字幕风格: ${p.editingGuide.captions}',
          ]),
          _sectionCard('发布指南', [
            '标题: ${p.postingGuide.title}',
            '标签: ${p.postingGuide.hashtags.join(' ')}',
            '最佳时间: ${p.postingGuide.bestTime}',
            '封面: ${p.postingGuide.coverTip}',
          ]),
        ],
      ),
    );
  }

  Widget _sectionCard(String title, List<String> items) {
    return Card(
      margin: const EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            ...items.map((i) => Padding(
              padding: const EdgeInsets.only(top: 4),
              child: Text(i, style: const TextStyle(fontSize: 14)),
            )),
          ],
        ),
      ),
    );
  }

  Widget _field(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(top: 8),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.grey, fontSize: 12)),
          const SizedBox(height: 2),
          Text(value, style: const TextStyle(fontSize: 14)),
        ],
      ),
    );
  }
}
