'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAuthStore } from '@/stores/authStore'
import { 
  Home,
  BookOpen, 
  GraduationCap,
  Search,
  TrendingUp,
  Award,
  Settings,
  Bell,
  Globe,
  ChevronRight,
  User,
  LogOut,
  Building2,
  UserCheck,
  FolderOpen
} from 'lucide-react'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'

/**
 * ELIRA Dashboard Sidebar - Coursera-Style Navigation
 * 
 * Features:
 * - Learning-focused navigation hierarchy
 * - User context and role-based menus
 * - Hungarian language labels
 * - Clean, professional design
 */

// Navigation items based on user role and learning focus
const navigationSections = {
  STUDENT: [
    {
      title: 'Tanulás',
      items: [
        { title: 'Kezdőlap', href: '/dashboard', icon: Home },
        { title: 'Tanulás folyamatban', href: '/dashboard/my-learning', icon: BookOpen },
        { title: 'Kurzusok böngészése', href: '/dashboard/browse', icon: Search },
        { title: 'Képesítések', href: '/dashboard/certificates', icon: Award },
      ]
    },
    {
      title: 'Karrier',
      items: [
        { title: 'Új karrier keresése', href: '/dashboard/career', icon: TrendingUp },
        { title: 'Online diplomák', href: '/dashboard/degrees', icon: GraduationCap },
      ]
    }
  ],
  INSTRUCTOR: [
    {
      title: 'Oktatás',
      items: [
        { title: 'Kezdőlap', href: '/dashboard', icon: Home },
        { title: 'Kurzusaim', href: '/dashboard/my-courses', icon: BookOpen },
        { title: 'Hallgatóim', href: '/dashboard/students', icon: User },
        { title: 'Analitika', href: '/dashboard/analytics', icon: TrendingUp },
      ]
    }
  ],
  ADMIN: [
    {
      title: 'Adminisztráció',
      items: [
        { title: 'Admin Vezérlőpult', href: '/admin/dashboard', icon: Home },
        { title: 'Analitika', href: '/admin/analytics', icon: TrendingUp },
      ]
    },
    {
      title: 'Oktatás Menedzsment',
      items: [
        { title: 'Kurzusok Kezelése', href: '/admin/courses', icon: BookOpen },
        { title: 'Beiratkozások', href: '/admin/enrollments', icon: GraduationCap },
        { title: 'Felhasználók', href: '/admin/users', icon: User },
        { title: 'Szerepkörök', href: '/admin/roles', icon: UserCheck },
      ]
    },
    {
      title: 'Intézmények',
      items: [
        { title: 'Egyetemek', href: '/admin/universities', icon: Building2 },
        { title: 'Kategóriák', href: '/admin/categories', icon: FolderOpen },
        { title: 'Értesítések', href: '/admin/notifications', icon: Bell },
        { title: 'Beállítások', href: '/admin/settings', icon: Settings },
      ]
    }
  ]
}

// Logout handler
async function handleLogout() {
  try {
    await signOut(auth)
  } catch (_) {}
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth-storage')
    window.location.href = '/login'
  }
}

interface NavigationItemProps {
  item: {
    title: string
    href: string
    icon: React.ComponentType<{ className?: string }>
  }
  isActive: boolean
}

function NavigationItem({ item, isActive }: NavigationItemProps) {
  const Icon = item.icon

  return (
    <Link
      href={item.href}
      className={cn(
        'flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors group',
        isActive 
          ? 'bg-teal-50 text-teal-700 dark:bg-teal-900/20 dark:text-teal-300' 
          : 'text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700/50'
      )}
    >
      <div className="flex items-center">
        <Icon className={cn(
          'w-4 h-4 mr-3',
          isActive ? 'text-teal-600 dark:text-teal-400' : 'text-gray-500 dark:text-gray-400'
        )} />
        {item.title}
      </div>
      <ChevronRight className={cn(
        'w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity',
        isActive ? 'opacity-100 text-teal-600 dark:text-teal-400' : 'text-gray-400'
      )} />
    </Link>
  )
}

export function DashboardSidebar() {
  const pathname = usePathname()
  const { user, authReady } = useAuthStore()

  // Loading state
  if (!authReady) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="flex-1 p-4 space-y-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  const userRole = user?.role ?? 'STUDENT'
  const sections = navigationSections[userRole] || navigationSections.STUDENT

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header with Elira branding */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-700">
        <Link href="/dashboard" className="flex items-center space-x-3 group">
          <div className="relative w-8 h-8 flex-shrink-0 transition-transform group-hover:scale-105">
            <Image 
              src="/images/navbar-logo.png" 
              alt="Elira logo" 
              fill
              className="object-contain rounded-full"
              sizes="32px"
              priority
            />
          </div>
          <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">
            Elira
          </span>
        </Link>
      </div>

      {/* Navigation Sections */}
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="space-y-6 px-4">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex}>
              <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 px-2">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavigationItem
                    key={item.href}
                    item={item}
                    isActive={pathname === item.href}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>
      </div>

      {/* User Profile Section */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {user?.email}
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-1">
          <Link
            href="/dashboard/notifications"
            className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <Bell className="w-4 h-4 mr-3" />
            Értesítések
          </Link>
          
          <Link
            href="/dashboard/settings"
            className="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg transition-colors"
          >
            <Settings className="w-4 h-4 mr-3" />
            Beállítások
          </Link>

          <div className="flex items-center px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
            <Globe className="w-4 h-4 mr-3" />
            Magyar
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
          >
            <LogOut className="w-4 h-4 mr-3" />
            Kijelentkezés
          </button>
        </div>
      </div>
    </div>
  )
}