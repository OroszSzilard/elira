"use client" // This page needs to be a client component for hooks and event handlers
import React from 'react'
import { HeroSection } from '@/components/landing/HeroSection'
import { RoleSelector } from '@/components/landing/RoleSelector'
import { HowItWorks } from '@/components/landing/HowItWorks'
import { PricingGuarantee } from '@/components/landing/PricingGuarantee'
import { WhyElira } from '@/components/landing/WhyElira'
import { TrendingCourses } from '@/components/landing/TrendingCourses'

// TEMPORARILY DISABLED - Firebase dependent components:
// import { CourseSearch } from '@/components/landing/CourseSearch'
// import { DynamicMetrics } from '@/components/landing/DynamicMetrics'
// import { FeaturedCourses } from '@/components/landing/FeaturedCourses'
// import { CourseCategories } from '@/components/landing/CourseCategories'
// import { SocialProof } from '@/components/landing/SocialProof'
// import { InstructorShowcase } from '@/components/landing/InstructorShowcase'
// import { CallToAction } from '@/components/landing/CallToAction'

export default function HomePage() {
  return (
    <main>
      {/* ✅ WORKING - Hero Section with mock data */}
      <HeroSection />
      
      {/* ✅ WORKING - No Firebase calls */}
      <RoleSelector />
      
      {/* ✅ WORKING - Trending courses sorted by enrollment */}
      <TrendingCourses />
      
      {/* ✅ WORKING - Static content */}
      <HowItWorks />
      
      {/* ✅ WORKING - Static content */}
      <WhyElira />
      
      {/* ✅ WORKING - Static content */}
      <PricingGuarantee />

      {/* 🔧 TEMPORARILY DISABLED - Firebase dependent */}
      {/* <CourseSearch /> */}
      {/* <DynamicMetrics /> */}
      {/* <FeaturedCourses /> */}
      {/* <CourseCategories /> */}
      {/* <SocialProof /> */}
      {/* <InstructorShowcase /> */}
      {/* <CallToAction /> */}
    </main>
  );
}