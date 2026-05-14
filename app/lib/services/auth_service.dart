import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../config/api_config.dart';

class AuthService {
  final Dio _dio = Dio(BaseOptions(baseUrl: ApiConfig.baseUrl));
  final _storage = const FlutterSecureStorage();
  String? _token;

  Future<String?> get token async => _token ??= await _storage.read(key: 'jwt');

  Future<void> _saveToken(String t) async {
    _token = t;
    await _storage.write(key: 'jwt', value: t);
  }

  Future<void> logout() async {
    _token = null;
    await _storage.delete(key: 'jwt');
  }

  Map<String, dynamic> _authHeaders() => {
    'Authorization': 'Bearer $_token',
  };

  Future<Map<String, dynamic>> register(String email, String password, String? nickname) async {
    final res = await _dio.post('/auth/register', data: {
      'email': email, 'password': password, 'nickname': nickname,
    });
    await _saveToken(res.data['token']);
    return res.data['user'];
  }

  Future<Map<String, dynamic>> login(String email, String password) async {
    final res = await _dio.post('/auth/login', data: {
      'email': email, 'password': password,
    });
    await _saveToken(res.data['token']);
    return res.data['user'];
  }

  Future<Map<String, dynamic>> getProfile() async {
    final res = await _dio.get('/auth/me', options: Options(headers: _authHeaders()));
    return res.data['user'];
  }
}
