'use client';

import { useRouter } from 'next/navigation';
import { useCourse } from '@/hooks/useCourseQueries';
import { useEnrollInCourse } from '@/hooks/useCourseQueries';
import { useSearchParams } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import React, { useState } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';
import { PremiumHeader } from '@/components/PremiumHeader';
import { PremiumFooter } from '@/components/PremiumFooter';
import { CourseDetailHero } from '@/components/course/CourseDetailHero';
import { CourseDetailStatsBar } from '@/components/course/CourseDetailStatsBar';
import { CourseCurriculumSection } from '@/components/course/CourseCurriculumSection';
import { CourseInstructorCard } from '@/components/course/CourseInstructorCard';
import { CourseEnrollmentCard } from '@/components/course/CourseEnrollmentCard';
import { CourseGuaranteeSection } from '@/components/course/CourseGuaranteeSection';
import { CheckoutForm } from '@/components/payment/CheckoutForm';
import { motion } from "motion/react";
import { brandGradient } from '@/lib/design-tokens';
import { CheckCircle, ArrowRight, Shield } from 'lucide-react';

export default function ClientCourseDetailPage({ id }: { id: string }) {
  const router = useRouter();
  const { user, isAuthenticated, authReady } = useAuthStore();
  const { data: course, isLoading, error } = useCourse(id);
  const enrollMutation = useEnrollInCourse();
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();

  // Handle payment success/cancel
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

  // Loading state
  if (isLoading) {
    return (
      <AuthProvider>
        <PremiumHeader />
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: brandGradient }}
        >
          <div className="text-center">
            <div
              className="animate-spin rounded-full h-16 w-16 mx-auto mb-6"
              style={{
                border: '3px solid rgba(255, 255, 255, 0.2)',
                borderTopColor: 'white'
              }}
            />
            <p className="text-lg text-white/80">Kurzus betöltése...</p>
          </div>
        </div>
        <PremiumFooter />
      </AuthProvider>
    );
  }

  // Error state
  if (error || !course) {
    return (
      <AuthProvider>
        <PremiumHeader />
        <div
          className="min-h-screen flex items-center justify-center"
          style={{ background: brandGradient }}
        >
          <div className="text-center">
            <h1 className="text-3xl font-bold text-white mb-4">Kurzus nem található</h1>
            <p className="text-white/80 mb-6">
              A keresett kurzus nem létezik vagy nem elérhető.
            </p>
            <button
              onClick={() => router.push('/courses')}
              className="px-6 py-3 bg-white hover:bg-gray-50 text-gray-900 rounded-full font-semibold transition-colors duration-200"
            >
              Vissza a kurzusokhoz
            </button>
          </div>
        </div>
        <PremiumFooter />
      </AuthProvider>
    );
  }

  // Process course data
  const c = course;
  const modulesData = Array.isArray(c.modules) ? c.modules : [];
  const lessonsData = modulesData.flatMap(mod => Array.isArray(mod.lessons) ? mod.lessons : []);

  // Calculate course stats
  const stats = {
    modules: modulesData.length,
    lessons: lessonsData.length,
    students: c.enrollmentCount || c.students || 0,
    rating: c.averageRating || c.rating || 4.5,
    duration: c.duration || `${Math.max(10, modulesData.length * 2)} óra`
  };

  // Course pricing
  const isFreeCourse = !c.price || c.price === 0;
  const coursePrice = c.price || 0;

  // Prepare modules for curriculum section
  const formattedModules = modulesData.map((module: any, index) => ({
    id: module.id || `module-${index}`,
    title: module.title || `Modul ${index + 1}`,
    description: module.description,
    duration: module.duration,
    lessons: (module.lessons || []).map((lesson: any, lessonIndex: number) => ({
      id: lesson.id || `lesson-${index}-${lessonIndex}`,
      title: lesson.title || `Lecke ${lessonIndex + 1}`,
      duration: lesson.duration,
      type: lesson.type || 'video',
      completed: lesson.completed || false,
      locked: lesson.locked || false,
      preview: lesson.preview || lessonIndex === 0 // First lesson is preview
    }))
  }));

  // Enrollment handlers
  const handleFreeEnrollment = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect_to=${encodeURIComponent(`/courses/${id}`)}`);
      return;
    }

    try {
      const result = await enrollMutation.mutateAsync(id);
      if (result.alreadyEnrolled) {
        toast.info('Már beiratkozott erre a kurzusra!');
      } else {
        toast.success('Sikeres ingyenes beiratkozás!');
      }
      router.push('/dashboard/my-learning');
    } catch (error: any) {
      console.error('Free enrollment failed:', error);
      toast.error('Hiba történt a beiratkozáskor. Próbálja újra.');
    }
  };

  const handlePaidEnrollment = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect_to=${encodeURIComponent(`/courses/${id}`)}`);
      return;
    }
    setShowPaymentForm(true);
  };

  const handleEnroll = () => {
    if (isFreeCourse) {
      handleFreeEnrollment();
    } else {
      handlePaidEnrollment();
    }
  };

  // Instructor data
  const instructorData = c.instructor || {};
  const instructorName = c.instructorName ||
    (instructorData.firstName && instructorData.lastName
      ? `${instructorData.firstName} ${instructorData.lastName}`
      : 'ELIRA Oktató');

  const courseFeatures = [
    `${stats.lessons} lecke`,
    `${stats.duration} tartalom`,
    'Tanúsítvány a sikeres elvégzés után',
    'Élethosszig tartó hozzáférés',
    '30 napos pénzvisszafizetési garancia',
    'Letölthető anyagok',
    'Mobil hozzáférés'
  ];

  return (
    <AuthProvider>
      <PremiumHeader />

      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <CourseDetailHero
          title={c.title}
          description={c.description || ''}
          category={c.category || 'Általános'}
          level={c.level || 'kezdő'}
          duration={stats.duration}
          rating={stats.rating}
          students={stats.students}
          lessons={stats.lessons}
          imageUrl={c.thumbnailUrl || c.imageUrl}
        />

        {/* Stats Bar */}
        <CourseDetailStatsBar
          completionRate={94}
          certificateAvailable={true}
          skillsGained={12}
          guarantee={true}
        />

        {/* Main Content */}
        <div className="container mx-auto px-6 lg:px-12 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-16">
              {/* What You'll Learn Section */}
              {c.whatYouWillLearn && c.whatYouWillLearn.length > 0 && (
                <motion.section
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Mit fogsz megtanulni?
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    {c.whatYouWillLearn.map((item: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Requirements Section */}
              {c.requirements && c.requirements.length > 0 && (
                <motion.section
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Előfeltételek
                  </h2>
                  <ul className="space-y-3">
                    {c.requirements.map((item: string, index: number) => (
                      <li key={index} className="flex items-start gap-3">
                        <span className="text-gray-400 mt-1">•</span>
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </motion.section>
              )}

              {/* Target Audience Section */}
              {c.targetAudience && c.targetAudience.length > 0 && (
                <motion.section
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Kinek ajánlott ez a kurzus?
                  </h2>
                  <div className="space-y-3">
                    {c.targetAudience.map((item: string, index: number) => (
                      <div key={index} className="flex items-start gap-3">
                        <ArrowRight className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </div>
                    ))}
                  </div>
                </motion.section>
              )}

              {/* Curriculum Section */}
              {formattedModules.length > 0 && (
                <CourseCurriculumSection
                  modules={formattedModules}
                  totalLessons={stats.lessons}
                  totalDuration={stats.duration}
                />
              )}

              {/* Instructor Card */}
              <CourseInstructorCard
                name={instructorName}
                title={c.instructorTitle || instructorData.title}
                bio={c.instructorBio || instructorData.bio || 'Tapasztalt oktató az ELIRA platformon.'}
                imageUrl={c.instructorImageUrl || instructorData.profilePictureUrl}
                stats={{
                  students: stats.students,
                  courses: 5,
                  rating: stats.rating,
                  reviews: Math.floor(stats.students * 0.3)
                }}
                expertise={c.tags || ['Üzleti fejlődés', 'Soft skills', 'Szakmai képzés']}
              />

              {/* FAQ Section */}
              {c.faq && c.faq.length > 0 && (
                <motion.section
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Gyakran Ismételt Kérdések
                  </h2>
                  <div className="space-y-4">
                    {c.faq.map((item: { question: string; answer: string }, index: number) => (
                      <details
                        key={index}
                        className="group border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <summary className="cursor-pointer list-none p-4 bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
                          <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-gray-900">
                              {item.question}
                            </h3>
                            <svg
                              className="w-5 h-5 text-gray-500 transition-transform duration-200 group-open:rotate-180"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </div>
                        </summary>
                        <div className="p-4 bg-white border-t border-gray-200">
                          <p className="text-gray-700 whitespace-pre-line">
                            {item.answer}
                          </p>
                        </div>
                      </details>
                    ))}
                  </div>
                </motion.section>
              )}
            </div>

            {/* Right Column - Enrollment Card */}
            <div className="lg:col-span-1">
              {!showPaymentForm ? (
                <CourseEnrollmentCard
                  price={coursePrice}
                  duration={stats.duration}
                  lessons={stats.lessons}
                  rating={stats.rating}
                  students={stats.students}
                  certificateIncluded={true}
                  lifetimeAccess={true}
                  onEnroll={handleEnroll}
                  onPreview={() => console.log('Preview')}
                  isEnrolled={false}
                />
              ) : (
                /* Payment Form Card */
                <div className="sticky top-24">
                  <motion.div
                    className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="p-6 border-b border-gray-100">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xl font-semibold text-gray-900">
                          Biztonságos fizetés
                        </h3>
                        <button
                          onClick={() => setShowPaymentForm(false)}
                          className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                      <p className="text-sm text-gray-600">
                        Stripe segítségével
                      </p>
                    </div>
                    <div className="p-6">
                      <CheckoutForm
                        courseId={c.id}
                        amount={coursePrice}
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
                    </div>
                  </motion.div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Guarantee Section */}
        {c.guaranteeEnabled && c.guaranteeText && (
          <div className="container mx-auto px-6 lg:px-12 py-16">
            <motion.section
              className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-10 text-center shadow-lg border border-blue-200"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Shield className="w-16 h-16 text-blue-600 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {c.guaranteeDays || 30} Napos Pénzvisszafizetési Garancia
              </h2>
              <p className="text-lg text-gray-700 max-w-2xl mx-auto">
                {c.guaranteeText}
              </p>
            </motion.section>
          </div>
        )}
        {!c.guaranteeEnabled && <CourseGuaranteeSection />}
      </div>

      <PremiumFooter />
    </AuthProvider>
  );
}
