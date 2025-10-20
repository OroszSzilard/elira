import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "@/styles/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { ReactQueryProvider } from "@/components/react-query-provider"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { Toaster } from 'sonner'
import Script from 'next/script'
import { AuthProvider } from '@/components/auth-provider'
import { ThemeSync } from '@/components/theme-sync'

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Elira – Magyarország legjobb oktatási platformja",
  description: "Fedezzen fel hiteles magyarországi egyetemi kurzusokat és szerezzen elismert bizonyítványokat.",
  keywords: [
    "online képzés",
    "magyar egyetemek",
    "elismert bizonyítvány",
    "karrier fejlesztés"
  ],
  alternates: {
    canonical: "/",
    languages: {
      hu: "/"
    }
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="hu" suppressHydrationWarning>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config','${process.env.NEXT_PUBLIC_GA_ID}', { page_path: window.location.pathname });`}
      </Script>
      <body className={`${inter.className} min-h-screen`}>
        <ErrorBoundary>
          <ReactQueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <AuthProvider>
                <ThemeSync />
                {children}
              </AuthProvider>
              <Toaster position="bottom-right" />
            </ThemeProvider>
          </ReactQueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  )
} 