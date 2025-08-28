import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import type { ApiResponseType } from '@/types/common';
import { redirect } from 'next/navigation';
import { HTTP_STATUS } from '@/const/httpStatus';
import { getCookies } from './cookies';
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

  private async handleRefreshToken(
    error: any
  ): Promise<AxiosResponse<any> | void> {
    try {
      console.log(this.isServer ? 'server' : 'client');
      
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/set-cookie`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ accessToken: this.isServer ? 'serverToken' : 'clientToken', refreshToken: 'newRefresh', isServer: this.isServer }),
      });
      // const { status, data} = await this.client.get("/refresh");
      // if (status === HTTP_STATUS.Success) {
      //   const newAccess = data.result.accessToken;
      //   const newRefresh = data.result.refreshToken;
      //   console.log('refreshed', newAccess);
      //   const originalRequest = error.config;
      //   if (originalRequest) {
      //     return this.client.request(originalRequest);
      //   }
      // }
    } catch (e) {
      console.error(e);
    }
  }

  public async getToken() {
    const { accessToken, refreshToken } = await getCookies();
    return { accessToken: accessToken ?? '', refreshToken: refreshToken ?? '' };
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      async (config) => {
        const { accessToken, refreshToken } = await this.getToken();
        if (accessToken) {
          config.headers['Authorization'] = `Bearer ${accessToken}`;
        }
        if (refreshToken) {
          config.headers['refreshToken'] = refreshToken;
        }
        console.log(config.url, config.headers['Authorization']);
        return config;
      },
      (error) => {
        return Promise.reject(error);
      },
    );

    this.client.interceptors.response.use(
      async (response: AxiosResponse) => {
        const newAccess = response.headers["x-new-access-token"];
        const newRefresh = response.headers["x-new-refresh-token"];
        console.log('new', newAccess);
        
        if (newAccess && newRefresh) {
          await fetch("/api/set-cookie", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ accessToken: newAccess, refreshToken: newRefresh }),
          });
        }

        return response;
      },
      async (error) => {
        if (error.response?.status === HTTP_STATUS.Unauthorized) {
          // redirect("/login");
          return this.handleRefreshToken(error);
        }
        if (error.response?.status === HTTP_STATUS.TokenExpred) {
          return this.handleRefreshToken(error);
        }
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

export const apiService = new BaseApiService();
