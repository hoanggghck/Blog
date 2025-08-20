// src/lib/ServerApiService.ts

import { BaseApiService } from '@/lib/api-service';
import { cookies as nextCookies } from 'next/headers';

class ServerApiService extends BaseApiService {
  constructor() {
    super();
  }

  // Implementation for server-side
  protected async getAuthTokens() {
    try {
      const cookieStore = await nextCookies();
      const accessToken = cookieStore.get('accessToken')?.value;
      const refreshToken = cookieStore.get('refreshToken')?.value;
      return { accessToken, refreshToken };
    } catch (error) {
      return { accessToken: null, refreshToken: null };
    }
  }
}

export const serverApiService = new ServerApiService();
