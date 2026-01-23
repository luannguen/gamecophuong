import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import App from './App.jsx'
import './index.css'
import { ToastProvider } from './components/shared/hooks/useToast.jsx'
import { ConfirmDialogProvider } from './components/shared/hooks/useConfirmDialog.jsx'

// React Query client with default options
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30 * 1000, // 30 seconds
            cacheTime: 5 * 60 * 1000, // 5 minutes
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
})

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
                <ToastProvider>
                    <ConfirmDialogProvider>
                        <App />
                    </ConfirmDialogProvider>
                </ToastProvider>
            </BrowserRouter>
        </QueryClientProvider>
    </React.StrictMode>,
)
