'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTrendingCourses } from '@/hooks/useCoursesCatalog'
import { usePlatformAnalytics } from '@/hooks/usePlatformAnalytics'
import { 
  BookOpen, 
  TrendingUp, 
  Target, 
  Clock,
  Users,
  Star,
  Play,
  ArrowRight,
  Sparkles,
  Trophy,
  Zap
} from 'lucide-react'

/**
 * Welcome Hero Section - Dynamic First Experience
 * 
 * Eliminates empty state problem by providing rich, actionable content
 * for both new and returning users with engaging course discovery
 */

interface WelcomeHeroProps {
  userName?: string
  hasEnrolledCourses?: boolean
  isNewUser?: boolean
}

export function WelcomeHero({ userName, hasEnrolledCourses = false, isNewUser = true }: WelcomeHeroProps) {
  const [currentTip, setCurrentTip] = useState(0)

  // Real trending courses data
  const { data: trendingData, isLoading: trendingLoading } = useTrendingCourses(3)
  
  // Real platform analytics for hero stats
  const { data: platformData } = usePlatformAnalytics()

  // Fallback courses data (for loading/error states)
  const fallbackCourses = [
    {
      id: '1',
      title: 'Modern React Fejlesztés',
      instructor: { firstName: 'Dr. Kovács', lastName: 'János' },
      difficulty: 'INTERMEDIATE' as const,
      rating: 4.8,
      enrollmentCount: 2847,
      thumbnailUrl: '/images/course-react.jpg',
      category: { name: 'Webfejlesztés' },
      isPlus: false,
      highlights: ['Hooks & Context', 'TypeScript', 'Testing']
    },
    {
      id: '2',
      title: 'Digital Marketing Stratégia',
      instructor: { firstName: 'Nagy', lastName: 'Éva' },
      difficulty: 'BEGINNER' as const,
      rating: 4.9,
      enrollmentCount: 1923,
      thumbnailUrl: '/images/course-marketing.jpg',
      category: { name: 'Marketing' },
      isPlus: true,
      highlights: ['SEO alapok', 'Social Media', 'Analytics']
    },
    {
      id: '3',
      title: 'Python Adattudomány',
      instructor: { firstName: 'Szabó', lastName: 'Péter' },
      difficulty: 'ADVANCED' as const,
      rating: 4.7,
      enrollmentCount: 1456,
      thumbnailUrl: '/images/course-python.jpg',
      category: { name: 'Data Science' },
      isPlus: false,
      highlights: ['Pandas', 'Machine Learning', 'Visualization']
    }
  ]

  // Use real data when available, fallback otherwise
  const featuredCourses = trendingData?.courses?.slice(0, 3) || fallbackCourses

  const learningTips = [
    "💡 Tipp: Kezdje 15-20 perces leckékkel a hatékony tanuláshoz",
    "🎯 Tipp: Állítson be napi tanulási célokat a folyamatos fejlődéshez",
    "🏆 Tipp: Vegyen részt kvízekben a tudás elmélyítéséhez",
    "⚡ Tipp: Használja a jegyzetelési funkciót fontos részek kiemelésére"
  ]

  // Rotate learning tips every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % learningTips.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [learningTips.length])

  const quickActions = [
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: 'Kurzusok böngészése',
      description: 'Fedezze fel 100+ szakmai kurzust',
      href: '/dashboard/browse',
      color: 'bg-blue-500 hover:bg-blue-600',
      badge: 'Népszerű'
    },
    {
      icon: <Target className="w-5 h-5" />,
      title: 'Személyre szabott javaslatok',
      description: 'AI-alapú kurzusajánlatok',
      href: '/dashboard/browse?tab=recommended',
      color: 'bg-teal-500 hover:bg-teal-600',
      badge: 'Új'
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      title: 'Tanulási útvonalak',
      description: 'Strukturált fejlődési tervek',
      href: '/dashboard/career',
      color: 'bg-purple-500 hover:bg-purple-600',
      badge: 'Trending'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Dynamic Welcome Header */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
        
        <div className="relative z-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                <Sparkles className="w-6 h-6 text-yellow-300" />
                <Badge className="bg-white/20 text-white border-white/30">
                  {isNewUser ? 'Üdvözöljük!' : 'Jó látni újra!'}
                </Badge>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                {hasEnrolledCourses 
                  ? `Folytassa tanulását, ${userName}!`
                  : `Kezdje meg tanulási útját, ${userName}!`
                }
              </h1>
              
              <p className="text-teal-100 text-lg mb-6 max-w-2xl">
                {hasEnrolledCourses
                  ? 'Térjen vissza aktív kurzusaihoz, vagy fedezzen fel új területeket.'
                  : 'Több mint 100 szakmai kurzus vár Önre. Válassza ki a megfelelő tanulási utat és kezdje meg fejlődését még ma.'
                }
              </p>

              {/* Dynamic Learning Tip */}
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-6 border border-white/20">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-yellow-300" />
                  <span className="text-sm font-medium transition-all duration-500">
                    {learningTips[currentTip]}
                  </span>
                </div>
              </div>

              {/* Primary CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                {hasEnrolledCourses ? (
                  <>
                    <Link href="/dashboard/my-learning">
                      <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 font-semibold">
                        <Play className="w-5 h-5 mr-2" />
                        Tanulás folytatása
                      </Button>
                    </Link>
                    <Link href="/dashboard/browse">
                      <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                        <BookOpen className="w-5 h-5 mr-2" />
                        Új kurzusok felfedezése
                      </Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link href="/dashboard/browse">
                      <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100 font-semibold">
                        <BookOpen className="w-5 h-5 mr-2" />
                        Kurzusok böngészése
                      </Button>
                    </Link>
                    <Link href="/dashboard/career">
                      <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                        <Target className="w-5 h-5 mr-2" />
                        Karrierterv készítése
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>

            {/* Statistics */}
            <div className="hidden lg:block text-right">
              <div className="space-y-4">
                <div>
                  <div className="text-2xl font-bold">
                    {platformData?.data?.totalCourses ? `${platformData.data.totalCourses}+` : '100+'}
                  </div>
                  <div className="text-teal-200 text-sm">Szakmai kurzus</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {platformData?.data?.totalUsers ? 
                      `${Math.floor(platformData.data.totalUsers / 1000)}K+` : 
                      '25K+'
                    }
                  </div>
                  <div className="text-teal-200 text-sm">Aktív tanuló</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">
                    {platformData?.data?.averageRating ? 
                      `${platformData.data.averageRating}★` : 
                      '4.8★'
                    }
                  </div>
                  <div className="text-teal-200 text-sm">Átlag értékelés</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {quickActions.map((action, index) => (
          <Link key={index} href={action.href}>
            <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group border-0 bg-gradient-to-br from-gray-50 to-white">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center text-white group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {action.badge}
                  </Badge>
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-teal-600 transition-colors">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {action.description}
                </p>
                <div className="flex items-center text-teal-600 text-sm font-medium">
                  Kezdés
                  <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Featured Courses Preview */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Kiemelt Kurzusok</h2>
            <p className="text-gray-600 mt-1">A legkeresettebb tanulási lehetőségek</p>
          </div>
          <Link href="/dashboard/browse" className="text-teal-600 hover:text-teal-700 font-medium flex items-center">
            Összes megtekintése
            <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        {trendingLoading ? (
          // Loading skeleton for trending courses
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <CardContent className="p-6 space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4" />
                  <div className="h-6 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                  <div className="h-10 bg-gray-200 rounded" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredCourses.map((course) => {
              // Handle both API data structure and fallback data structure
              const courseData = {
                id: course.id,
                title: course.title,
                category: course.category?.name || course.category || 'Általános',
                rating: course.averageRating || course.rating || 4.8,
                students: course.enrollmentCount || course.students || 0,
                instructor: course.instructor ? 
                  `${course.instructor.firstName} ${course.instructor.lastName}` : 
                  course.instructor || 'Oktató',
                level: course.difficulty || course.level || 'Kezdő',
                isPlus: course.isPlus || false,
                highlights: course.highlights || ['Gyakorlati', 'Interaktív', 'Tanúsítvány']
              }

              return (
                <Card key={courseData.id} className="hover:shadow-lg transition-all duration-200 cursor-pointer group overflow-hidden">
                  <div className="h-48 bg-gradient-to-br from-teal-500 to-cyan-600 relative">
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-white/20 text-white border-white/30">
                        {courseData.category}
                      </Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge className="bg-yellow-500 text-yellow-900">
                        {courseData.isPlus ? 'ELIRA Plus' : 'Ingyenes próba'}
                      </Badge>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="text-white">
                        <div className="flex items-center space-x-2 mb-2">
                          <Star className="w-4 h-4 text-yellow-300" />
                          <span className="text-sm font-medium">{courseData.rating.toFixed(1)}</span>
                          <span className="text-sm text-white/80">({courseData.students} tanuló)</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div>
                        <Badge variant="outline" className="text-xs mb-2">
                          {courseData.level === 'BEGINNER' ? 'Kezdő' :
                           courseData.level === 'INTERMEDIATE' ? 'Középhaladó' :
                           courseData.level === 'ADVANCED' ? 'Haladó' :
                           courseData.level === 'EXPERT' ? 'Szakértő' : courseData.level}
                        </Badge>
                        <h3 className="font-semibold text-gray-900 group-hover:text-teal-600 transition-colors">
                          {courseData.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {courseData.instructor}
                        </p>
                      </div>

                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Users className="w-4 h-4 mr-1" />
                          {courseData.students}
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1" />
                          {courseData.rating.toFixed(1)}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {courseData.highlights.map((highlight, idx) => (
                          <Badge key={idx} variant="secondary" className="text-xs">
                            {highlight}
                          </Badge>
                        ))}
                      </div>

                      <Link href={`/courses/${courseData.slug || courseData.id}`}>
                        <Button className="w-full bg-teal-600 hover:bg-teal-700">
                          <Play className="w-4 h-4 mr-2" />
                          Kurzus megtekintése
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}