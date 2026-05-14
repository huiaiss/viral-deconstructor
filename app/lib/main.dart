import 'package:flutter/material.dart';

void main() {
  runApp(const ViralDeconstructorApp());
}

class ViralDeconstructorApp extends StatelessWidget {
  const ViralDeconstructorApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Viral Deconstructor',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
      ),
      home: const HomeScreen(),
    );
  }
}

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Viral Deconstructor'),
      ),
      body: const Center(
        child: Text('Analyze viral videos'),
      ),
    );
  }
}
