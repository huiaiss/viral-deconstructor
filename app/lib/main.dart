import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'services/auth_service.dart';
import 'app.dart';

void main() {
  runApp(
    Provider(create: (_) => AuthService(), child: const ViralDeconstructorApp()),
  );
}
