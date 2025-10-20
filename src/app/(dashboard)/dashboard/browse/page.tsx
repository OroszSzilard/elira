'use client'

import { BrowseCoursesSection } from '@/components/dashboard/BrowseCoursesSection'

/**
 * Browse Courses Dashboard
 * 
 * Enhanced course discovery interface with personalized recommendations,
 * trending courses, advanced filtering, and comprehensive course catalog
 */

export default function BrowseCoursesPage() {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Kurzusok Böngészése</h1>
            <p className="text-gray-600 mt-1">
              Fedezzen fel új kurzusokat és fejlessze készségeit
            </p>
          </div>
        </div>

        {/* Browse Courses Section */}
        <BrowseCoursesSection />

        {/* Learning Path Suggestions */}
        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-3">
            Személyre szabott tanulási útvonalak
          </h2>
          <p className="text-gray-600 mb-4">
            A tanulási előzményei alapján javasolt kurzussorozatok és karrierutak.
          </p>
          <div className="flex flex-wrap gap-3">
            <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm">
              Web Development
            </span>
            <span className="px-3 py-1 bg-cyan-100 text-cyan-700 rounded-full text-sm">
              Data Science
            </span>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              Digital Marketing
            </span>
            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
              Project Management
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}