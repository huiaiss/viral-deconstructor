import 'package:dio/dio.dart';
import '../config/api_config.dart';
import 'auth_service.dart';

class ApiService {
  final AuthService auth;
  final Dio _dio;

  ApiService(this.auth) : _dio = Dio(BaseOptions(
    baseUrl: ApiConfig.baseUrl,
    connectTimeout: const Duration(seconds: 10),
    receiveTimeout: const Duration(seconds: 120),
  ));

  Future<Map<String, dynamic>> createDeconstruction(String url) async {
    final token = await auth.token;
    final res = await _dio.post('/deconstructions', data: {'url': url},
      options: Options(headers: {'Authorization': 'Bearer $token'}));
    return res.data;
  }

  Future<Map<String, dynamic>> getDeconstruction(String id) async {
    final token = await auth.token;
    final res = await _dio.get('/deconstructions/$id',
      options: Options(headers: {'Authorization': 'Bearer $token'}));
    return res.data;
  }

  Future<List<dynamic>> getDeconstructions() async {
    final token = await auth.token;
    final res = await _dio.get('/deconstructions',
      options: Options(headers: {'Authorization': 'Bearer $token'}));
    return res.data['list'];
  }

  Future<Map<String, dynamic>> createPlan(String deconstructionId, String track, String? referenceUrl) async {
    final token = await auth.token;
    final res = await _dio.post('/plans', data: {
      'deconstructionId': deconstructionId,
      'track': track,
      'referenceUrl': referenceUrl,
    }, options: Options(headers: {'Authorization': 'Bearer $token'}));
    return res.data;
  }

  Future<Map<String, dynamic>> getPlan(String id) async {
    final token = await auth.token;
    final res = await _dio.get('/plans/$id',
      options: Options(headers: {'Authorization': 'Bearer $token'}));
    return res.data;
  }

  Future<List<dynamic>> getPlans() async {
    final token = await auth.token;
    final res = await _dio.get('/plans',
      options: Options(headers: {'Authorization': 'Bearer $token'}));
    return res.data['list'];
  }

  String getPdfUrl(String planId) {
    return '${ApiConfig.export}/pdf/$planId';
  }
}
