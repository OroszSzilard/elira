'use client'

import React, { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useLogout } from '@/hooks/useLogout'
import Link from 'next/link'
import Image from 'next/image'
import { BookOpen, BarChart2, TrendingUp, ChevronDown, Menu, X, ChevronUp, Search, Building2 } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import FelfedezesMenu to code-split and lazy-load
const importFelfedezesMenu = () => import('./FelfedezesMenu')
const FelfedezesMenu = dynamic(importFelfedezesMenu, {
  ssr: false,
  loading: () => <div className="p-6 animate-pulse bg-white" />,
}) as any

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [isFelfedesOpen, setIsFelfedesOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)

  // Auth store
  const { isAuthenticated, user, isLoading } = useAuthStore()
  const logout = useLogout()

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

  const initials = getInitials()

  // Get role display text in Hungarian
  const getRoleDisplay = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'ADMIN'
      case 'INSTRUCTOR':
        return 'OKTATÓ'
      case 'STUDENT':
        return 'TANULÓ'
      default:
        return role
    }
  }

  const handleFelfedesClick = () => {
    setIsFelfedesOpen(!isFelfedesOpen)
    setIsVisible(!isFelfedesOpen)
  }

  const handleCloseFelfedes = () => {
    setIsFelfedesOpen(false)
  }

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isFelfedesOpen) {
        setIsFelfedesOpen(false)
      }
    }
    
    if (isFelfedesOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    document.addEventListener('keydown', handleEscape)
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isFelfedesOpen])

  return (
    <>
      <header className="fixed top-4 left-1/2 -translate-x-1/2 w-[96%] md:w-[92%] lg:w-[85%] bg-white/80 backdrop-blur-md border border-gray-200 drop-shadow-lg rounded-full z-50">
        <div className="max-w-7xl mx-auto px-8 sm:px-10 lg:px-16 py-5">
          <div className="flex items-center justify-between">
            {/* Logo & Discovery */}
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <Image src="/images/navbar-logo.png" alt="Elira logo" width={40} height={40} style={{ width: 'auto', height: '40px' }} />
              </Link>
            </div>
            {/* Navigation Links */}
            <nav className="hidden md:flex space-x-12 lg:space-x-16 items-center">
              <div className="relative">
                <button
                  onClick={handleFelfedesClick}
                  className="flex items-center space-x-3 text-lg font-medium text-gray-800 hover:text-primary transition-colors duration-200"
                  aria-haspopup="true"
                  aria-expanded={isFelfedesOpen}
                >
                  <Search className="w-6 h-6" />
                  <span>Felfedezés</span>
                  <ChevronDown className="w-6 h-6" />
                </button>
              </div>
              <Link href="/courses" className="flex items-center space-x-3 text-lg font-medium text-gray-800 hover:text-primary transition-colors duration-200">
                <BookOpen className="w-6 h-6" />
                <span>Kurzusok</span>
              </Link>
              <Link href="/career-paths" className="flex items-center space-x-3 text-lg font-medium text-gray-800 hover:text-primary transition-colors duration-200">
                <TrendingUp className="w-6 h-6" />
                <span>Karrierutak</span>
              </Link>
              <Link href="/trending" className="flex items-center space-x-3 text-lg font-medium text-gray-800 hover:text-primary transition-colors duration-200">
                <BarChart2 className="w-6 h-6" />
                <span>Trending</span>
                <span className="bg-orange-500 text-white text-sm font-semibold px-3 py-1.5 rounded-full ml-2">Új</span>
              </Link>
            </nav>
            {/* Right Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {isLoading ? null : isAuthenticated && user ? (
                <div className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)} className="focus:outline-none group">
                    <Avatar className="h-12 w-12 transition-shadow group-hover:ring-2 group-hover:ring-primary/60 group-hover:ring-offset-2">
                      {user.profilePictureUrl ? (
                        <AvatarImage src={user.profilePictureUrl} alt={user.firstName} />
                      ) : (
                        <AvatarFallback>{initials}</AvatarFallback>
                      )}
                    </Avatar>
                  </button>
                  {profileOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl z-50 border border-gray-100 overflow-hidden">
                      {/* Header */}
                      <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user.firstName} {user.lastName}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                        <span className="mt-1 inline-block text-xs font-semibold px-2 py-0.5 rounded bg-primary/10 text-primary">{getRoleDisplay(user.role)}</span>
                      </div>
                      <div className="py-1">
                        <Link href={user.role === 'INSTRUCTOR' ? '/instructor/dashboard' : user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} className="block px-4 py-2 text-sm hover:bg-gray-100">
                          Irányítópult
                        </Link>
                        {user.role === 'ADMIN' && (
                          <>
                            <Link href="/admin" className="block px-4 py-2 text-sm hover:bg-gray-100">Admin Felület</Link>
                          </>
                        )}
                        <Link href="/account" className="block px-4 py-2 text-sm hover:bg-gray-100">
                          Fiókom
                        </Link>
                      </div>
                      <button onClick={logout} className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100 border-t border-gray-100">
                        Kijelentkezés
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <Link href="/login" className="text-lg font-semibold text-gray-800 hover:text-primary transition-colors duration-200 px-3">
                    Bejelentkezés
                  </Link>
                  <Link
                    href="/register"
                    className="text-lg font-semibold bg-primary text-white px-8 py-4 rounded-full hover:bg-primary/90 transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Regisztráció
                  </Link>
                </>
              )}
            </div>
            {/* Mobile menu button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 top-0 z-50 bg-white">
          <div className="h-full flex flex-col">
            {/* Header with close button */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-2xl font-bold text-gray-900">Menü</h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>
            {/* Mobile menu content */}
            <div className="flex-1 overflow-y-auto">
              <div className="px-4 py-4">
                {/* Mobile 'Felfedezés' toggle (prefetch on click) */}
                <button
                  onClick={() => { importFelfedezesMenu(); setIsFelfedesOpen(!isFelfedesOpen); }}
                  aria-expanded={isFelfedesOpen}
                  aria-controls="felfedezes-panel"
                  className="w-full flex items-center justify-between space-x-2 text-sm font-medium text-gray-800 px-4 py-2 hover:bg-gray-100 rounded"
                >
                  <div className="flex items-center space-x-2">
                    <Search className="w-4 h-4" />
                    <span>Felfedezés</span>
                  </div>
                  {isFelfedesOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {isFelfedesOpen && (
                  <div id="felfedezes-panel" className="mt-2">
                    <FelfedezesMenu />
                  </div>
                )}
                {/* Static mobile nav links */}
                <Link href="/courses" className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 rounded">
                  Kurzusok
                </Link>
                <Link href="/career-paths" className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 rounded">
                  Karrierutak
                </Link>
                <Link href="/trending" className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 rounded">
                  Trending
                </Link>
                <Link href="/universities" className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 rounded">
                  Egyetemek
                </Link>
                {isAuthenticated && user ? (
                  <>
                    <Link href={user.role === 'INSTRUCTOR' ? '/instructor/dashboard' : user.role === 'ADMIN' ? '/admin/dashboard' : '/dashboard'} className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 rounded">
                      Irányítópult
                    </Link>
                    {user.role === 'ADMIN' && (
                      <Link href="/admin" className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 rounded">
                        Admin Felület
                      </Link>
                    )}
                    <Link href="/account" className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 rounded">
                      Fiókom
                    </Link>
                    <button onClick={logout} className="w-full text-left px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 rounded">
                      Kijelentkezés
                    </button>
                  </>
                ) : (
                  <>
                    <Link href="/login" className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 rounded">
                      Bejelentkezés
                    </Link>
                    <Link href="/register" className="block px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100 rounded">
                      Regisztráció
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Felfedezés Modal */}
      {isFelfedesOpen && (
        <div className="fixed inset-0 z-[99999] transition-all duration-300 ease-out">
          <FelfedezesMenu onClose={handleCloseFelfedes} />
        </div>
      )}
    </>
  )
} 