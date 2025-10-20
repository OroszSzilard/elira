"use client"
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Container } from '@/components/layout/container'
import { Button } from '@/components/ui/button'
// import { Card } from '@/components/ui/card'  // removed for custom design
import { Briefcase, TrendingUp, Sparkles, BookOpen } from 'lucide-react'

export const RoleSelector: React.FC = () => {
  const router = useRouter()
  
  // Sample filter options
  const experienceLevels = ['Kezdő', 'Középhaladó', 'Haladó']
  const categories = ['Népszerű', 'Szoftverfejlesztés és IT', 'Üzlet', 'Értékesítés és marketing', 'Adattudomány és analitika', 'Egészségügy']
  const roles = [
    {
      id: 'career',
      title: 'Karrierem fejlesztése',
      description: 'Előléptetés, új munkahely, fizetésemelés',
      details: 'Szerezze meg a készségeket, amelyek biztosítják karrierje következő lépését.',
      icon: '💼',
      color: 'from-blue-600 to-blue-700',
      route: '/career-paths'
    },
    {
      id: 'business',
      title: 'Üzleti sikereim fokozása',
      description: 'Meglévő vállalkozás fejlesztése, új vállalkozás indítása, műveletek javítása',
      details: 'Növelje bevételeit és optimalizálja üzleti folyamatait szakértői tudással.',
      icon: '📈',
      color: 'from-green-600 to-green-700',
      route: '/courses?category=business'
    },
    {
      id: 'skills',
      title: 'Új készségek elsajátítása',
      description: 'Technológia, kreatív, elemzői készségek',
      details: 'Sajátítsa el a jövő készségeit, amelyek minden iparágban értékesek.',
      icon: '🎯',
      color: 'from-purple-600 to-purple-700',
      route: '/courses?category=tech'
    }
  ]

  const handleRoleClick = (route: string) => {
    router.push(route)
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header - Centered */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Mi a célja?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Válassza ki a tanulási útvonalat, amely a legjobban illeszkedik céljaihoz
          </p>
        </div>
        {/* Three-Card Grid with curved hero headers */}
        <div className="grid md:grid-cols-3 gap-8">
          {roles.map(role => (
            <div
              key={role.id}
              className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-xl transition-all cursor-pointer bg-white dark:bg-gray-800 flex flex-col"
            >
              {/* Hero section with gradient and curved bottom */}
              <div
                className={`relative h-48 bg-gradient-to-r ${role.color} clip-path-curved`}
              >
                <span className="text-6xl absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  {role.icon}
                </span>
              </div>
              {/* Card Content */}
              <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{role.title}</h3>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-6">{role.description}</p>
                <Button 
                  onClick={() => handleRoleClick(role.route)}
                  variant="default"
                  className="mt-auto self-start"
                >
                  Tovább
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
} 