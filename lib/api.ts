import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

export class Api {
  private axiosInstance: AxiosInstance;

  constructor(path: string, token: string | null = null) {
    this.axiosInstance = axios.create({
      baseURL: `/api/${path}`,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (token) {
      this.setToken(token);
    }
  }

  setToken(token: string) {
    this.axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async request<T = any>(
    resource: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    data?: Record<string, any>,
    params?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.axiosInstance.request<T>({
        url: resource,
        method,
        data,
        params,
        ...config,
      });

      return response.data;
    } catch (error: any) {
      console.error('API request failed:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || error.message);
    }
  }

  get<T = any>(resource: string, params?: Record<string, any>, config?: AxiosRequestConfig) {
    return this.request<T>(resource, 'GET', undefined, params, config);
  }

  post<T = any>(resource: string, data: Record<string, any>, config?: AxiosRequestConfig) {
    return this.request<T>(resource, 'POST', data, undefined, config);
  }

  put<T = any>(resource: string, data: Record<string, any>, config?: AxiosRequestConfig) {
    return this.request<T>(resource, 'PUT', data, undefined, config);
  }

  delete<T = any>(resource: string, data: Record<string, any>, config?: AxiosRequestConfig) {
    return this.request<T>(resource, 'DELETE', data, undefined, config);
  }
}
