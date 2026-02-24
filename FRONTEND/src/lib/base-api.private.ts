import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import toast from 'react-hot-toast';

import type { ApiResponseType } from '@/types/common';

import { HTTP_STATUS } from '@/const/httpStatus';
import { getCookies, setCookies } from '@/lib/cookies';
import { navigateTo } from '@/utils/navigation';

export class BaseApiService {
  private static instance: BaseApiService;
  protected client: AxiosInstance;
  constructor(headers: Record<string, string> = { 'Content-Type': 'application/json' }) {
    const baseURL = typeof window === 'undefined'
    ? (process.env.INTERNAL_API || 'http://localhost:3088')   // server-side
    : (process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:3088'); // client-side
    this.client = axios.create({
      baseURL: baseURL,
      headers: {
        ...headers,
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
      const { status, data } = await this.client.get("/refresh");
      if (status === HTTP_STATUS.Success) {
        const newAccess = data.result.accessToken;
        const newRefresh = data.result.refreshToken;
        sessionStorage.setItem('accessToken', newAccess);
        await setCookies(newRefresh)
        const originalRequest = error.config;
        if (originalRequest) {
          return this.client.request(originalRequest);
        }
      }
    } catch (e) {
      console.error(e);
    }
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      async (config) => {
        const accessToken = sessionStorage.getItem('accessToken');
        const { refreshToken } = await getCookies();
        if (!accessToken && !refreshToken) {
          return Promise.reject({
            code: 'NO_AUTH_TOKEN',
            message: 'Missing access token',
            config,
          });
        }
        config.headers['Authorization'] = `Bearer ${accessToken}`;
        config.headers['refreshToken'] = refreshToken;
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
          toast.error(error.response?.data?.message || "Vui lòng đăng nhập lại");
          navigateTo("/login");
        }
        if (error.response?.status === HTTP_STATUS.TokenExpred) {
          return await this.handleRefreshToken(error);
        }
        if (error.response?.status === HTTP_STATUS.Forbidden) {
          navigateTo("/");
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

export const apiServicePrivate = BaseApiService.getInstance();
export const apiServicePrivateUploadFile = new BaseApiService({
  'Content-Type': 'multipart/form-data'
});
