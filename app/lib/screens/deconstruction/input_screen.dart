import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/auth_service.dart';
import '../../services/api_service.dart';
import 'report_screen.dart';

class InputScreen extends StatefulWidget {
  const InputScreen({super.key});

  @override
  State<InputScreen> createState() => _InputScreenState();
}

class _InputScreenState extends State<InputScreen> {
  final _urlCtrl = TextEditingController();
  bool _loading = false;
  String? _error;

  Future<void> _submit() async {
    final url = _urlCtrl.text.trim();
    if (url.isEmpty) return;
    setState(() { _loading = true; _error = null; });

    try {
      final auth = context.read<AuthService>();
      final api = ApiService(auth);
      final result = await api.createDeconstruction(url);
      final id = result['id'];
      String status = result['status'] ?? 'pending';
      while (status == 'pending' || status == 'analyzing') {
        await Future.delayed(const Duration(seconds: 3));
        final dc = await api.getDeconstruction(id);
        status = dc['status'] ?? 'failed';
        if (status == 'completed') {
          if (!mounted) return;
          Navigator.pushReplacement(context, MaterialPageRoute(
            builder: (_) => ReportScreen(deconstructionId: id)));
          return;
        }
        if (status == 'failed') {
          setState(() { _error = '拆解失败，请重试'; _loading = false; });
          return;
        }
      }
    } catch (e) {
      setState(() { _error = e.toString(); _loading = false; });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('新建拆解')),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text('粘贴爆款视频链接', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            const Text('支持抖音/快手/TikTok/小红书/B站', style: TextStyle(color: Colors.grey)),
            const SizedBox(height: 24),
            TextField(
              controller: _urlCtrl,
              decoration: InputDecoration(
                hintText: '粘贴链接到这里...',
                border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                prefixIcon: const Icon(Icons.link),
              ),
              maxLines: 3,
            ),
            if (_error != null) Padding(
              padding: const EdgeInsets.only(top: 12),
              child: Text(_error!, style: const TextStyle(color: Colors.red)),
            ),
            const SizedBox(height: 24),
            ElevatedButton(
              onPressed: _loading ? null : _submit,
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: _loading
                ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                : const Text('开始拆解', style: TextStyle(fontSize: 16)),
            ),
          ],
        ),
      ),
    );
  }
}
