import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/auth_service.dart';
import '../../services/api_service.dart';
import '../../models/deconstruction.dart';
import '../../widgets/shot_card.dart';
import '../../widgets/emotion_curve.dart';
import '../plan/adapter_screen.dart';

class ReportScreen extends StatefulWidget {
  final String deconstructionId;
  const ReportScreen({super.key, required this.deconstructionId});

  @override
  State<ReportScreen> createState() => _ReportScreenState();
}

class _ReportScreenState extends State<ReportScreen> with SingleTickerProviderStateMixin {
  late TabController _tabCtrl;
  DeconstructionResult? _result;
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _tabCtrl = TabController(length: 4, vsync: this);
    _load();
  }

  Future<void> _load() async {
    final auth = context.read<AuthService>();
    final api = ApiService(auth);
    final data = await api.getDeconstruction(widget.deconstructionId);
    setState(() {
      _result = DeconstructionResult.fromJson(data['result'] ?? {});
      _loading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(_result?.overview.title ?? '拆解报告'),
        bottom: TabBar(
          controller: _tabCtrl,
          tabs: const [
            Tab(text: '分镜'),
            Tab(text: '文案'),
            Tab(text: '节奏'),
            Tab(text: '情绪'),
          ],
        ),
      ),
      body: _loading
        ? const Center(child: CircularProgressIndicator())
        : TabBarView(
            controller: _tabCtrl,
            children: [
              _shotsTab(),
              _scriptTab(),
              _rhythmTab(),
              _emotionTab(),
            ],
          ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: ElevatedButton(
            onPressed: () => Navigator.push(context, MaterialPageRoute(
              builder: (_) => AdapterScreen(deconstructionId: widget.deconstructionId))),
            style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
            child: const Text('生成拍摄方案', style: TextStyle(fontSize: 16)),
          ),
        ),
      ),
    );
  }

  Widget _shotsTab() {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(vertical: 8),
      itemCount: _result?.shots.length ?? 0,
      itemBuilder: (_, i) => ShotCard(shot: _result!.shots[i]),
    );
  }

  Widget _scriptTab() {
    final s = _result?.script;
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _section('钩子句', s?.hook ?? ''),
          _section('关键词', s?.keywords.join('、') ?? ''),
          _section('完整文案', s?.fullText ?? ''),
          _section('互动引导', s?.cta ?? ''),
        ],
      ),
    );
  }

  Widget _rhythmTab() {
    final r = _result?.rhythm;
    return SingleChildScrollView(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _section('BPM', '${r?.bpm ?? 0}'),
          _section('剪辑节奏', r?.cutSpeed ?? ''),
          _section('BGM情绪', r?.musicMood ?? ''),
          ...(r?.climaxPoints.map((c) => _section('高潮点 ${c.time}s', c.description)) ?? []),
        ],
      ),
    );
  }

  Widget _emotionTab() {
    return SingleChildScrollView(
      child: Column(
        children: [
          const SizedBox(height: 16),
          const Text('情绪曲线'),
          EmotionCurve(points: _result?.emotionCurve ?? []),
          const Divider(),
          ...(_result?.emotionCurve.map((e) => ListTile(
            title: Text(e.description),
            trailing: Text('${e.time}s · 强度${e.level}'),
          )) ?? []),
        ],
      ),
    );
  }

  Widget _section(String label, String content) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(label, style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.grey)),
          const SizedBox(height: 4),
          Text(content, style: const TextStyle(fontSize: 15)),
        ],
      ),
    );
  }
}
