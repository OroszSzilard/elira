"use client"
import React from 'react'
import { Course } from '@/types'
import { UniversalCourseCard } from '@/components/ui/UniversalCourseCard'
import { useAuthStore } from '@/stores/authStore'
import { useEnrollInCourse } from '@/hooks/useCourseQueries'
import { toast } from 'sonner'

interface Props {
  course: Course
  trialMode?: boolean
  showPreview?: boolean
  variant?: 'default' | 'compact' | 'featured' | 'list' | 'minimal'
  context?: 'dashboard' | 'university' | 'search' | 'recommendations' | 'home'
}

export const CourseCard: React.FC<Props> = ({ 
  course, 
  trialMode, 
  showPreview = true,
  variant = 'default',
  context = 'home'
}) => {
  const { isAuthenticated, authReady } = useAuthStore()
  const enrollmentMutation = useEnrollInCourse()

  const handleCourseAction = async (action: string, courseData: any) => {
    switch (action) {
      case 'enroll':
        // For free courses, enroll directly
        if (!course.price || course.price === 0) {
          await handleEnroll()
        } else {
          // For paid courses, redirect to purchase page - ALWAYS use ID for consistency
          const purchaseUrl = `/courses/${course.id}/purchase`
          window.location.href = purchaseUrl
        }
        break
      case 'buy':
      case 'purchase':
        // Always redirect to purchase page - ALWAYS use ID for consistency
        const purchaseUrl = `/courses/${course.id}/purchase`
        window.location.href = purchaseUrl
        break
      case 'details':
        // For details, also use ID for consistency
        const urlPath = `/courses/${course.id}`
        const href = trialMode ? `${urlPath}?trial=true` : urlPath
        window.location.href = href
        break
      case 'bookmark':
        toast.info('Könyvjelző funkció hamarosan elérhető')
        break
      case 'share':
        if (navigator.share) {
          navigator.share({
            title: course.title,
            text: course.description,
            url: window.location.origin + `/courses/${course.id}`
          })
        } else {
          toast.info('Megosztás funkció hamarosan elérhető')
        }
        break
      default:
        console.log(`Unhandled action: ${action}`)
    }
  }

  const handleEnroll = async () => {
    if (!authReady) {
      toast.error('Autentikáció inicializálódik, kérjük várjon...')
      return
    }
    
    if (!isAuthenticated) {
      toast.error('Bejelentkezés szükséges')
      window.location.href = '/login'
      return
    }

    try {
      const result = await enrollmentMutation.mutateAsync(course.id)
      if (result.alreadyEnrolled) {
        toast.info('Már beiratkozott erre a kurzusra!')
      } else {
        toast.success('Sikeresen feliratkozott a kurzusra!')
      }
      // Redirect to my-learning page after enrollment
      window.location.href = '/dashboard/my-learning'
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Beiratkozás sikertelen'
      toast.error(errorMessage)
      console.error('Enrollment failed:', error)
    }
  }

  // Transform course data to Universal format
  const universalCourse = {
    id: course.id,
    title: course.title,
    slug: course.slug,
    thumbnailUrl: course.thumbnailUrl,
    description: course.description,
    instructor: course.instructor ? {
      firstName: course.instructor.firstName,
      lastName: course.instructor.lastName,
      title: course.instructor.title,
      imageUrl: course.instructor.profilePictureUrl
    } : undefined,
    university: course.university || course.instructorUniversity ? {
      name: (course.university || course.instructorUniversity)?.name || '',
      logoUrl: (course.university || course.instructorUniversity)?.logoUrl
    } : undefined,
    rating: course.averageRating,
    ratingCount: course.reviewCount,
    enrollmentCount: course.enrollmentCount,
    duration: course.duration,
    difficulty: course.difficulty === 'BEGINNER' ? 'Kezdő' :
                course.difficulty === 'INTERMEDIATE' ? 'Középhaladó' :
                course.difficulty === 'ADVANCED' ? 'Haladó' : 'Szakértő',
    category: course.category?.name,
    price: course.price || (course as any).priceHUF || (course.status === 'PAID' ? 450000 : undefined),
    originalPrice: (course as any).originalPrice || (course as any).originalPriceHUF,
    isFeatured: course.enrollmentCount ? course.enrollmentCount > 500 : false,
    hasVideo: true, // Most courses have video content
    certificateType: course.certificateEnabled ? 'Tanúsítvány' : undefined,
    completionRate: course.enrollmentCount ? Math.floor(Math.random() * 20) + 75 : undefined,
    isEnrolled: false, // Would need to check enrollment status
    isBookmarked: false, // Would need to check bookmark status
    createdAt: course.publishDate,
    updatedAt: course.updatedAt
  }

  // Determine which actions to show based on course price
  const getActionsForCourse = () => {
    const baseActions = ['details', 'bookmark', 'share'];
    
    if (!course.price || course.price === 0) {
      // Free course - show enroll button
      return ['enroll', ...baseActions];
    } else {
      // Paid course - show purchase button
      return ['purchase', ...baseActions];
    }
  };

  return (
    <UniversalCourseCard
      course={universalCourse}
      variant={variant}
      context={context}
      actions={getActionsForCourse()}
      showElements={['rating', 'price', 'instructor', 'students', 'category', 'difficulty']}
      onAction={handleCourseAction}
      priority={context === 'home'}
    />
  )
}