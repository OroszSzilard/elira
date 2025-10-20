'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { db } from '@/lib/firebase'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { 
  BookOpen, 
  Clock, 
  Star, 
  Search,
  Filter,
  Play,
  GraduationCap
} from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string
  instructorName?: string
  category: string
  level: string
  duration: string
  rating?: number
  students?: number
  enrollmentCount?: number
  price: number
  imageUrl?: string
  lessons?: number
  createdAt?: any
  tags?: string[]
}

export default function CourseListPage() {
  const router = useRouter()
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [searchInput, setSearchInput] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedPrice, setSelectedPrice] = useState('all')
  const [categories, setCategories] = useState<string[]>(['all'])

  // Fetch all courses from Firestore
  useEffect(() => {
    const coursesQuery = query(
      collection(db, 'courses'),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(coursesQuery, (snapshot) => {
      const coursesData: Course[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Course[]
      
      setCourses(coursesData)
      setFilteredCourses(coursesData)
      
      // Extract unique categories
      const uniqueCategories = new Set<string>(['all'])
      coursesData.forEach(course => {
        if (course.category) {
          uniqueCategories.add(course.category)
        }
      })
      setCategories(Array.from(uniqueCategories))
      
      setLoading(false)
    }, (error) => {
      console.error('Error fetching courses:', error)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  // Filter courses
  useEffect(() => {
    let filtered = courses

    // Search filter
    if (searchInput) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(searchInput.toLowerCase()) ||
        course.description?.toLowerCase().includes(searchInput.toLowerCase()) ||
        course.tags?.some(tag => tag.toLowerCase().includes(searchInput.toLowerCase()))
      )
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(course => course.category === selectedCategory)
    }

    // Level filter
    if (selectedLevel !== 'all') {
      filtered = filtered.filter(course => 
        course.level?.toLowerCase() === selectedLevel.toLowerCase()
      )
    }

    // Price filter
    if (selectedPrice === 'free') {
      filtered = filtered.filter(course => course.price === 0)
    } else if (selectedPrice === 'paid') {
      filtered = filtered.filter(course => course.price > 0)
    }

    setFilteredCourses(filtered)
  }, [searchInput, selectedCategory, selectedLevel, selectedPrice, courses])

  const getLevelBadgeColor = (level: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner':
      case 'kezdő':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'intermediate':
      case 'középhaladó':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
      case 'advanced':
      case 'haladó':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-16">
        <div className="container">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Kurzusok betöltése...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 py-16">
        <div className="container">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Kurzus Katalógus
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-8">
              Fedezd fel összes kurzusunkat és találd meg a számodra legmegfelelőbbet
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  type="search"
                  placeholder="Keress kurzusok között..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10 h-12 text-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 py-4">
        <div className="container">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-600" />
                <span className="font-semibold text-gray-900 dark:text-white">{courses.length}</span>
                <span className="text-gray-600 dark:text-gray-400">kurzus</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-teal-600" />
                <span className="font-semibold text-gray-900 dark:text-white">
                  {courses.filter(c => c.price === 0).length}
                </span>
                <span className="text-gray-600 dark:text-gray-400">ingyenes</span>
              </div>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {filteredCourses.length} találat
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Szűrők
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Kategória
                  </label>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>
                          {cat === 'all' ? 'Összes kategória' : cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Level Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Szint
                  </label>
                  <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Minden szint</SelectItem>
                      <SelectItem value="kezdő">Kezdő</SelectItem>
                      <SelectItem value="középhaladó">Középhaladó</SelectItem>
                      <SelectItem value="haladó">Haladó</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Filter */}
                <div>
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                    Ár
                  </label>
                  <Select value={selectedPrice} onValueChange={setSelectedPrice}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Összes</SelectItem>
                      <SelectItem value="free">Ingyenes</SelectItem>
                      <SelectItem value="paid">Fizetős</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Reset Filters */}
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => {
                    setSelectedCategory('all')
                    setSelectedLevel('all')
                    setSelectedPrice('all')
                    setSearchInput('')
                  }}
                >
                  Szűrők törlése
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Course Grid */}
          <div className="lg:col-span-3">
            {filteredCourses.length === 0 ? (
              <Card className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  Nincs találat
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Próbálj más szűrőket vagy keresési kifejezést használni
                </p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <Card key={course.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                    {/* Course Image */}
                    {course.imageUrl ? (
                      <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative">
                        <img 
                          src={course.imageUrl} 
                          alt={course.title}
                          className="object-cover w-full h-full"
                        />
                        {course.price === 0 && (
                          <Badge className="absolute top-2 left-2 bg-green-600 text-white">
                            INGYENES
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-teal-100 to-blue-100 dark:from-teal-900/30 dark:to-blue-900/30 flex items-center justify-center">
                        <BookOpen className="w-12 h-12 text-teal-600 dark:text-teal-400" />
                      </div>
                    )}
                    
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          {course.category}
                        </Badge>
                        <Badge className={getLevelBadgeColor(course.level)}>
                          {course.level || 'Minden szint'}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {course.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent>
                      {/* Instructor */}
                      {course.instructorName && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                          Oktató: {course.instructorName}
                        </p>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        {course.duration && (
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {course.duration}
                          </span>
                        )}
                        {course.lessons && (
                          <span className="flex items-center gap-1">
                            <BookOpen className="w-4 h-4" />
                            {course.lessons} lecke
                          </span>
                        )}
                        {course.rating && (
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                            {course.rating}
                          </span>
                        )}
                      </div>

                      {/* Price and Action */}
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                          {!course.price || course.price === 0 ? (
                            <span className="text-green-600 dark:text-green-400">Ingyenes</span>
                          ) : (
                            <span>{course.price.toLocaleString()} Ft</span>
                          )}
                        </div>
                        <Button 
                          size="sm"
                          className="gap-2"
                          onClick={() => router.push(`/courses/${course.id}`)}
                        >
                          <Play className="w-4 h-4" />
                          Megtekintés
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}