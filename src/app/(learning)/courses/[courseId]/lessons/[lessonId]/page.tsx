"use client"

import { useRouter } from 'next/navigation'
import { useCourse } from '@/hooks/useCourseQueries'
import { useLesson } from '@/hooks/useLessonQueries'
import { LessonContentRenderer } from '@/components/lesson/LessonContentRenderer'
import { LessonResourcesList } from '@/components/lesson/LessonResourcesList'
import { DeviceSyncNotification } from '@/components/lesson/DeviceSyncNotification'
import { usePlayerData } from '@/hooks/usePlayerData'
import { LessonSidebar } from '@/components/lesson/LessonSidebar'
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus'
import { useLessonProgress } from '@/hooks/useLessonProgress'
import { useParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { useDemoLearningStats, useDemoAchievements } from '@/lib/demoDataManager'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Monitor, Maximize, ChevronLeft, ChevronRight, Play, RotateCcw, Trophy, Flame, Target, CheckCircle, ChevronDown, ChevronUp, BookOpen, List, User } from 'lucide-react'

export default function LessonPage() {
  const { courseId, lessonId } = useParams() as { courseId: string; lessonId: string }
  const router = useRouter()
  // Auth state will be retrieved with other properties below

  const { data: playerData, isLoading: pload } = usePlayerData(courseId, lessonId)
  const course = playerData?.course
  const cload = pload
  const { data: lesson, isLoading: lload, error: lessonError } = useLesson(lessonId, courseId)
  const { data: subStatus } = useSubscriptionStatus()
  const progressMutation = useLessonProgress()
  const { authReady, isAuthenticated, user } = useAuthStore()
  const { stats, simulateCompletion } = useDemoLearningStats()
  const { achievements, earnAchievement } = useDemoAchievements()
  
  // Layout state management
  const [sidebarState, setSidebarState] = useState<'expanded' | 'collapsed' | 'hidden'>('expanded')
  const [isVideoFocused, setIsVideoFocused] = useState(false)
  const [showProgress, setShowProgress] = useState(false)
  const [showNavigation, setShowNavigation] = useState(true)
  
  // Layout control functions
  const getSidebarWidth = () => {
    switch (sidebarState) {
      case 'expanded': return 'w-96'
      case 'collapsed': return 'w-16'
      case 'hidden': return 'w-0'
    }
  }

  const toggleSidebar = () => {
    setSidebarState(prev => {
      switch (prev) {
        case 'expanded': return 'collapsed'
        case 'collapsed': return 'expanded'
        case 'hidden': return 'expanded'
        default: return 'expanded'
      }
    })
  }

  const enterCinemaMode = () => {
    setSidebarState('hidden')
    setIsVideoFocused(true)
  }

  const exitCinemaMode = () => {
    setSidebarState('expanded')
    setIsVideoFocused(false)
  }

  // Keyboard shortcuts - MUST be called before any early returns
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only handle shortcuts when not in input fields
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.key) {
        case 'c':
          if (sidebarState === 'hidden') {
            exitCinemaMode()
          } else {
            enterCinemaMode()
          }
          break
        case 's':
          e.preventDefault()
          toggleSidebar()
          break
        case 'Escape':
          if (sidebarState === 'hidden') {
            exitCinemaMode()
          }
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [sidebarState])
  
  // DEBUGGING: Log lesson data received
  console.log('🔍 [LessonPage] Lesson data from useLesson:', {
    hasLesson: !!lesson,
    isLoading: lload,
    hasError: !!lessonError,
    errorMessage: lessonError?.message,
    authReady,
    isAuthenticated,
    lessonId: lesson?.id,
    lessonTitle: lesson?.title,
    lessonType: lesson?.type,
    lessonKeys: Object.keys(lesson || {})
  });

  const hasSub = subStatus?.hasActiveSubscription ?? false

  // Auth check - enhanced with better loading states
  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Autentikáció inicializálása...</p>
        </div>
      </div>
    )
  }
  
  if (!isAuthenticated || !user) {
    router.push('/login')
    return null
  }

  // Enhanced loading states
  if (cload || lload) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">
            {cload && 'Kurzus betöltése...'}
            {lload && 'Lecke betöltése...'}
          </p>
        </div>
      </div>
    )
  }
  
  // Enhanced error handling
  if (lessonError) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Hiba a lecke betöltésekor</h2>
          <p className="text-gray-600 mb-4">{lessonError.message}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            Újrapróbálás
          </button>
        </div>
      </div>
    )
  }

  // If course or lesson not found
  if (!course) {
    return <div className="p-8 text-center text-red-600">Kurzus nem található.</div>
  }
  if (!lesson) {
    return <div className="p-8 text-center text-red-600">Lecke nem található.</div>
  }

  const modules = course?.modules || []

  // Find current lesson's module to compute navigation
  const flatLessons = modules.flatMap((m: any) =>
    (m.lessons as any[]).sort((a: any, b: any) => a.order - b.order).map((l: any) => ({ ...l, moduleId: m.id, moduleOrder: m.order }))
  )
  const currentIndex = flatLessons.findIndex((l: any) => l.id === lessonId)
  const prevLesson = currentIndex > 0 ? flatLessons[currentIndex-1] : null
  const nextLesson = currentIndex < flatLessons.length-1 ? flatLessons[currentIndex+1] : null

  // Calculate REAL progress data from actual course data
  const completedLessons = flatLessons.filter((l: any) => l.progress?.completed || l.progress?.watchPercentage >= 90).length
  const totalLessons = flatLessons.length
  const realProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0
  
  // Find current module and lesson position
  const currentModule = modules.find((m: any) => 
    m.lessons.some((l: any) => l.id === lessonId)
  )
  const currentModuleIndex = modules.findIndex((m: any) => m.id === currentModule?.id)
  const currentLessonInModule = currentModule?.lessons.findIndex((l: any) => l.id === lessonId) + 1 || 0
  const totalLessonsInModule = currentModule?.lessons.length || 0

  const handleProgress = (percentage: number, time: number, analytics?: any) => {
    if (percentage < 5) return
    
    // Send progress to backend
    progressMutation.mutate({ lessonId, watchPercentage: percentage, timeSpent: time })
    
    // Log analytics data for future use (with safe checks)
    if (analytics && analytics.engagementEvents && analytics.engagementEvents.length > 0) {
      console.log('📊 Video Analytics:', {
        sessionId: analytics.sessionId,
        totalEvents: analytics.engagementEvents.length,
        progressMarkers: analytics.progressMarkers?.length || 0,
        watchTime: time
      })
    }
  }

  const handleCompleted = () => {
    // Update lesson progress
    progressMutation.mutate({ lessonId, watchPercentage: 100 })
    
    // Simulate gamification updates
    simulateCompletion()
    
    // Check for achievements and show notifications
    setTimeout(() => {
      // First lesson achievement
      if (stats.totalLessonsCompleted === 0) {
        earnAchievement('first_lesson')
        toast.success('🎉 Első lecke kitüntetés!', {
          description: 'Kitűnő munka! Megszerezted az első leckét.',
          duration: 4000,
        })
      }
      
      // Streak achievements
      if (stats.currentStreak >= 6) {
        earnAchievement('week_streak')
        toast.success('🔥 Hetes sorozat!', {
          description: '7 nap egymás után tanultál. Fantasztikus!',
          duration: 4000,
        })
      }
      
      // Progress milestones
      const newProgress = Math.round(((stats.totalLessonsCompleted + 1) / 12) * 100)
      if (newProgress >= 25 && stats.totalLessonsCompleted < 3) {
        toast.success('🏆 Első negyedrész kész!', {
          description: '25% teljesítve. Jó úton haladsz!',
          duration: 4000,
        })
      }
      
      if (newProgress >= 50 && stats.totalLessonsCompleted < 6) {
        toast.success('🎯 Félúton vagy!', {
          description: '50% teljesítve. Folytatd így!',
          duration: 4000,
        })
      }
    }, 1000)
    
    // Auto-advance to next lesson
    if (course?.autoplayNext && nextLesson) {
      setTimeout(() => {
        router.push(`/courses/${courseId}/lessons/${nextLesson.id}`)
      }, 2000) // Delay to show achievement notifications
    }
  }

  const locked = !hasSub && ((lesson as any)?.subscriptionTier === 'PREMIUM')

  return (
    <div className="w-full h-screen bg-gray-100 flex overflow-hidden relative">
      {/* Dynamic Sidebar */}
      <div 
        className={`${getSidebarWidth()} text-white shadow-xl transition-all duration-300 ease-in-out overflow-hidden relative z-10`}
        style={{ background: 'linear-gradient(to bottom, #0F766E, #0d665a)' }}
      >d
        {/* Sidebar Toggle Button */}
        {sidebarState !== 'hidden' && (
          <button
            onClick={toggleSidebar}
            className="absolute top-4 -right-3 w-6 h-8 bg-white rounded-r-md shadow-lg flex items-center justify-center hover:bg-gray-50 transition-colors z-20"
            style={{ color: '#0F766E' }}
          >
            {sidebarState === 'expanded' ? (
              <ChevronLeft className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}

        {/* Sidebar Content - Only show when not collapsed */}
        {sidebarState === 'expanded' && (
        <div className="flex flex-col h-full overflow-y-auto">
          {/* Course Header Section */}
          <div className="p-6">
            {/* University info - only if exists */}
            {(course.universityName || course.universityDepartment) && (
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                  <Monitor className="w-6 h-6" style={{ color: '#0F766E' }} />
                </div>
                <div>
                  {course.universityName && (
                    <div className="text-xs text-teal-100 mb-1">{course.universityName}</div>
                  )}
                  {course.universityDepartment && (
                    <div className="text-xs text-teal-200 font-medium">{course.universityDepartment}</div>
                  )}
                </div>
              </div>
            )}

            <h1 className="text-xl font-bold text-white mb-2 leading-tight">
              {course.title || 'Kurzus címe'}
            </h1>
            {course.description && (
              <p className="text-sm text-teal-100 mb-6">
                {course.description}
              </p>
            )}

            {/* Instructor Info - use real data */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div>
                <div className="text-sm font-medium text-white">
                  {course.instructorName || course.instructor?.name || 'Oktató'}
                </div>
                {course.instructorTitle && (
                  <div className="text-xs text-teal-200">{course.instructorTitle}</div>
                )}
              </div>
            </div>

            {/* Compact Progress Bar (Always Visible) */}
            <div className="bg-white/10 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-white">Kurzus haladás</span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{completedLessons}/{totalLessons}</span>
                  <button
                    onClick={() => setShowProgress(!showProgress)}
                    className="p-1 hover:bg-white/10 rounded transition-colors"
                  >
                    {showProgress ? <ChevronUp className="w-4 h-4 text-white" /> : <ChevronDown className="w-4 h-4 text-white" />}
                  </button>
                </div>
              </div>
              <div className="w-full bg-white/20 rounded-full h-2 mb-1">
                <div 
                  className="bg-white rounded-full h-2 transition-all duration-500" 
                  style={{ width: `${realProgress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-xs text-teal-100">
                <span>{realProgress}% kész</span>
                <span>Modul {currentModuleIndex + 1}/3</span>
              </div>
              
              {/* Expandable Progress Details */}
              {showProgress && (
                <div className="mt-3 pt-3 border-t border-white/20 space-y-2">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{stats.currentStreak || 5}</div>
                      <div className="text-xs text-teal-200 flex items-center justify-center gap-1">
                        <Flame className="w-3 h-3" />
                        nap sorozat
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">{stats.weeklyProgress || 3}/{stats.weeklyGoal || 5}</div>
                      <div className="text-xs text-teal-200 flex items-center justify-center gap-1">
                        <Target className="w-3 h-3" />
                        heti cél
                      </div>
                    </div>
                  </div>
                  <div className="text-center pt-2">
                    <Badge className="bg-white/20 text-white border-white/30 text-xs">
                      <Trophy className="w-3 h-3 mr-1" />
                      {stats.totalPoints || 450} pont • B+ jegy
                    </Badge>
                  </div>
                </div>
              )}
            </div>

          </div>

          {/* Course Navigation Section */}
          <div className="px-6 pb-6">
            {/* Navigation Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <List className="w-4 h-4 text-teal-200" />
                <span className="text-sm font-semibold text-white">Tanmenet</span>
              </div>
              <button
                onClick={() => setShowNavigation(!showNavigation)}
                className="p-1 hover:bg-white/10 rounded transition-colors"
              >
                {showNavigation ? <ChevronUp className="w-4 h-4 text-teal-200" /> : <ChevronDown className="w-4 h-4 text-teal-200" />}
              </button>
            </div>

            {/* Quick Navigation (Always Visible) */}
            <div className="bg-white/10 rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between text-sm text-white mb-2">
                <span>Jelenlegi pozíció:</span>
                <span className="font-medium">{currentLessonInModule}/{totalLessonsInModule}</span>
              </div>
              <div className="text-xs text-teal-100 mb-3">
                {currentModule?.title || 'Ismeretlen modul'} • {lesson?.title}
              </div>
              
              {/* Quick Navigation Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => prevLesson && router.push(`/courses/${courseId}/lessons/${prevLesson.id}`)}
                  disabled={!prevLesson}
                  className="flex-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-2 flex items-center justify-center gap-1 text-xs text-white transition-colors"
                >
                  <ChevronLeft className="w-3 h-3" />
                  Előző
                </button>
                <button
                  onClick={() => nextLesson && router.push(`/courses/${courseId}/lessons/${nextLesson.id}`)}
                  disabled={!nextLesson}
                  className="flex-1 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg p-2 flex items-center justify-center gap-1 text-xs text-white transition-colors"
                >
                  Következő
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Detailed Module Navigation (Collapsible) */}
            {showNavigation && (
              <div className="space-y-3">
                {modules.map((module: any, moduleIndex: number) => {
                  const isCurrentModule = module.id === currentModule?.id
                  const moduleProgress = module.lessons.filter((l: any) => l.progress?.completed || l.progress?.watchPercentage >= 90).length
                  const moduleTotal = module.lessons.length
                  const modulePercentage = moduleTotal > 0 ? Math.round((moduleProgress / moduleTotal) * 100) : 0
                  
                  return (
                    <div key={module.id} className={`rounded-lg ${isCurrentModule ? 'bg-white/15 border border-white/30' : 'bg-white/5'}`}>
                      <div className="p-3">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-sm font-medium text-white flex items-center gap-2">
                            <span className="w-5 h-5 rounded bg-white/20 flex items-center justify-center text-xs">
                              {moduleIndex + 1}
                            </span>
                            {module.title}
                          </h3>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-teal-200">{moduleProgress}/{moduleTotal}</span>
                            {modulePercentage === 100 && <CheckCircle className="w-3 h-3 text-green-300" />}
                          </div>
                        </div>
                        
                        {/* Module Progress Bar */}
                        <div className="w-full bg-white/20 rounded-full h-1 mb-3">
                          <div 
                            className="bg-white rounded-full h-1 transition-all duration-300" 
                            style={{ width: `${modulePercentage}%` }}
                          />
                        </div>
                        
                        {/* Lessons List */}
                        <div className="space-y-1">
                          {module.lessons.map((moduleLesson: any, lessonIndex: number) => {
                            const isCurrentLesson = moduleLesson.id === lessonId
                            const isCompleted = moduleLesson.progress?.completed || moduleLesson.progress?.watchPercentage >= 90
                            
                            return (
                              <button
                                key={moduleLesson.id}
                                onClick={() => router.push(`/courses/${courseId}/lessons/${moduleLesson.id}`)}
                                className={`w-full text-left p-2 rounded transition-colors group ${
                                  isCurrentLesson 
                                    ? 'bg-white/20 border-l-2 border-white' 
                                    : 'hover:bg-white/10'
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  <div className={`w-4 h-4 rounded-full flex items-center justify-center text-xs ${
                                    isCompleted 
                                      ? 'bg-green-400 text-green-900' 
                                      : isCurrentLesson 
                                        ? 'bg-white text-teal-700' 
                                        : 'bg-white/20 text-white'
                                  }`}>
                                    {isCompleted ? <CheckCircle className="w-3 h-3" /> : lessonIndex + 1}
                                  </div>
                                  <div className="flex-1">
                                    <div className={`text-xs font-medium ${isCurrentLesson ? 'text-white' : 'text-teal-100'}`}>
                                      {moduleLesson.title}
                                    </div>
                                    <div className={`text-xs ${isCurrentLesson ? 'text-teal-100' : 'text-teal-300'}`}>
                                      {moduleLesson.duration || '15'} perc • {moduleLesson.difficulty || 'Kezdő'}
                                    </div>
                                  </div>
                                  {isCurrentLesson && <Play className="w-3 h-3 text-white" />}
                                </div>
                              </button>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-6 border-t border-white/20">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/courses/${courseId}`)}
              className="w-full bg-white/10 backdrop-blur-sm border border-white/30 text-white hover:bg-white/20 hover:text-white mb-2 font-medium"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Vissza a kurzushoz
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={() => router.push(`/courses/${courseId}/player/${lessonId}`)}
              className="w-full bg-white hover:bg-gray-100 font-medium"
              style={{ color: '#0F766E' }}
            >
              <Maximize className="w-4 h-4 mr-2" />
              Fókusz mód
            </Button>
          </div>
        </div>
        )}

        {/* Collapsed Sidebar Content */}
        {sidebarState === 'collapsed' && (
          <div className="flex flex-col h-full items-center py-6">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mb-4">
              <Monitor className="w-5 h-5" style={{ color: '#0F766E' }} />
            </div>
            
            {/* Compact Progress Ring - Real Data */}
            <div className="text-center mb-4">
              <div className="relative w-12 h-12 mx-auto mb-2">
                <svg className="w-12 h-12 -rotate-90" viewBox="0 0 36 36">
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="rgba(255,255,255,0.2)"
                    strokeWidth="3"
                  />
                  <path
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="white"
                    strokeWidth="3"
                    strokeDasharray={`${realProgress}, 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-bold text-white">{realProgress}%</span>
                </div>
              </div>
              <div className="text-xs text-teal-200">{completedLessons}/{totalLessons}</div>
            </div>

            {/* Compact Stats */}
            <div className="space-y-3 mb-6">
              {/* Streak */}
              <div className="flex flex-col items-center">
                <Flame className="w-4 h-4 text-orange-300 mb-1" />
                <div className="text-xs font-bold text-white">{stats.currentStreak || 5}</div>
              </div>
              
              {/* Points */}
              <div className="flex flex-col items-center">
                <Trophy className="w-4 h-4 text-yellow-300 mb-1" />
                <div className="text-xs font-bold text-white">{stats.totalPoints || 450}</div>
              </div>
              
              {/* Goals */}
              <div className="flex flex-col items-center">
                <Target className="w-4 h-4 text-green-300 mb-1" />
                <div className="text-xs font-bold text-white">{stats.weeklyProgress || 3}/{stats.weeklyGoal || 5}</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-auto space-y-2">
              <button
                onClick={() => setSidebarState('expanded')}
                className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Academic Content Area - Responsive */}
      <div className="flex-1 flex flex-col bg-white relative">

        {/* Exit Cinema Mode Button */}
        {sidebarState === 'hidden' && (
          <div className="absolute top-4 left-4 z-30">
            <button
              onClick={exitCinemaMode}
              className="bg-black/60 hover:bg-black/80 text-white rounded-lg px-3 py-2 text-xs font-medium transition-all backdrop-blur-sm mb-2"
            >
              <RotateCcw className="w-3 h-3 mr-1 inline" />
              Exit Cinema
            </button>
            <div className="text-xs text-white/60 bg-black/40 rounded px-2 py-1 backdrop-blur-sm">
              ESC to exit • C for cinema • S for sidebar
            </div>
          </div>
        )}

        {/* Simplified Header - Hide in Cinema Mode */}
        {!isVideoFocused && (
          <div className="bg-white border-b border-gray-200 px-6 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded flex items-center justify-center" style={{ backgroundColor: '#e6fffa' }}>
                  <span className="text-xs font-bold" style={{ color: '#0F766E' }}>ME</span>
                </div>
                <div className="text-sm text-gray-500">PROG-101 • 2024/25</div>
              </div>
              <div className="text-sm font-medium" style={{ color: '#0F766E' }}>45% befejezve</div>
            </div>
          </div>
        )}

        {/* Main content with restructured flow */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* LESSON HEADER BAR - Only show when not in cinema mode */}
          {!isVideoFocused && (
            <div className="bg-white border-b border-gray-200 px-6 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h1 className="text-lg font-semibold text-gray-900">
                    {lesson?.title || 'Mi a programozás?'}
                  </h1>
                  <div className="flex items-center gap-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
                      Kezdő
                    </span>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Play className="w-3 h-3" />
                      15p
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {currentLessonInModule}/{totalLessonsInModule} • {realProgress}% kész
                </div>
              </div>
            </div>
          )}

          {/* PRIMARY CONTENT AREA - Optimized for video */}
          <div className={`flex-1 overflow-hidden ${isVideoFocused ? 'p-0' : 'p-6'}`}>
            <div className={`h-full ${isVideoFocused ? 'space-y-0' : 'space-y-6 overflow-y-auto'}`}>

              {locked ? (
                <div className="flex-1 flex items-center justify-center text-center p-8">
                  <div>
                    <Monitor className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                    <h3 className="text-xl font-semibold mb-2">Előfizetés szükséges</h3>
                    <p className="text-gray-600 mb-4">Ez a lecke csak előfizetőknek érhető el.</p>
                    <Button onClick={() => router.push(`/courses/${courseId}`)}>
                      Előfizetés indítása
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {/* Device Sync Notification - Hide in cinema mode */}
                  {!isVideoFocused && (
                    <DeviceSyncNotification 
                      lessonId={lessonId}
                      courseId={courseId}
                      className="mb-4"
                    />
                  )}

                  {/* PRIMARY VIDEO/CONTENT AREA - Responsive sizing */}
                  <div className={`${
                    isVideoFocused 
                      ? 'h-full w-full bg-black' 
                      : 'bg-white rounded-lg border border-gray-200 mb-6'
                  } relative`}>
                    {console.log('🔍 [LessonPage] Passing to LessonContentRenderer:', {
                      lesson: lesson,
                      lessonType: lesson?.type,
                      hasLesson: !!lesson,
                      lessonTitle: lesson?.title
                    })}
                    
                    <LessonContentRenderer
                      lesson={lesson}
                      playerData={playerData}
                      courseId={courseId}
                      userId={user?.uid}
                      onProgress={handleProgress}
                      onCompleted={handleCompleted}
                      hasAccess={!locked}
                    />
                  </div>

                  {/* LESSON DETAILS PANEL - Hide in cinema mode */}
                  {!isVideoFocused && (
                    <div className="rounded-lg border border-gray-200 p-6 mb-6" style={{ backgroundColor: '#f0fdfa' }}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#0F766E' }}>
                          <Monitor className="w-5 h-5 text-white" />
                        </div>
                        <h2 className="text-lg font-semibold" style={{ color: '#134e4a' }}>Tanulási célok</h2>
                      </div>
                      <ul className="space-y-3" style={{ color: '#0f5132' }}>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#0F766E' }}></div>
                          <span>Programozás fogalmának megértése</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#0F766E' }}></div>
                          <span>Programozási nyelvek típusainak megismerése</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <div className="w-2 h-2 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: '#0F766E' }}></div>
                          <span>Algoritmus és program közötti különbség</span>
                        </li>
                      </ul>
                    </div>
                  )}

                  {/* Lesson Resources - Hide in cinema mode */}
                  {!isVideoFocused && (lesson as any)?.resources && (lesson as any).resources.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Lecke anyagok</h3>
                      <LessonResourcesList resources={(lesson as any)?.resources} />
                    </div>
                  )}
                </>
              )}

              {/* Navigation Controls - Hide in cinema mode */}
              {!isVideoFocused && (
                <div className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t border-gray-200">
                  <Button 
                    disabled={!prevLesson} 
                    variant="outline" 
                    className="flex items-center gap-2"
                    onClick={() => prevLesson && router.push(`/courses/${courseId}/lessons/${prevLesson.id}`)}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Előző lecke
                    {prevLesson && (
                      <div className="text-xs text-gray-500 ml-2">
                        {prevLesson.title}
                      </div>
                    )}
                  </Button>
                  <Button 
                    disabled={!nextLesson} 
                    variant="default" 
                    className="flex items-center gap-2 hover:opacity-90"
                    style={{ backgroundColor: '#0F766E' }}
                    onClick={() => nextLesson && router.push(`/courses/${courseId}/lessons/${nextLesson.id}`)}
                  >
                    Következő lecke
                    <ChevronRight className="w-4 h-4" />
                    {nextLesson && (
                      <div className="text-xs text-teal-200 ml-2">
                        {nextLesson.title}
                      </div>
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
} 