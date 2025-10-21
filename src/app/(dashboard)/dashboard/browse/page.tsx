'use client'

import { motion } from 'motion/react'
import { BrowseCoursesSection } from '@/components/dashboard/BrowseCoursesSection'
import { brandGradient, glassMorphism } from '@/lib/design-tokens'
import { Search, BookOpen } from 'lucide-react'

/**
 * Browse Courses Dashboard
 *
 * Enhanced course discovery interface with personalized recommendations,
 * trending courses, advanced filtering, and comprehensive course catalog
 */

export default function BrowseCoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Gradient Hero Section - Similar to /courses */}
      <section
        className="relative -mt-20 pt-20 pb-12"
        style={{ background: brandGradient }}
      >
        <div className="container mx-auto px-6 lg:px-12 py-12 relative z-10">
          <motion.div
            className="flex flex-col items-center gap-6 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm"
              style={{
                ...glassMorphism.badge,
                border: '1px solid rgba(255, 255, 255, 0.25)'
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <BookOpen className="w-4 h-4 text-white" />
              <span className="font-semibold text-white">Kurzus Katalógus</span>
            </motion.div>

            {/* Main Heading */}
            <div>
              <h1 className="text-4xl lg:text-5xl font-semibold text-white mb-3">
                Kurzusok Böngészése
              </h1>
              <p className="text-white/80 text-lg max-w-2xl mx-auto">
                Fedezzen fel új kurzusokat és fejlessze készségeit
              </p>
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
          {/* Browse Courses Section */}
          <BrowseCoursesSection />

          {/* Learning Path Suggestions */}
          <motion.div
            className="bg-white rounded-2xl border border-gray-200 p-6 lg:p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            whileHover={{ y: -4 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-3">
              Személyre szabott tanulási útvonalak
            </h2>
            <p className="text-gray-600 mb-4">
              A tanulási előzményei alapján javasolt kurzussorozatok és karrierutak.
            </p>
            <div className="flex flex-wrap gap-3">
              {['Web Development', 'Data Science', 'Digital Marketing', 'Project Management'].map((path, index) => (
                <motion.span
                  key={path}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-full text-sm font-medium cursor-pointer transition-colors"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {path}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}