import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import type { ApiResponseType } from '@/types/common';

export class BaseApiService {
  private static instance: BaseApiService;
  protected client: AxiosInstance;
  private isServer: boolean;
  constructor() {
    this.isServer = typeof window === "undefined";
    this.client = axios.create({
      baseURL: process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:3000',
      headers: {
        'Content-Type': 'application/json',
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

  public setToken(accessToken?: string | null, refreshToken?: string | null) {
    if (accessToken) {
      this.client.defaults.headers["Authorization"] = `Bearer ${accessToken}`;
    } else {
      delete this.client.defaults.headers["Authorization"];
    }
    if (refreshToken) {
      this.client.defaults.headers["refreshToken"] = refreshToken;
    } else {
      delete this.client.defaults.headers["refreshToken"];
    }
  }

  private async getToken() {
    let accessToken, refreshToken
    if (this.isServer) {
      const { cookies } = await import("next/headers");
      const cookieStore = await cookies();
      accessToken =  cookieStore.get("accessToken")?.value || null;
      refreshToken =  cookieStore.get("refreshToken")?.value || null;
    } else {
      const match1 = document.cookie.match(new RegExp('(^| )' + 'accessToken' + '=([^;]+)'));
      const match2 = document.cookie.match(new RegExp('(^| )' + 'accessToken' + '=([^;]+)'));
      accessToken = match1 ? match1[2] : null;
      refreshToken = match2 ? match2[2] : null;
    }
    return { accessToken, refreshToken }
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      async (config) => {
        const { accessToken, refreshToken } = await this.getToken();
        if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
        if (refreshToken) config.headers['refreshToken'] = refreshToken;
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

export const apiService = BaseApiService.getInstance();
