import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 3,
      retryDelay(failureCount) {
        return failureCount === 0 ? 2000 : 5000 
      },
    },
  },
})
