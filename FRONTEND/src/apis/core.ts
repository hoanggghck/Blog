// src/lib/ApiService.ts
import axios, { AxiosInstance, AxiosProgressEvent, AxiosRequestConfig, AxiosResponse } from "axios";
import type { ApiResponseType } from "@/types/common";

export class ApiService {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
      },
    });
    this.setupInterceptors();
  }

  private getToken(key = 'accessToken'): string | null {
    if (typeof window !== "undefined") {
      return localStorage.getItem(key);
    }
    return '';
  }


  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        config.headers.Authorization = `Bearer ${this.getToken()}`;
        config.headers['refreshToken'] = this.getToken('refreshToken');
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        if (error.response.data) {
          return Promise.reject(error.response.data);
        }
        return Promise.reject(error)
      }
    );
  }

  public async get<T, D = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponseType<T, D>>> {
    return this.client.get(url, config);
  }

  public async post<T, D, E = unknown>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig,
    progressCallback?: (progressEvent: AxiosProgressEvent) => void
  ): Promise<AxiosResponse<ApiResponseType<D, E>>> {
    return this.client.post(url, data, {
      ...config,
      onUploadProgress: (progressEvent) => {
        if (progressCallback) {
          progressCallback(progressEvent);
        }
      }
    });
  }

   public async put<T, D, E = unknown>(url: string, data?: T, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponseType<D, E>>> {
    return this.client.put(url, data, config);
  }

  public async delete<T, E = unknown>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<ApiResponseType<T, E>>> {
    return this.client.delete(url, config);
  }
}

export const apiService = new ApiService(process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:3000');