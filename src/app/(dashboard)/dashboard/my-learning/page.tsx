'use client'

import { motion } from 'motion/react'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { MyCoursesSection } from '@/components/dashboard/MyCoursesSection'
import { ContinueLearningSection } from '@/components/dashboard/ContinueLearningSection'
import { RecentActivitySection } from '@/components/dashboard/RecentActivitySection'
import { useUserProgress } from '@/hooks/useUserProgress'
import { brandGradient, glassMorphism } from '@/lib/design-tokens'
import { BookOpen, Target, TrendingUp } from 'lucide-react'

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
      <div className="px-6 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="bg-gray-50 border border-gray-300 rounded-2xl p-6 text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Hiba történt az adatok betöltése során
            </h2>
            <p className="text-gray-600">
              Kérjük, frissítse az oldalt vagy próbálja meg később.
            </p>
          </div>
        </div>
      </div>
    )
  }

  const totalCourses = userProgressData?.enrolledCourses?.length || 0
  const inProgressCourses = userProgressData?.enrolledCourses?.filter(c => c.completionPercentage > 0 && c.completionPercentage < 100).length || 0
  const completedCourses = userProgressData?.completedCourses || 0

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mini Hero Section with Gradient */}
      <section
        className="relative -mt-20 pt-20 pb-12"
        style={{ background: brandGradient }}
      >
        <div className="container mx-auto px-6 lg:px-12 py-12 relative z-10">
          <motion.div
            className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Left: Title and Description */}
            <div className="flex-1">
              <motion.div
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm mb-4"
                style={{
                  ...glassMorphism.badge,
                  border: '1px solid rgba(255, 255, 255, 0.25)'
                }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <BookOpen className="w-4 h-4 text-white" />
                <span className="font-semibold text-white">{totalCourses} Aktív Kurzus</span>
              </motion.div>

              <h1 className="text-4xl lg:text-5xl font-semibold text-white mb-3">
                Tanulási Folyamat
              </h1>
              <p className="text-white/80 text-lg max-w-2xl">
                Folytassa tanulását és kövesse nyomon előrehaladását
              </p>
            </div>

            {/* Right: Stats in glassmorphic cards */}
            <div className="flex gap-4">
              <motion.div
                className="px-6 py-4 rounded-2xl text-center min-w-[120px]"
                style={{
                  ...glassMorphism.badge,
                  border: '1px solid rgba(255, 255, 255, 0.25)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -4 }}
              >
                <div className="text-3xl font-bold text-white mb-1">{inProgressCourses}</div>
                <div className="text-white/80 text-sm">Folyamatban</div>
              </motion.div>

              <motion.div
                className="px-6 py-4 rounded-2xl text-center min-w-[120px]"
                style={{
                  ...glassMorphism.badge,
                  border: '1px solid rgba(255, 255, 255, 0.25)'
                }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -4 }}
              >
                <div className="text-3xl font-bold text-white mb-1">{completedCourses}</div>
                <div className="text-white/80 text-sm">Befejezett</div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Ambient glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 30%, rgba(139, 92, 246, 0.08), transparent 70%)'
          }}
        />
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 lg:px-12 py-12">
        <div className="max-w-7xl mx-auto space-y-12">
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
    </div>
  )
}