"use client"

import { useRouter } from 'next/navigation'
import { useCourse } from '@/hooks/useCourseQueries'
import { useSubscriptionStatus } from '@/hooks/useSubscriptionStatus'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useEnrollInCourse } from '@/hooks/useCourseQueries'
import { useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import React, { useState } from 'react'
import { CheckoutForm } from '@/components/payment/CheckoutForm'
import { 
  Clock, 
  Users, 
  Star, 
  BookOpen, 
  CheckCircle, 
  Award, 
  Shield,
  CreditCard,
  Gift,
  ArrowLeft,
  Play,
  Download,
  Globe
} from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function ClientCourseDetailPage({ id }: { id: string }) {
  const router = useRouter()
  const { user, isAuthenticated, authReady } = useAuthStore()
  const { data: course, isLoading, error } = useCourse(id)
  
  console.log('🔍 ClientCourseDetailPage - course data:', {
    id,
    course: course ? { id: course.id, title: course.title } : null,
    isLoading,
    error: error?.message
  })
  
  // Log the complete course object to check modules structure
  if (course) {
    console.log('🔍 Full course object:', {
      ...course,
      modules: course.modules?.map(mod => ({
        id: mod.id,
        title: mod.title,
        lessonsCount: mod.lessons?.length || 0
      }))
    });
  }
  const enrollMutation = useEnrollInCourse()
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [selectedOption, setSelectedOption] = useState<'free' | 'paid' | null>(null)

  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  React.useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    if (success) {
      toast.success('Sikeres beiratkozás! A kurzushoz hozzáférsz.');
      queryClient.invalidateQueries({ queryKey: ['course', id] });
      router.replace(`/courses/${id}`);
    } else if (canceled) {
      toast.error('A fizetés megszakítva.');
      router.replace(`/courses/${id}`);
    }
  }, [searchParams, id, queryClient, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-primary">Betöltés...</p>
      </div>
    )
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-red-600">A kurzus nem található</p>
          <Button onClick={() => router.push('/courses')} className="mt-4">Vissza a kurzusokhoz</Button>
        </div>
      </div>
    )
  }

  const c = course!
  const modulesData = Array.isArray(c.modules) ? c.modules : [];
  const lessonsData = modulesData.flatMap(mod => Array.isArray(mod.lessons) ? mod.lessons : []);
  
  // Calculate course stats
  const stats = {
    modules: modulesData.length,
    lessons: lessonsData.length,
    students: c.enrollmentCount || 0,
    rating: c.averageRating || 4.5,
    duration: `${Math.max(10, modulesData.length * 2)}+ óra`
  }

  // Course pricing
  const isFreeCourse = !c.price || c.price === 0
  const coursePrice = c.price || 0
  
  const handleFreeEnrollment = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect_to=${encodeURIComponent(`/courses/${id}`)}`)
      return
    }

    try {
      const result = await enrollMutation.mutateAsync(id)
      if (result.alreadyEnrolled) {
        toast.info('Már beiratkozott erre a kurzusra!')
      } else {
        toast.success('Sikeres ingyenes beiratkozás!')
      }
      // Redirect to my-learning page after enrollment
      router.push('/dashboard/my-learning')
    } catch (error: any) {
      console.error('Free enrollment failed:', error)
      toast.error('Hiba történt a beiratkozáskor. Próbálja újra.')
    }
  }

  const handlePaidEnrollment = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect_to=${encodeURIComponent(`/courses/${id}`)}`)
      return
    }
    
    setSelectedOption('paid')
    setShowPaymentForm(true)
  }

  const courseFeatures = [
    `${stats.lessons} lecke`,
    `${stats.duration} tartalom`,
    'Tanúsítvány a sikeres elvégzés után',
    'Élethosszig tartó hozzáférés',
    '30 napos pénzvisszafizetési garancia',
    'Letölthető anyagok',
    'Mobil hozzáférés'
  ]

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('hu-HU', {
      style: 'currency',
      currency: 'HUF',
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          href="/courses"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Vissza a kurzusokhoz
        </Link>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course Information - Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Course Header */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-2">{c.title}</h1>
                    <p className="text-lg text-muted-foreground mb-4">{c.description}</p>
                    
                    {/* Course Stats */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {stats.duration}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {stats.students} hallgató
                      </div>
                      <div className="flex items-center">
                        <Star className="w-4 h-4 mr-1 fill-yellow-400 text-yellow-400" />
                        {stats.rating.toFixed(1)}
                      </div>
                      <Badge variant="secondary">Kezdő</Badge>
                    </div>
                  </div>
                </div>

                {/* Course Thumbnail */}
                {c.thumbnailUrl && (
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                    <Image 
                      src={c.thumbnailUrl}
                      alt={c.title}
                      width={800}
                      height={450}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* What You'll Learn */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Mit fogsz tanulni?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-3">
                  {courseFeatures.map((feature, index) => (
                    <div key={index} className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Course Content */}
            {modulesData.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Kurzus tartalma</CardTitle>
                  <CardDescription>
                    {stats.lessons} lecke • {stats.duration} tartalom
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {modulesData.slice(0, 3).map((module, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <h4 className="font-medium mb-1">{module.title}</h4>
                        <p className="text-sm text-muted-foreground">
                          {module.lessons?.length || 0} lecke
                        </p>
                      </div>
                    ))}
                    {modulesData.length > 3 && (
                      <p className="text-sm text-muted-foreground text-center">
                        +{modulesData.length - 3} további modul
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructor */}
            {(c.instructor || c.instructorName) && (
              <Card>
                <CardHeader>
                  <CardTitle>Oktató</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    {(c.instructor?.profilePictureUrl || c.instructorImageUrl) ? (
                      <Image 
                        src={c.instructor?.profilePictureUrl || c.instructorImageUrl}
                        alt={c.instructor ? `${c.instructor.firstName} ${c.instructor.lastName}` : c.instructorName}
                        width={64}
                        height={64}
                        className="w-16 h-16 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="w-8 h-8 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold text-lg">
                        {c.instructor ? `${c.instructor.firstName} ${c.instructor.lastName}` : c.instructorName}
                      </h4>
                      {(c.instructor?.title || c.instructorTitle) && (
                        <p className="text-muted-foreground mb-2">{c.instructor?.title || c.instructorTitle}</p>
                      )}
                      {(c.instructor?.bio || c.instructorBio) && (
                        <p className="text-sm text-muted-foreground">{c.instructor?.bio || c.instructorBio}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Enrollment Options - Right Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {!showPaymentForm ? (
                <>
                  {/* Show enrollment option based on course price */}
                  {isFreeCourse ? (
                    /* Free Course Option */
                    <Card className="border-2 border-green-200 shadow-lg">
                      <CardHeader className="bg-green-50">
                        <CardTitle className="flex items-center text-green-800">
                          <Gift className="w-5 h-5 mr-2" />
                          Ingyenes kurzus
                        </CardTitle>
                        <CardDescription className="text-green-600">
                          Teljes hozzáférés díjmentesen
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        <div className="text-center mb-6">
                          <div className="text-3xl font-bold text-green-600 mb-2">
                            {formatPrice(0)}
                          </div>
                          <p className="text-sm text-gray-600">Ingyenes hozzáférés</p>
                        </div>
                        
                        <div className="space-y-3 mb-6">
                          {courseFeatures.map((feature, index) => (
                            <div key={index} className="flex items-center text-sm">
                              <CheckCircle className="w-4 h-4 text-green-500 mr-2" />
                              <span>{feature}</span>
                            </div>
                          ))}
                        </div>

                        <Button 
                          onClick={handleFreeEnrollment}
                          className="w-full bg-green-600 hover:bg-green-700"
                          disabled={enrollMutation.isPending}
                          size="lg"
                        >
                          <Gift className="w-4 h-4 mr-2" />
                          {enrollMutation.isPending ? 'Beiratkozás...' : 'Ingyenes beiratkozás'}
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    /* Paid Course Option */
                    <Card className="border-2 border-blue-200 shadow-lg">
                    <CardHeader className="bg-blue-50">
                      <CardTitle className="flex items-center text-blue-800">
                        <Award className="w-5 h-5 mr-2" />
                        Prémium beiratkozás
                      </CardTitle>
                      <CardDescription className="text-blue-600">
                        Teljes hozzáférés minden funkcióval
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="text-center mb-6">
                        <div className="text-3xl font-bold text-blue-600 mb-2">
                          {formatPrice(coursePrice)}
                        </div>
                        <p className="text-sm text-gray-600">Egyszeri fizetés</p>
                      </div>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                          <span>Minden ingyenes funkció</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                          <span>Tanúsítvány a befejezéskor</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                          <span>Letölthető anyagok</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                          <span>Élethosszig tartó hozzáférés</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                          <span>Prioritás támogatás</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <CheckCircle className="w-4 h-4 text-blue-500 mr-2" />
                          <span>30 napos garancia</span>
                        </div>
                      </div>

                      <Button 
                        onClick={handlePaidEnrollment}
                        className="w-full bg-blue-600 hover:bg-blue-700"
                        size="lg"
                      >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Prémium beiratkozás
                      </Button>
                    </CardContent>
                  </Card>
                  )}
                </>
              ) : (
                /* Payment Form */
                <Card className="shadow-lg">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center">
                        <Shield className="w-5 h-5 mr-2 text-green-600" />
                        Prémium beiratkozás
                      </CardTitle>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => setShowPaymentForm(false)}
                      >
                        <ArrowLeft className="w-4 h-4" />
                      </Button>
                    </div>
                    <CardDescription>
                      Biztonságos fizetés Stripe segítségével
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <CheckoutForm
                      courseId={c.id}
                      amount={paidPrice}
                      currency="HUF"
                      description={c.title}
                      mode="payment"
                      features={courseFeatures}
                      onSuccess={() => {
                        router.push(`/courses/${id}/learn?success=true`);
                      }}
                      onError={(error) => {
                        console.error('Payment error:', error);
                        toast.error('Hiba történt a fizetés során. Próbálja újra.');
                      }}
                    />
                  </CardContent>
                </Card>
              )}

              {/* Money Back Guarantee */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-8 h-8 text-green-600" />
                    <div>
                      <h4 className="font-semibold text-sm">30 napos garancia</h4>
                      <p className="text-xs text-muted-foreground">
                        Ha nem elégedett, teljes összeget visszatérítjük
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Support Info */}
              <Card>
                <CardContent className="p-4 text-center">
                  <p className="text-sm text-muted-foreground mb-2">
                    Kérdése van a kurzussal kapcsolatban?
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href="/support">
                      Kapcsolat
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 