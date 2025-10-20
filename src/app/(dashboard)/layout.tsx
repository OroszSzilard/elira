'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { Loader2 } from 'lucide-react'
import { UnifiedSidebar } from '@/components/navigation/unified-sidebar'
import { DashboardHeader } from '@/components/navigation/dashboard-header'

export default function DashboardRouteGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, authReady } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (authReady && !isLoading) {
      if (!user) {
        console.log('❌ [DashboardLayout] No user found, redirecting to login')
        router.replace('/login?redirect_to=/dashboard')
      }
    }
  }, [user, isLoading, authReady, router])

  if (!authReady || isLoading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin mx-auto mb-4 text-teal-600" />
          <p className="text-gray-600">
            {!authReady ? 'Hitelesítés inicializálása...' : 
             isLoading ? 'Betöltés...' : 
             'Bejelentkezés szükséges...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <DashboardHeader />
      <div className="flex">
        <UnifiedSidebar userRole={user.role} />
        <main className="flex-1 px-6 py-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}