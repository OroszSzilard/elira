'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { useUserProgress } from '@/hooks/useUserProgress'
import { WelcomeHero } from '@/components/dashboard/WelcomeHero'
import { EnhancedDashboardStats } from '@/components/dashboard/EnhancedDashboardStats'
import { TrendingCoursesSection } from '@/components/dashboard/TrendingCoursesSection'
import { ContinueLearningSection } from '@/components/dashboard/ContinueLearningSection'
import { MyCoursesSection } from '@/components/dashboard/MyCoursesSection'
import { RecentActivitySection } from '@/components/dashboard/RecentActivitySection'
import { DashboardLoadingSkeleton } from '@/components/dashboard/DashboardLoadingSkeleton'

/**
 * ELIRA Dashboard - Enhanced UX Experience
 *
 * Unified dashboard with role-based feature differentiation:
 * - ADMIN: Redirects to admin dashboard
 * - COMPANY_ADMIN: Company management features (employees, masterclasses, billing)
 * - COMPANY_EMPLOYEE: Employee learning progress and assigned masterclasses
 * - STUDENT/INSTRUCTOR: Standard learning dashboard
 *
 * Standard Learning Dashboard Features:
 * - Dynamic Welcome Hero with personalized content and course previews
 * - Enhanced stats that show platform insights even for new users
 * - Always-populated trending courses section
 * - Conditional progressive sections based on user progress
 * - Rich, engaging content that demonstrates platform value immediately
 */

export default function DashboardPage() {
  const { user } = useAuthStore()
  const router = useRouter()
  const { data, isLoading, isError, error } = useUserProgress()

  // Redirect admin users to admin dashboard
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      router.replace('/admin/dashboard')
    }
  }, [user, router])

  // Check if user has any learning activity
  const hasEnrolledCourses = data && data.totalCoursesEnrolled > 0
  const isNewUser = !hasEnrolledCourses && !data?.totalHoursLearned

  // Determine if this is a company user
  const isCompanyAdmin = user?.role === 'COMPANY_ADMIN'
  const isCompanyEmployee = user?.role === 'COMPANY_EMPLOYEE'
  const isCompanyUser = isCompanyAdmin || isCompanyEmployee

  // Don't render learning content for admin users
  if (user?.role === 'ADMIN') {
    return <DashboardLoadingSkeleton />
  }

  // Company dashboard UI (to be implemented with role-specific features)
  if (isCompanyUser) {
    return (
      <div className="h-full">
        <div className="space-y-8">
          <div className="text-center space-y-6 py-12">
            <h1 className="text-4xl lg:text-5xl font-semibold text-gray-900">
              {isCompanyAdmin ? 'Vállalati Admin Vezérlőpult' : 'Munkavállalói Vezérlőpult'}
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              {isCompanyAdmin
                ? 'Üdvözöljük a vállalati admin felületen! Itt kezelheti a munkavállalókat, mesterképzéseket és előfizetését.'
                : 'Üdvözöljük a munkavállalói felületen! Itt követheti a tanulási előrehaladását és hozzáférhet a hozzárendelt mesterképzésekhez.'
              }
            </p>
            <div className="bg-white border border-gray-200 rounded-2xl p-8 mt-8 shadow-sm max-w-3xl mx-auto">
              <p className="text-base text-gray-800 mb-6">
                🚀 A vállalati dashboard funkciók hamarosan érkeznek! A szerepkör-alapú funkciók fejlesztés alatt állnak.
              </p>
              {isCompanyAdmin && (
                <div className="text-sm text-gray-700">
                  <p className="font-semibold text-gray-900 mb-3">Hamarosan elérhető funkciók:</p>
                  <ul className="space-y-2 text-left max-w-md mx-auto">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>Munkavállaló kezelés és meghívások</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>Mesterképzés hozzárendelés</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>Tanulási előrehaladás jelentések</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>Előfizetés és számlázás kezelése</span>
                    </li>
                  </ul>
                </div>
              )}
              {isCompanyEmployee && (
                <div className="text-sm text-gray-700">
                  <p className="font-semibold text-gray-900 mb-3">Hamarosan elérhető funkciók:</p>
                  <ul className="space-y-2 text-left max-w-md mx-auto">
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>Hozzárendelt mesterképzések</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>Tanulási előrehaladás nyomon követése</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>Teljesítmény statisztikák</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>Tanúsítványok és eredmények</span>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return <DashboardLoadingSkeleton />
  }

  // Error state
  if (isError) {
    return (
      <div className="h-full flex items-center justify-center py-20">
        <div className="text-center space-y-6 max-w-md mx-auto">
          <div className="w-16 h-16 mx-auto bg-red-50 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Hiba történt az adatok betöltésekor</h3>
            <p className="text-gray-600 text-sm">{error?.message || 'Ismeretlen hiba'}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all font-medium shadow-sm"
          >
            Újrapróbálás
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full overflow-auto">
      {/* Main Dashboard Content */}
      <div className="space-y-8">
          
          {/* Dynamic Welcome Hero - Always Engaging */}
          <WelcomeHero 
            userName={user?.firstName}
            hasEnrolledCourses={hasEnrolledCourses}
            isNewUser={isNewUser}
          />

          {/* Enhanced Learning Stats - Never Empty */}
          <EnhancedDashboardStats data={data} isLoading={isLoading} />

          {/* Always-Populated Trending Courses */}
          <TrendingCoursesSection />

          {/* Progressive Enhancement - Show More Content for Active Users */}
          {hasEnrolledCourses && (
            <>
              {/* Continue Learning - Priority Section */}
              <ContinueLearningSection data={data} isLoading={isLoading} />

              {/* My Courses Overview */}
              <MyCoursesSection data={data} isLoading={isLoading} />

              {/* Recent Activity Timeline */}
              <RecentActivitySection data={data} />
            </>
          )}

      </div>
    </div>
  )
} 