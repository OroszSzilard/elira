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
 * Transformed dashboard that eliminates empty states and provides immediate value:
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

  // Don't render learning content for admin users
  if (user?.role === 'ADMIN') {
    return <DashboardLoadingSkeleton />
  }

  // Loading state
  if (isLoading) {
    return <DashboardLoadingSkeleton />
  }

  // Error state
  if (isError) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="text-red-500 font-medium">Hiba történt az adatok betöltésekor</div>
          <p className="text-gray-600 text-sm">{error?.message || 'Ismeretlen hiba'}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
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