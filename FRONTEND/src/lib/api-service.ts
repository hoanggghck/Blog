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

  constructor(baseURL: string, config?: AxiosRequestConfig) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...config?.headers,
      },
    });
    this.setupInterceptors();
  }

  // This abstract method must be implemented by child classes
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
          return Promise.reject(error.response.data);
        }
        return Promise.reject(error);
      },
    );
  }

  // Public API methods are defined here, common to both client and server
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