'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { db } from '@/lib/firebase'
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  FileText, 
  Video, 
  Download, 
  BookOpen, 
  Search,
  Filter,
  Star,
  Clock,
  Users,
  ExternalLink,
  Play,
  Eye,
  DollarSign,
  Tag
} from 'lucide-react'

interface Course {
  id: string
  title: string
  description: string
  category: string
  level: string
  duration: string
  lessons?: number
  students?: number
  rating?: number
  price: number
  imageUrl?: string
  instructorName?: string
  tags?: string[]
  createdAt?: any
}

export default function FreeResourcesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Összes')
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>(['Összes'])
  const router = useRouter()

  // Fetch free courses from Firestore
  useEffect(() => {
    const coursesQuery = query(
      collection(db, 'courses'),
      where('price', '==', 0), // Only free courses
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
      const uniqueCategories = new Set<string>(['Összes'])
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

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    filterCourses(query, selectedCategory)
  }

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    filterCourses(searchQuery, category)
  }

  const filterCourses = (query: string, category: string) => {
    let filtered = courses

    if (query) {
      filtered = filtered.filter(course =>
        course.title.toLowerCase().includes(query.toLowerCase()) ||
        course.description.toLowerCase().includes(query.toLowerCase()) ||
        course.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      )
    }

    if (category !== 'Összes') {
      filtered = filtered.filter(course => course.category === category)
    }

    setFilteredCourses(filtered)
  }

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

  const getCategoryIcon = (category: string) => {
    switch (category?.toLowerCase()) {
      case 'programozás':
      case 'programming':
        return <FileText className="w-5 h-5 text-blue-500" />
      case 'marketing':
        return <Tag className="w-5 h-5 text-purple-500" />
      case 'design':
      case 'dizájn':
        return <Video className="w-5 h-5 text-pink-500" />
      default:
        return <BookOpen className="w-5 h-5 text-teal-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Ingyenes kurzusok betöltése...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Ingyenes Kurzusok
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Válogatott ingyenes kurzusok a tanuláshoz. Kezdd el ingyen!
          </p>
        </div>

        {/* Info Banner */}
        <Card className="mb-8 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 border-teal-200 dark:border-teal-800">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                <BookOpen className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                  Kezdj el tanulni ingyen!
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Ezek a kurzusok teljesen ingyenesek. Regisztrálj és kezdd el a tanulást!
                </p>
              </div>
              <Badge className="bg-teal-600 text-white">
                {filteredCourses.length} ingyenes kurzus
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="search"
                placeholder="Keress az ingyenes kurzusok között..."
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button variant="outline" className="gap-2">
              <Filter className="w-4 h-4" />
              Szűrők
            </Button>
          </div>

          {/* Category Pills */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => handleCategoryChange(category)}
                className="rounded-full"
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-lg transition-shadow overflow-hidden">
              {/* Course Image */}
              {course.imageUrl && (
                <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative">
                  <img 
                    src={course.imageUrl} 
                    alt={course.title}
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-green-600 text-white">
                      INGYENES
                    </Badge>
                  </div>
                </div>
              )}
              
              <CardHeader>
                <div className="flex items-start justify-between mb-2">
                  {getCategoryIcon(course.category)}
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
                {/* Tags */}
                {course.tags && course.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {course.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-4">
                  <div className="flex items-center gap-3">
                    {course.duration && (
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {course.duration}
                      </span>
                    )}
                    {course.lessons && (
                      <span className="flex items-center gap-1">
                        <Video className="w-4 h-4" />
                        {course.lessons} lecke
                      </span>
                    )}
                  </div>
                  {course.rating && (
                    <span className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      {course.rating}
                    </span>
                  )}
                </div>

                {/* Instructor */}
                {course.instructorName && (
                  <p className="text-sm text-gray-500 dark:text-gray-500 mb-4">
                    Oktató: {course.instructorName}
                  </p>
                )}

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    className="flex-1 gap-2" 
                    size="sm"
                    onClick={() => router.push(`/courses/${course.id}`)}
                  >
                    <Play className="w-4 h-4" />
                    Kezdés
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => router.push(`/courses/${course.id}/preview`)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {courses.length === 0 ? 'Nincs még ingyenes kurzus' : 'Nincs találat'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {courses.length === 0 
                ? 'Az adminok még nem hoztak létre ingyenes kurzust.'
                : 'Próbálj meg más keresési feltételeket vagy kategóriát választani.'}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}