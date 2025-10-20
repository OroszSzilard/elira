'use client'

import Link from 'next/link'
import { Play, Clock, CheckCircle, BookOpen, Search, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { UserProgressData, EnrolledCourse } from '@/types'

/**
 * Continue Learning Section
 * Priority section showing in-progress courses sorted by engagement score
 */

interface ContinueLearningProps {
  data: UserProgressData | null;
  isLoading?: boolean;
}

function ContinueLearningLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
        <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="h-48 bg-gray-200 animate-pulse"></div>
            <div className="p-5 space-y-4">
              <div className="space-y-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-1/2 animate-pulse"></div>
              <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function ContinueLearningSection({ data, isLoading = false }: ContinueLearningProps) {
  // Show loading skeleton
  if (isLoading) {
    return <ContinueLearningLoadingSkeleton />;
  }

  // Filter and get top 3 in-progress courses (already sorted by priority score)
  const inProgressCourses = data?.enrolledCourses?.filter((course: EnrolledCourse) => 
    course.completionPercentage > 0 && course.completionPercentage < 100
  ).slice(0, 3) || []

  // Check if user has any enrolled courses at all
  const hasEnrolledCourses = (data?.enrolledCourses?.length || 0) > 0;
  const completedCourses = data?.enrolledCourses?.filter((course: EnrolledCourse) => 
    course.completionPercentage === 100
  ) || []

  // If no enrolled courses at all, don't show this section
  if (!hasEnrolledCourses) {
    return null;
  }

  if (inProgressCourses.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-900">Tanulás folytatása</h2>
        <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg border border-teal-200 p-8 text-center">
            <>
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Szuper! Minden kurzust teljesített!
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Gratulálunk! {completedCourses.length} kurzust sikeresen befejezett. 
                Fedezzen fel új területeket és fejlessze tovább tudását.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/courses">
                  <Button size="lg" className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2" />
                    Új kurzusok keresése
                  </Button>
                </Link>
                <Link href="/dashboard/certificates">
                  <Button size="lg" variant="outline" className="flex items-center">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Tanúsítványok megtekintése
                  </Button>
                </Link>
              </div>
            </>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Tanulás folytatása</h2>
        <Link href="/dashboard/my-learning">
          <Button variant="outline">Összes megtekintése</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inProgressCourses.map((course: EnrolledCourse) => (
          <div key={course.courseId} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 group">
            
            {/* Course Thumbnail */}
            <div className="h-48 bg-gradient-to-br from-teal-500 to-cyan-600 relative overflow-hidden">
              {course.thumbnailUrl ? (
                <img 
                  src={course.thumbnailUrl} 
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
                      <BookOpen className="w-8 h-8" />
                    </div>
                    <p className="font-medium">Kurzus</p>
                  </div>
                </div>
              )}
              
              {/* Difficulty Badge */}
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 bg-black/60 text-white text-xs rounded-full">
                  {course.difficulty === 'BEGINNER' ? 'Kezdő' : 
                   course.difficulty === 'INTERMEDIATE' ? 'Középhaladó' :
                   course.difficulty === 'ADVANCED' ? 'Haladó' : 'Szakértő'}
                </span>
              </div>
              
              {/* Progress Overlay */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent text-white p-4">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium">{Math.round(course.completionPercentage)}% teljesítve</span>
                  <span className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {course.estimatedTimeRemaining} hátra
                  </span>
                </div>
                <Progress 
                  value={course.completionPercentage} 
                  className="h-2 bg-white/20"
                />
              </div>
            </div>

            {/* Course Info */}
            <div className="p-5 space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2 group-hover:text-teal-600 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-gray-600">
                  {course.instructorName}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {course.category}
                </p>
              </div>

              {/* Course Progress Stats */}
              <div className="flex items-center justify-between text-sm text-gray-600">
                <span>{course.completedLessons}/{course.totalLessons} lecke</span>
                <span>{course.estimatedHours} óra tanulás</span>
              </div>

              {/* Next Lesson */}
              {course.nextLesson && (
                <div className="flex items-center text-sm text-teal-600 bg-teal-50 px-3 py-2 rounded-lg">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Következő: {course.nextLesson.title}
                </div>
              )}

              {/* Continue Button */}
              <Link href={`/courses/${course.slug || course.courseId}/player`} className="block">
                <Button className="w-full group-hover:bg-teal-700 transition-colors">
                  <Play className="w-4 h-4 mr-2" />
                  Tanulás folytatása
                </Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}