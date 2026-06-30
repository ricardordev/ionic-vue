import { apiClient } from '@/api/axios.config';

export class ApiService {
  
  /**
   * GET method
   * If list, call as: ApiService.get<Type[]>('/users')
   * If object, call as: ApiService.get<Type>('/users/1')
   */
  static async get<T>(url: string): Promise<T> {
    const response = await apiClient.get<T>(url);
    return response.data;
  }

  /**
   * POST method
   * T = Type of return (Response)
   * D = Type of data sent (Payload/Body) - Optional, defaults to unknown
   */
  static async post<T, D = unknown>(url: string, data: D): Promise<T> {
    const response = await apiClient.post<T>(url, data);
    return response.data;
  }

  /**
   * PUT method
   * T = Type of return (Response)
   * D = Type of data sent (Payload/Body) - Optional, defaults to unknown
   */
  static async put<T, D = unknown>(url: string, data: D): Promise<T> {
    const response = await apiClient.put<T>(url, data);
    return response.data;
  }

  /**
   * DELETE method
   * T = Type of return (Response)
   */
  static async delete<T>(url: string): Promise<T> {
    const response = await apiClient.delete<T>(url);
    return response.data;
  }
}