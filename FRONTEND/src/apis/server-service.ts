// src/lib/ServerApiService.ts

import { BaseApiService } from '@/lib/api-service';
import { cookies as nextCookies } from 'next/headers';

class ServerApiService extends BaseApiService {
  constructor(baseURL: string) {
    super(baseURL, {
      headers: {
        'Origin': process.env.NEXT_PUBLIC_BASE_URL
      }
    });
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

export const serverApiService = new ServerApiService(
  process.env.NEXT_PUBLIC_BASE_API || 'http://localhost:3000',
);