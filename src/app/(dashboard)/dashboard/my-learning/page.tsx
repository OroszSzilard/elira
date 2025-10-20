'use client'

import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { MyCoursesSection } from '@/components/dashboard/MyCoursesSection'
import { ContinueLearningSection } from '@/components/dashboard/ContinueLearningSection'
import { RecentActivitySection } from '@/components/dashboard/RecentActivitySection'
import { useUserProgress } from '@/hooks/useUserProgress'

/**
 * My Learning Dashboard - Primary Learning Hub
 * 
 * Comprehensive learning progress and course management interface
 * showing active courses, recent activity, and learning analytics
 */

export default function MyLearningPage() {
  const { data: userProgressData, isLoading, error } = useUserProgress()

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-lg font-semibold text-red-800 mb-2">
              Hiba történt az adatok betöltése során
            </h2>
            <p className="text-red-600">
              Kérjük, frissítse az oldalt vagy próbálja meg később.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Tanulási Folyamat</h1>
            <p className="text-gray-600 mt-1">
              Folytassa tanulását és kövesse nyomon előrehaladását
            </p>
          </div>
        </div>

        {/* Continue Learning Section */}
        <ContinueLearningSection 
          data={userProgressData} 
          isLoading={isLoading} 
        />

        {/* My Courses Section */}
        <MyCoursesSection 
          data={userProgressData} 
          isLoading={isLoading} 
        />

        {/* Recent Activity Section */}
        <RecentActivitySection 
          data={userProgressData} 
          isLoading={isLoading} 
        />
      </div>
    </div>
  )
}