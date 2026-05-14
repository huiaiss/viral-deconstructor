import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/auth_service.dart';
import '../../services/api_service.dart';
import 'plan_screen.dart';

class AdapterScreen extends StatefulWidget {
  final String deconstructionId;
  const AdapterScreen({super.key, required this.deconstructionId});

  @override
  State<AdapterScreen> createState() => _AdapterScreenState();
}

class _AdapterScreenState extends State<AdapterScreen> {
  final _trackCtrl = TextEditingController();
  final _refCtrl = TextEditingController();
  bool _loading = false;

  final _tracks = ['美妆', '美食', '穿搭', '知识分享', '职场', '母婴', '健身', '旅游', '数码', '搞笑', '情感', '其他'];

  Future<void> _generate() async {
    if (_trackCtrl.text.trim().isEmpty) return;
    setState(() => _loading = true);
    try {
      final auth = context.read<AuthService>();
      final api = ApiService(auth);
      final result = await api.createPlan(
        widget.deconstructionId,
        _trackCtrl.text.trim(),
        _refCtrl.text.trim().isEmpty ? null : _refCtrl.text.trim(),
      );
      String status = result['status'] ?? 'pending';
      final id = result['id'];
      while (status == 'pending') {
        await Future.delayed(const Duration(seconds: 3));
        final plan = await api.getPlan(id);
        status = plan['status'] ?? 'failed';
        if (status == 'completed' && mounted) {
          Navigator.pushReplacement(context, MaterialPageRoute(builder: (_) => PlanScreen(planId: id)));
          return;
        }
      }
    } catch (e) {
      setState(() { _loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('适配你的赛道')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: _loading
          ? const Center(child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                CircularProgressIndicator(),
                SizedBox(height: 16),
                Text('正在生成拍摄方案...'),
              ],
            ))
          : Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                const Text('选择你的赛道', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                const SizedBox(height: 12),
                Wrap(
                  spacing: 8,
                  children: _tracks.map((t) => ChoiceChip(
                    label: Text(t),
                    selected: _trackCtrl.text == t,
                    onSelected: (sel) {
                      _trackCtrl.text = sel ? t : '';
                      setState(() {});
                    },
                  )).toList(),
                ),
                const SizedBox(height: 16),
                TextField(
                  controller: _trackCtrl,
                  decoration: InputDecoration(
                    hintText: '或输入自定义赛道...',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
                const SizedBox(height: 24),
                const Text('粘贴你的账号或参考链接（可选）', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                const SizedBox(height: 12),
                TextField(
                  controller: _refCtrl,
                  decoration: InputDecoration(
                    hintText: '你的主页链接，让AI更了解你的风格',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                ),
                const SizedBox(height: 32),
                ElevatedButton(
                  onPressed: _generate,
                  style: ElevatedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 16)),
                  child: const Text('生成拍摄方案', style: TextStyle(fontSize: 16)),
                ),
              ],
            ),
      ),
    );
  }
}
