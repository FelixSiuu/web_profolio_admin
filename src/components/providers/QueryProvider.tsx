'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { useState } from 'react'

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5, // 5 分鐘內資料視為新鮮，不重複請求
            gcTime: 1000 * 60 * 10, // 快取留存 10 分鐘
            refetchOnWindowFocus: false, // 切換視窗不偷偷重新撈取
            retry: 1 // 失敗自動重試 1 次
          }
        }
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* 預設開啟 Devtools 懸浮球，只在開發環境顯示 */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
