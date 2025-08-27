// src/providers/ReactQueryProvider.tsx
"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/lib/react-query";
import { useEffect, useState } from "react";
import { apiService } from "@/lib/api-service";

export default function ReactQueryProvider(
  { children, accessToken, refreshToken }:
  { children: React.ReactNode, accessToken: string | null, refreshToken: string | null }
) {
  const [isReady, setIsReady] = useState(false);
  useEffect(() => {
    setIsReady(!!(accessToken && refreshToken));
    if (accessToken && refreshToken) {
      apiService.setToken(accessToken, refreshToken);
    }
  }, [accessToken, refreshToken]);

  return (
    <QueryClientProvider client={queryClient}>
      { isReady && children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
