'use client'

import { useState } from 'react'
import Link from 'next/link'
import { BookOpen, Award, Clock, Users, Filter, Search, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { UserProgressData, EnrolledCourse, CourseState, CourseFilter, CourseFilterOption } from '@/types'
import { CourseCard } from './CourseCard'

/**
 * My Courses Section
 * Filterable grid of all user's enrolled courses with adaptive cards
 */

interface MyCoursesProps {
  data: UserProgressData | null;
  isLoading?: boolean;
}

export function MyCoursesSection({ data, isLoading = false }: MyCoursesProps) {
  const [activeFilter, setActiveFilter] = useState<CourseFilter>('all')
  
  const enrolledCourses = data?.enrolledCourses || []
  
  // Course filtering logic
  const getFilteredCourses = (filter: CourseFilter): EnrolledCourse[] => {
    switch (filter) {
      case 'in_progress':
        return enrolledCourses.filter(course => 
          course.courseState === CourseState.ACTIVE_PROGRESS || 
          course.courseState === CourseState.STALE_PROGRESS
        )
      case 'completed':
        return enrolledCourses.filter(course => course.courseState === CourseState.COMPLETED)
      case 'not_started':
        return enrolledCourses.filter(course => course.courseState === CourseState.NOT_STARTED)
      default:
        return enrolledCourses
    }
  }

  // Course count calculations
  const inProgressCount = enrolledCourses.filter(course => 
    course.courseState === CourseState.ACTIVE_PROGRESS || 
    course.courseState === CourseState.STALE_PROGRESS
  ).length
  const completedCount = enrolledCourses.filter(course => course.courseState === CourseState.COMPLETED).length
  const notStartedCount = enrolledCourses.filter(course => course.courseState === CourseState.NOT_STARTED).length

  // Filter options with counts
  const filterOptions: CourseFilterOption[] = [
    { key: 'all', label: 'Összes kurzus', count: enrolledCourses.length },
    { key: 'in_progress', label: 'Folyamatban', count: inProgressCount },
    { key: 'completed', label: 'Befejezett', count: completedCount },
    { key: 'not_started', label: 'Elkezdés előtt', count: notStartedCount },
  ]

  const filteredCourses = getFilteredCourses(activeFilter)

  // Course action handlers
  const handleStartCourse = (courseId: string) => {
    // Find the course to get the slug
    const course = enrolledCourses.find(c => c.courseId === courseId)
    const identifier = course?.slug || courseId
    // Navigate to the first lesson directly
    // Assuming lessons start with lesson-1 or similar pattern
    window.location.href = `/courses/${identifier}/lessons/lesson-1`
  }

  const handleContinueCourse = (courseId: string) => {
    // Find the course to get the slug and last accessed lesson
    const course = enrolledCourses.find(c => c.courseId === courseId)
    const identifier = course?.slug || courseId
    // If there's a last accessed lesson, go there, otherwise go to first lesson
    const lastLessonId = course?.lastAccessedLessonId || 'lesson-1'
    window.location.href = `/courses/${identifier}/lessons/${lastLessonId}`
  }

  const handleViewCertificate = (certificateUrl: string) => {
    window.open(certificateUrl, '_blank')
  }

  const handleRateCourse = (courseId: string) => {
    // TODO: Implement rating modal or redirect to rating page
    console.log('Rate course:', courseId)
  }

  // Loading skeleton
  if (isLoading) {
    return <MyCoursesLoadingSkeleton />
  }

  // Empty state - no courses enrolled
  if (enrolledCourses.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Kurzusaim</h2>
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg border border-teal-200 p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Még nem kezdtél el egyetlen kurzust sem
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Fedezd fel kurzusainkat és kezdd el a tanulást még ma! Válogass a szakmai fejlődést segítő képzéseink közül.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/courses">
              <Button size="lg" className="flex items-center">
                <Search className="w-5 h-5 mr-2" />
                Kurzusok böngészése
              </Button>
            </Link>
            <Link href="/trending">
              <Button size="lg" variant="outline" className="flex items-center">
                <TrendingUp className="w-5 h-5 mr-2" />
                Népszerű kurzusok
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Kurzusaim</h2>
        <Link href="/dashboard/my-learning">
          <Button variant="outline">
            <BookOpen className="w-4 h-4 mr-2" />
            Részletes áttekintés
          </Button>
        </Link>
      </div>

      {/* Filter Controls */}
      <div className="flex flex-wrap gap-2">
        {filterOptions.map((option) => (
          <Button
            key={option.key}
            variant={activeFilter === option.key ? "default" : "secondary"}
            size="sm"
            onClick={() => setActiveFilter(option.key)}
            className={`flex items-center space-x-2 ${
              activeFilter === option.key 
                ? 'bg-teal-600 text-white hover:bg-teal-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            <span>{option.label}</span>
            <Badge 
              variant="secondary" 
              className={`ml-1 ${
                activeFilter === option.key 
                  ? 'bg-teal-500 text-white' 
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {option.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <EmptyFilterState activeFilter={activeFilter} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard 
              key={course.courseId} 
              course={course}
              onStart={handleStartCourse}
              onContinue={handleContinueCourse}
              onViewCertificate={handleViewCertificate}
              onRate={handleRateCourse}
            />
          ))}
        </div>
      )}
    </div>
  )
}

// Loading skeleton component
function MyCoursesLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-40 animate-pulse"></div>
      </div>
      
      {/* Filter skeleton */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-8 bg-gray-200 rounded w-32 animate-pulse"></div>
        ))}
      </div>
      
      {/* Course cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-6 space-y-4">
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Empty state for filtered results
function EmptyFilterState({ activeFilter }: { activeFilter: CourseFilter }) {
  const getEmptyStateContent = () => {
    switch (activeFilter) {
      case 'in_progress':
        return {
          icon: Clock,
          title: 'Nincsenek folyamatban lévő kurzusai',
          description: 'Kezdjen el egy kurzust, vagy folytassa egy korábbi tanulását.',
          action: { label: 'Kurzusok böngészése', href: '/courses' }
        }
      case 'completed':
        return {
          icon: Award,
          title: 'Még nem fejezett be kurzust',
          description: 'Folytassa tanulását és szerezze meg első tanúsítványát.',
          action: { label: 'Tanulás folytatása', href: '/dashboard' }
        }
      case 'not_started':
        return {
          icon: BookOpen,
          title: 'Minden kurzusát elkezdte',
          description: 'Nagyszerű! Nincs várakozó kurzusa. Fedezzen fel újakat.',
          action: { label: 'Új kurzusok keresése', href: '/courses' }
        }
      default:
        return {
          icon: Search,
          title: 'Nincsenek kurzusai',
          description: 'Kezdje meg tanulási útját új kurzusok felfedezésével.',
          action: { label: 'Kurzusok böngészése', href: '/courses' }
        }
    }
  }

  const { icon: Icon, title, description, action } = getEmptyStateContent()

  return (
    <div className="bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 p-12 text-center">
      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-sm mx-auto">{description}</p>
      <Link href={action.href}>
        <Button>{action.label}</Button>
      </Link>
    </div>
  )
}

