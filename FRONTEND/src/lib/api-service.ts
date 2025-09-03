import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import type { ApiResponseType } from '@/types/common';
import { redirect } from 'next/navigation';
import { HTTP_STATUS } from '@/const/httpStatus';
import { getCookies, setCookies } from './cookies';
export class BaseApiService {
  private static instance: BaseApiService;
  protected client: AxiosInstance;
  private isServer: boolean;
  constructor(headers: Record<string, string> = { 'Content-Type': 'application/json' }) {
    this.isServer = typeof window === "undefined";
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:3000',
      headers: {
        ...headers,
        "Origin": this.isServer ? process.env.NEXT_PUBLIC_BASE_URL : undefined,
        "Cache-Control": "no-cache",
      }
    });
    this.setupInterceptors();
  }

  public static getInstance() {
    if (!BaseApiService.instance) {
      BaseApiService.instance = new BaseApiService();
    }
    return BaseApiService.instance;
  }

  private async handleRefreshToken(
    error: any
  ): Promise<AxiosResponse<any> | void> {
    try {
      if (!this.isServer) {
        const { status, data } = await this.client.get("/refresh");
        if (status === HTTP_STATUS.Success) {
          const newAccess = data.result.accessToken;
          const newRefresh = data.result.refreshToken;
          await setCookies(newAccess, newRefresh);
          const originalRequest = error.config;
          if (originalRequest) {
            return this.client.request(originalRequest);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      async (config) => {
        const { accessToken, refreshToken } = await getCookies();
        if (accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
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
      async (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        if (error.response?.status === HTTP_STATUS.Unauthorized) {
          redirect("/login");
        }
        if (error.response?.status === HTTP_STATUS.TokenExpred) {
          return await this.handleRefreshToken(error);
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

export const apiService = new BaseApiService();
export const apiServiceUploadFile = new BaseApiService({
  'Content-Type': 'multipart/form-data'
});
