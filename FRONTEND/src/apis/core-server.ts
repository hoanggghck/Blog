// src/lib/ServerApiService.ts

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { cookies } from "next/headers";
import type { ApiResponseType } from "@/types/common";
import { getCookie } from "cookies-next";

export class ServerApiService {
  private client: AxiosInstance;

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        "Content-Type": "application/json",
        Origin: process.env.NEXT_PUBLIC_BASE_URL
      },
    });

    // Setup interceptors for response
    this.setupResponseInterceptor();
    // Setup interceptors for request specifically for server-side
    this.setupRequestInterceptor();
  }

  private setupRequestInterceptor() {
    this.client.interceptors.request.use(
      async (config) => {
        // Lấy cookies từ server-side context
        const cookieStore = await cookies();
        const accessToken = cookieStore.get("accessToken")?.value;
        const refreshToken = cookieStore.get("refreshToken")?.value;

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
  }

  private setupResponseInterceptor() {
    this.client.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      async (error) => {
        if (error.response?.data) {
          return Promise.reject(error.response.data);
        }
        return Promise.reject(error);
      }
    );
  }

  public async get<T, D = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponseType<T, D>>> {
    return this.client.get(url, config);
  }

  public async post<T, D, E = unknown>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponseType<D, E>>> {
    return this.client.post(url, data, config);
  }

  public async put<T, D, E = unknown>(
    url: string,
    data?: T,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponseType<D, E>>> {
    return this.client.put(url, data, config);
  }

  public async delete<T, E = unknown>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<ApiResponseType<T, E>>> {
    return this.client.delete(url, config);
  }
}

// Khởi tạo một instance duy nhất cho Server-Side
export const serverApiService = new ServerApiService(process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:3000');