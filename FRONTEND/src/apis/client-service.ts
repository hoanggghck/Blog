// src/lib/ClientApiService.ts
"use client";

import { BaseApiService } from '@/lib/api-service';
import { getCookie } from 'cookies-next';

class ClientApiService extends BaseApiService {
  constructor() {
    super();
  }

  // Implementation for client-side
  protected getAuthTokens() {
    const accessToken = getCookie('accessToken');
    const refreshToken = getCookie('refreshToken');
    return {
      accessToken: typeof accessToken === 'string' ? accessToken : (accessToken?.toString() ?? null),
      refreshToken: typeof refreshToken === 'string' ? refreshToken : (refreshToken?.toString() ?? null),
    };
  }
}

export const clientApiService = new ClientApiService();