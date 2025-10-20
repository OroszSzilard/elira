'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, Target, BookOpen, Users, Star, ArrowRight, Briefcase, GraduationCap } from 'lucide-react'

/**
 * Career Development Dashboard
 * 
 * Career exploration, skill gap analysis, and personalized career path recommendations
 */

export default function CareerPage() {
  // Mock career data - will be replaced with real career analysis
  const careerPaths = [
    {
      id: '1',
      title: 'Full Stack Web Developer',
      match: 85,
      salaryRange: '800,000 - 1,500,000 Ft',
      skillsNeeded: ['React', 'Node.js', 'Database Design', 'DevOps'],
      coursesAvailable: 12,
      timeToComplete: '6-8 hónap'
    },
    {
      id: '2',
      title: 'Digital Marketing Manager',
      match: 72,
      salaryRange: '600,000 - 1,200,000 Ft',
      skillsNeeded: ['SEO', 'Google Analytics', 'Content Strategy', 'PPC'],
      coursesAvailable: 8,
      timeToComplete: '4-6 hónap'
    },
    {
      id: '3',
      title: 'Data Scientist',
      match: 68,
      salaryRange: '1,000,000 - 2,000,000 Ft',
      skillsNeeded: ['Python', 'Machine Learning', 'Statistics', 'SQL'],
      coursesAvailable: 15,
      timeToComplete: '8-12 hónap'
    }
  ]

  const skillGaps = [
    { skill: 'React Advanced Patterns', progress: 60, priority: 'high' },
    { skill: 'Node.js & Express', progress: 30, priority: 'high' },
    { skill: 'Database Design', progress: 45, priority: 'medium' },
    { skill: 'DevOps & Deployment', progress: 20, priority: 'medium' }
  ]

  const industryTrends = [
    {
      trend: 'AI és Machine Learning integráció',
      growth: '+45%',
      description: 'Növekvő kereslet AI-képes fejlesztők iránt'
    },
    {
      trend: 'Remote munkalehetőségek',
      growth: '+120%',
      description: 'Távmunka lehetőségek dominálják a piacot'
    },
    {
      trend: 'Full Stack fejlesztők',
      growth: '+35%',
      description: 'Univerzális képességek egyre értékesebbek'
    }
  ]

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Karrier Fejlesztés</h1>
            <p className="text-gray-600 mt-1">
              Fedezze fel karrierlehetőségeit és tervezze meg fejlődési útját
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <TrendingUp className="w-8 h-8 text-teal-600" />
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">85%</div>
              <div className="text-sm text-gray-600">Karrier illeszkedés</div>
            </div>
          </div>
        </div>

        {/* Career Path Recommendations */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Ajánlott Karrierutak</h2>
            <Badge className="bg-teal-100 text-teal-700">
              Személyre szabott
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {careerPaths.map((path) => (
              <Card key={path.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg text-gray-900 mb-2">
                        {path.title}
                      </CardTitle>
                      <div className="flex items-center space-x-2">
                        <div className="text-2xl font-bold text-teal-600">{path.match}%</div>
                        <span className="text-sm text-gray-600">illeszkedés</span>
                      </div>
                    </div>
                    <Briefcase className="w-8 h-8 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Fizetési sáv:</span>
                      <span className="font-medium text-gray-900">{path.salaryRange}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Időtartam:</span>
                      <span className="font-medium text-gray-900">{path.timeToComplete}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Elérhető kurzusok:</span>
                      <span className="font-medium text-gray-900">{path.coursesAvailable} kurzus</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Szükséges készségek:</h4>
                    <div className="flex flex-wrap gap-2">
                      {path.skillsNeeded.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-teal-600 hover:bg-teal-700">
                    <Target className="w-4 h-4 mr-2" />
                    Karrierút indítása
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Skill Gap Analysis */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Készség Hiány Elemzés</h2>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="w-5 h-5 mr-2 text-teal-600" />
                Fejlesztendő Területek
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {skillGaps.map((gap) => (
                <div key={gap.skill} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-gray-900">{gap.skill}</span>
                      <Badge 
                        className={
                          gap.priority === 'high' 
                            ? 'bg-red-100 text-red-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }
                      >
                        {gap.priority === 'high' ? 'Magas prioritás' : 'Közepes prioritás'}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-600">{gap.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-teal-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${gap.progress}%` }}
                    />
                  </div>
                </div>
              ))}
              <div className="pt-4">
                <Button variant="outline" className="w-full">
                  <BookOpen className="w-4 h-4 mr-2" />
                  Személyre szabott tanulási terv készítése
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Industry Trends */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Iparági Trendek</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {industryTrends.map((trend, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <TrendingUp className="w-6 h-6 text-green-600" />
                    <Badge className="bg-green-100 text-green-700">
                      {trend.growth}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{trend.trend}</h3>
                  <p className="text-sm text-gray-600">{trend.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-teal-500 to-cyan-600 text-white">
          <CardContent className="p-8 text-center">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl font-bold mb-3">Kezdje el karrierfejlesztését ma!</h2>
            <p className="text-teal-100 mb-6 max-w-2xl mx-auto">
              Személyre szabott tanulási tervvel és szakértői támogatással érje el karriercéljait. 
              Csatlakozzon több ezer sikeres tanulóhoz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-teal-600 hover:bg-gray-100">
                <Target className="w-5 h-5 mr-2" />
                Karrierterv készítése
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <Users className="w-5 h-5 mr-2" />
                Szakértői konzultáció
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}