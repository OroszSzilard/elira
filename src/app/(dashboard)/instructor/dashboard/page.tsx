'use client'

import { RoleDashboardLayout } from '@/components/layout/RoleDashboardLayout'
import { useAuthStore } from '@/stores/authStore'
import { BookOpen } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function InstructorDashboard() {
  const { user } = useAuthStore()

  return (
    <RoleDashboardLayout>
      {/* Greeting */}
      <section className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900">Üdvözöljük, {user?.firstName}!</h1>
        <p className="text-gray-600">Itt kezelheti kurzusait és megtekintheti statisztikáit.</p>
      </section>

      {/* Quick actions */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Course creation action removed */}

        {/* Manage Courses */}
        <div className="bg-white shadow rounded-lg p-6 flex flex-col justify-between">
          <div>
            <BookOpen className="h-8 w-8 text-primary mb-4" />
            <h2 className="text-lg font-semibold mb-2">Kurzusaim</h2>
            <p className="text-sm text-gray-600 mb-4">Módosítsa meglévő kurzusait, vagy tekintse meg statisztikáikat.</p>
          </div>
          <Link href="/admin/courses">
            <Button variant="outline" className="w-full">Kurzusok kezelése</Button>
          </Link>
        </div>
      </section>
      {/* Placeholder for analytics grid */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Gyors statisztikák</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-sm text-gray-500">Összes kurzus</p>
            <p className="text-3xl font-bold text-gray-900">--</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-sm text-gray-500">Összes beiratkozás</p>
            <p className="text-3xl font-bold text-gray-900">--</p>
          </div>
          <div className="bg-white shadow rounded-lg p-6">
            <p className="text-sm text-gray-500">Átlagos értékelés</p>
            <p className="text-3xl font-bold text-gray-900">--</p>
          </div>
        </div>
      </section>
    </RoleDashboardLayout>
  )
} 