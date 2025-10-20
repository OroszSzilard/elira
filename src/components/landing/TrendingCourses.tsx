'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  TrendingUp, 
  Star, 
  Users, 
  Clock, 
  Play, 
  ArrowRight,
  Flame,
  BookOpen
} from 'lucide-react'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore'

interface Course {
  id: string
  title: string
  instructorName?: string
  category: string
  level: string
  duration: string
  rating?: number
  students?: number
  enrollmentCount?: number
  price: number
  imageUrl?: string
}

export function TrendingCourses() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch top courses ordered by enrollment count or creation date
    const coursesQuery = query(
      collection(db, 'courses'),
      orderBy('enrollmentCount', 'desc'), // Order by popularity
      limit(4)
    )

    const unsubscribe = onSnapshot(coursesQuery, 
      (snapshot) => {
        const coursesData: Course[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Course[]
        
        setCourses(coursesData)
        setLoading(false)
      },
      (error) => {
        console.log('Trying alternative query without enrollmentCount...')
        // If enrollmentCount doesn't exist, try ordering by createdAt
        const altQuery = query(
          collection(db, 'courses'),
          orderBy('createdAt', 'desc'),
          limit(4)
        )
        
        const altUnsubscribe = onSnapshot(altQuery, (snapshot) => {
          const coursesData: Course[] = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Course[]
          
          setCourses(coursesData)
          setLoading(false)
        })
        
        return () => altUnsubscribe()
      }
    )

    return () => unsubscribe()
  }, [])

  const getLevelBadgeVariant = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'kezdő':
      case 'beginner':
        return 'secondary'
      case 'középhaladó':
      case 'intermediate':
        return 'default'
      case 'haladó':
      case 'advanced':
        return 'destructive'
      default:
        return 'outline'
    }
  }

  if (loading) {
    return (
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
              <TrendingUp className="w-4 h-4" />
              TRENDING MOST
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Népszerű Kurzusok
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Betöltés...
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 px-3 py-1 rounded-full text-sm font-medium mb-4">
            <TrendingUp className="w-4 h-4" />
            TRENDING MOST
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Népszerű Kurzusok
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A legtöbbet választott kurzusaink, amelyekkel garantáltan fejlődhetsz
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">
              Még nincsenek kurzusok. Az adminok hamarosan létrehoznak párat!
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {courses.map((course, index) => (
                <Card key={course.id} className="group hover:shadow-xl transition-all duration-300 overflow-hidden">
                  <div className="relative">
                    {course.imageUrl ? (
                      <div className="aspect-video bg-gray-100 dark:bg-gray-800">
                        <img 
                          src={course.imageUrl} 
                          alt={course.title}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-primary/40" />
                      </div>
                    )}
                    {index < 2 && (
                      <Badge className="absolute top-2 left-2 bg-red-500 text-white gap-1">
                        <Flame className="w-3 h-3" />
                        HOT
                      </Badge>
                    )}
                    <Badge variant={getLevelBadgeVariant(course.level)} className="absolute top-2 right-2">
                      {course.level || 'Minden szint'}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="mb-2">
                      <Badge variant="outline" className="text-xs">
                        {course.category}
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      {course.instructorName || 'ELIRA Oktató'}
                    </p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration || 'N/A'}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {course.enrollmentCount || course.students || 0}
                      </span>
                      {course.rating && (
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {course.rating}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {course.price === 0 ? (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Ingyenes
                          </Badge>
                        ) : (
                          `${course.price.toLocaleString()} Ft`
                        )}
                      </div>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        className="gap-1 group-hover:text-primary"
                        asChild
                      >
                        <Link href={`/courses/${course.id}`}>
                          <Play className="w-4 h-4" />
                          Kezdés
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button size="lg" className="gap-2" asChild>
                <Link href="/courses">
                  Összes kurzus megtekintése
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}