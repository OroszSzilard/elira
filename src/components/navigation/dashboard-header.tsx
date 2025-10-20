'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { cn } from '@/lib/utils'
import {
  Bell,
  Search,
  LogOut,
  Settings,
  ChevronDown,
  BookOpen,
  Award,
  Menu,
  Home
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { toast } from 'sonner'

export function DashboardHeader() {
  const { user, clearAuth } = useAuthStore()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')

  // Generate initials from available user data
  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    }
    if (user?.displayName) {
      const parts = user.displayName.split(' ')
      if (parts.length >= 2) {
        return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase()
      }
      return user.displayName.substring(0, 2).toUpperCase()
    }
    if (user?.email) {
      return user.email.substring(0, 2).toUpperCase()
    }
    return 'U'
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      clearAuth()
      toast.success('Sikeres kijelentkezés')
      router.push('/login')
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Hiba történt a kijelentkezés során')
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/courses?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* Logo and Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <img 
                src="/images/navbar-logo.png" 
                alt="ELIRA" 
                className="h-8 w-auto"
              />
            </Link>
            
            {/* Home button */}
            <Link 
              href="/" 
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Főoldal</span>
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Kurzusok keresése..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 w-80 bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600"
              />
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Quick Stats - only for students */}
            {user?.role === 'STUDENT' && (
              <div className="hidden lg:flex items-center gap-6 mr-4">
                <Link href="/dashboard/my-learning" className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  <BookOpen className="h-4 w-4" />
                  <span>3 aktív kurzus</span>
                </Link>
                <Link href="/dashboard/certificates" className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  <Award className="h-4 w-4" />
                  <span>2 tanúsítvány</span>
                </Link>
              </div>
            )}
            
            {/* Role indicator */}
            {user && (
              <div className="hidden md:flex items-center mr-4">
                <span className={cn(
                  "px-3 py-1 text-xs font-semibold rounded-full",
                  user.role === 'ADMIN' ? "bg-red-100 text-red-700" :
                  user.role === 'INSTRUCTOR' ? "bg-purple-100 text-purple-700" :
                  (user.role === 'UNIVERSITY_ADMIN' || user.role === 'university_admin') ? "bg-blue-100 text-blue-700" :
                  "bg-teal-100 text-teal-700"
                )}>
                  {user.role === 'ADMIN' ? 'Admin' :
                   user.role === 'INSTRUCTOR' ? 'Oktató' :
                   (user.role === 'UNIVERSITY_ADMIN' || user.role === 'university_admin') ? 'Egyetem Admin' :
                   'Diák'}
                </span>
              </div>
            )}

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {getInitials()}
                    </span>
                  </div>
                  <span className="hidden md:block text-sm font-medium">
                    {user?.firstName && user?.lastName ? `${user.firstName} ${user.lastName}` : 
                     user?.displayName || user?.firstName || user?.lastName || user?.email}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium">{user?.firstName} {user?.lastName}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    Beállítások
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Kijelentkezés
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  )
}