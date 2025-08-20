import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import type { ApiResponseType } from '@/types/common';

// Define a type for the tokens object
type AuthTokens = {
  accessToken: string | null | undefined;
  refreshToken: string | null | undefined;
};

export abstract class BaseApiService {
  protected client: AxiosInstance;
  constructor(config?: AxiosRequestConfig) {
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:3000',
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });
    this.setupInterceptors();
  }

  protected abstract getAuthTokens(): Promise<AuthTokens> | AuthTokens;

  private setupInterceptors() {
    this.client.interceptors.request.use(
      async (config) => {
        const { accessToken, refreshToken } = await Promise.resolve(this.getAuthTokens());

        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        if (refreshToken) {
          config.headers['refreshToken'] = refreshToken;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        if (error.response?.data) {
          return Promise.resolve(error.response.data);
        }
        return Promise.reject(error);
      },
    );
  }
  public async get<T, D = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<ApiResponseType<T, D>>> {
    return this.client.get(url, config);
  }

  public async post<T, D, E = unknown>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<ApiResponseType<D, E>>> {
    return this.client.post(url, data, config);
  }

  public async put<T, D, E = unknown>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<ApiResponseType<D, E>>> {
    return this.client.put(url, data, config);
  }

  public async delete<T, E = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<ApiResponseType<T, E>>> {
    return this.client.delete(url, config);
  }
}