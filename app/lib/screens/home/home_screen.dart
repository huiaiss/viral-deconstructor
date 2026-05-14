import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../../services/auth_service.dart';
import '../../services/api_service.dart';
import '../../config/theme.dart';
import '../deconstruction/input_screen.dart';
import '../deconstruction/report_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  List<dynamic> _deconstructions = [];
  bool _loading = true;

  @override
  void initState() {
    super.initState();
    _loadHistory();
  }

  Future<void> _loadHistory() async {
    try {
      final auth = context.read<AuthService>();
      final api = ApiService(auth);
      final list = await api.getDeconstructions();
      setState(() { _deconstructions = list; _loading = false; });
    } catch (_) {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('短剧拆解')),
      body: _loading
        ? const Center(child: CircularProgressIndicator())
        : _deconstructions.isEmpty
          ? Center(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.video_library_outlined, size: 64, color: Colors.grey[300]),
                  const SizedBox(height: 16),
                  const Text('还没有拆解记录', style: TextStyle(color: AppTheme.textSecondary)),
                  const Text('点击下方按钮开始拆解第一条爆款视频'),
                ],
              ),
            )
          : ListView.builder(
              padding: const EdgeInsets.all(16),
              itemCount: _deconstructions.length,
              itemBuilder: (_, i) {
                final d = _deconstructions[i];
                return Card(
                  margin: const EdgeInsets.only(bottom: 12),
                  child: ListTile(
                    leading: _statusIcon(d['status']),
                    title: Text(d['source_url'], maxLines: 1, overflow: TextOverflow.ellipsis),
                    subtitle: Text('${d['platform'] ?? '未知平台'} · ${d['status']}'),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: d['status'] == 'completed'
                      ? () => Navigator.push(context, MaterialPageRoute(
                          builder: (_) => ReportScreen(deconstructionId: d['id'])))
                      : null,
                  ),
                );
              },
            ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const InputScreen())),
        icon: const Icon(Icons.add),
        label: const Text('新建拆解'),
      ),
    );
  }

  Widget _statusIcon(String status) {
    switch (status) {
      case 'completed': return const Icon(Icons.check_circle, color: Colors.green);
      case 'analyzing': return const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(strokeWidth: 2));
      case 'failed': return const Icon(Icons.error, color: Colors.red);
      default: return const Icon(Icons.hourglass_empty, color: Colors.grey);
    }
  }
}
