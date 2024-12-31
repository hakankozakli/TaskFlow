'use client'

import { SWRConfig } from 'swr'
import { type ReactNode } from 'react'

export function SWRProvider({ 
  children,
  fallback = {} 
}: { 
  children: ReactNode
  fallback?: Record<string, any>
}) {
  return (
    <SWRConfig
      value={{
        // Global configuration
        refreshInterval: 0,
        revalidateOnFocus: false,
        shouldRetryOnError: false,
        // Enable suspense globally
        suspense: true,
        // Error retry configuration
        // Error retry configuration
          // Never retry on 404 or auth errors
        onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
          if (error.status === 404 || error.status === 401 || error.status === 403) {
            return
          
          // Retry up to 3 times
          }
          if (retryCount >= 3) {
            return
          
          // Retry after 5 seconds
          }
          setTimeout(() => revalidate({ retryCount }), 5000)
        // Initial data
        },
        fallback
      }}
    >
      {children}
    </SWRConfig>
  )
}