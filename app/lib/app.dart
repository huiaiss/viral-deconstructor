import 'package:flutter/material.dart';
import 'config/theme.dart';
import 'screens/home/home_screen.dart';
import 'screens/auth/login_screen.dart';

class ViralDeconstructorApp extends StatelessWidget {
  const ViralDeconstructorApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: '短剧拆解',
      theme: AppTheme.light,
      home: const HomeScreen(),
      routes: {
        '/login': (_) => const LoginScreen(),
      },
    );
  }
}
