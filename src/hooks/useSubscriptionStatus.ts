import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { httpsCallable } from 'firebase/functions'
import { functions } from '@/lib/firebase'
import { useAuthStore } from '@/stores/authStore'

interface SubscriptionStatusResponse {
  success: boolean
  hasSubscription: boolean
  isActive: boolean
  subscription?: {
    id: string
    subscriptionId: string
    status: string
    planName: string
    currentPeriodStart: string
    currentPeriodEnd: string
    cancelAtPeriodEnd: boolean
    createdAt: string
  }
  error?: string
  // Legacy compatibility
  hasActiveSubscription?: boolean
  user?: {
    id: string
    email: string
    firstName: string
    lastName: string
    role: string
    profilePictureUrl?: string
    subscriptionActive: boolean
  }
}

export const useSubscriptionStatus = () => {
  const { isAuthenticated, updateSubscriptionStatus } = useAuthStore()

  const query = useQuery<SubscriptionStatusResponse, Error>({
    queryKey: ['subscription-status'],
    queryFn: async () => {
      // For now, return mock subscription data
      // In production, this would fetch from Firestore
      console.log('🔍 Checking subscription status...')
      
      // Return active subscription for testing
      return {
        success: true,
        hasSubscription: true,
        isActive: true,
        hasActiveSubscription: true,
        subscription: {
          id: 'sub_test',
          subscriptionId: 'sub_test_123',
          status: 'active',
          planName: 'Premium',
          currentPeriodStart: new Date().toISOString(),
          currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
          cancelAtPeriodEnd: false,
          createdAt: new Date().toISOString()
        }
      } as SubscriptionStatusResponse
    },
    enabled: isAuthenticated, // Only fetch if logged in
    staleTime: 2 * 60 * 1000, // 2 minutes
  })

  // Update auth store when data changes
  React.useEffect(() => {
    if (query.data) {
      // Use new isActive field or fallback to legacy hasActiveSubscription
      const isActive = query.data.isActive ?? query.data.hasActiveSubscription ?? false
      updateSubscriptionStatus(isActive)
    }
  }, [query.data, updateSubscriptionStatus])

  return query
} 