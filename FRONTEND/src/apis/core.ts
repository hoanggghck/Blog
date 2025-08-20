// src/lib/ApiService.ts
import axios, { AxiosInstance, AxiosProgressEvent, AxiosRequestConfig, AxiosResponse } from "axios";
import type { ApiResponseType } from "@/types/common";
import { getCookie } from "cookies-next";
import { cookies } from "next/headers";
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

  private getToken(key = "accessToken"): string | null {
    const token = getCookie(key);
    return token ? String(token) : null;
  }


  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        const accessToken = this.getToken("accessToken");
        const refreshToken = this.getToken("refreshToken");
        
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        if (refreshToken) {
          config.headers["refreshToken"] = refreshToken;
        }
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