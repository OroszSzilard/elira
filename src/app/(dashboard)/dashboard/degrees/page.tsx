'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { GraduationCap, Clock, Users, Star, MapPin, Award, BookOpen, ExternalLink } from 'lucide-react'

/**
 * University Degrees Dashboard
 * 
 * Online degree programs, university partnerships, and accredited learning paths
 */

export default function DegreesPage() {
  // Mock degree programs data - will be replaced with real university partnerships
  const degreePrograms = [
    {
      id: '1',
      title: 'Bachelor of Science in Computer Science',
      university: 'Budapest University of Technology',
      duration: '8 félév',
      format: 'Online + Hibrid',
      price: '1,200,000 Ft/félév',
      rating: 4.8,
      studentsEnrolled: 234,
      accreditation: 'MAB akkreditált',
      description: 'Teljes körű informatikai alapképzés modern technológiákkal és gyakorlati projektekkel.',
      subjects: ['Programozás', 'Algoritmusok', 'Adatbázisok', 'Hálózatok', 'Mesterséges Intelligencia'],
      startDate: '2024 szept.',
      applicationDeadline: '2024. augusztus 15.'
    },
    {
      id: '2',
      title: 'Master of Business Administration (MBA)',
      university: 'Corvinus University of Budapest',
      duration: '4 félév',
      format: 'Executive Online',
      price: '2,800,000 Ft/félév',
      rating: 4.9,
      studentsEnrolled: 156,
      accreditation: 'AACSB akkreditált',
      description: 'Vezetői kompetenciák fejlesztése digitális korszakban dolgozó szakemberek számára.',
      subjects: ['Stratégiai Menedzsment', 'Digitális Transzformáció', 'Pénzügyek', 'Marketing', 'Vezetés'],
      startDate: '2024 okt.',
      applicationDeadline: '2024. szeptember 1.'
    },
    {
      id: '3',
      title: 'Master of Science in Data Science',
      university: 'ELTE Eötvös Loránd University',
      duration: '4 félév',
      format: 'Online',
      price: '1,800,000 Ft/félév',
      rating: 4.7,
      studentsEnrolled: 189,
      accreditation: 'EU akkreditált',
      description: 'Adattudományi mesterfokozat big data, gépi tanulás és üzleti analitika specializációval.',
      subjects: ['Machine Learning', 'Deep Learning', 'Big Data', 'Statistics', 'Business Analytics'],
      startDate: '2025 febr.',
      applicationDeadline: '2024. december 15.'
    }
  ]

  const benefits = [
    {
      icon: <GraduationCap className="w-8 h-8 text-blue-600" />,
      title: 'Akkreditált Diplomák',
      description: 'Államilag elismert, nemzetközileg akkreditált diplomák'
    },
    {
      icon: <Clock className="w-8 h-8 text-green-600" />,
      title: 'Rugalmas Ütemezés',
      description: 'Online és hibrid formátumok munkával összeegyeztethető időbeosztással'
    },
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: 'Szakértői Oktatók',
      description: 'Egyetemi professzorok és iparági szakértők oktatják a kurzusokat'
    },
    {
      icon: <Award className="w-8 h-8 text-yellow-600" />,
      title: 'Karrier Támogatás',
      description: 'Karriertanácsadás, állásközvetítés és alumni network hozzáférés'
    }
  ]

  const partnerUniversities = [
    { name: 'Budapest University of Technology', programs: 12, ranking: '#1 Magyarországon' },
    { name: 'Corvinus University', programs: 8, ranking: 'Top 5 CEE régióban' },
    { name: 'ELTE Eötvös Loránd University', programs: 15, ranking: 'QS World Ranking Top 500' },
    { name: 'University of Debrecen', programs: 6, ranking: 'Research Excellence' }
  ]

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Online Diplomák</h1>
            <p className="text-gray-600 mt-1">
              Szerezzen akkreditált diplomát vezető egyetemek partnerprogramjaiban
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">25+</div>
            <div className="text-sm text-gray-600">Diploma program</div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((benefit, index) => (
            <Card key={index} className="text-center hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Featured Programs */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Kiemelt Diploma Programok</h2>
          
          <div className="space-y-6">
            {degreePrograms.map((program) => (
              <Card key={program.id} className="hover:shadow-lg transition-all duration-200">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-gray-900 mb-2">
                        {program.title}
                      </CardTitle>
                      <div className="flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {program.university}
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {program.duration}
                        </div>
                        <div className="flex items-center">
                          <Star className="w-4 h-4 mr-1 text-yellow-500" />
                          {program.rating}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-teal-600">{program.price}</div>
                      <Badge className="mt-1 bg-green-100 text-green-700">
                        {program.accreditation}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{program.description}</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Fő tantárgyak:</h4>
                      <div className="flex flex-wrap gap-2">
                        {program.subjects.map((subject) => (
                          <Badge key={subject} variant="outline" className="text-xs">
                            {subject}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Formátum:</span>
                        <span className="font-medium">{program.format}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Kezdés:</span>
                        <span className="font-medium">{program.startDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Jelentkezési határidő:</span>
                        <span className="font-medium text-red-600">{program.applicationDeadline}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Beiratkozott hallgatók:</span>
                        <span className="font-medium">{program.studentsEnrolled} fő</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <Button className="flex-1 bg-teal-600 hover:bg-teal-700">
                      <BookOpen className="w-4 h-4 mr-2" />
                      Jelentkezés indítása
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Program részletei
                    </Button>
                    <Button variant="outline">
                      Tanulmányi tájékoztató
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Partner Universities */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Partner Egyetemek</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {partnerUniversities.map((university, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <GraduationCap className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{university.name}</h3>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>{university.programs} program</p>
                    <Badge variant="outline" className="text-xs">
                      {university.ranking}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
          <CardContent className="p-8 text-center">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-90" />
            <h2 className="text-2xl font-bold mb-3">Készen áll a következő lépésre?</h2>
            <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
              Ingyenes konzultáció során szakértőink segítenek kiválasztani a legmegfelelőbb diploma programot 
              karriercéljai és élethelyzete alapján.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Users className="w-5 h-5 mr-2" />
                Ingyenes konzultáció
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <BookOpen className="w-5 h-5 mr-2" />
                Programok böngészése
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Application Process */}
        <Card>
          <CardHeader>
            <CardTitle>Hogyan jelentkezzen?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { step: '1', title: 'Konzultáció', desc: 'Ingyenes tanácsadás programválasztáshoz' },
                { step: '2', title: 'Jelentkezés', desc: 'Online jelentkezési űrlap kitöltése' },
                { step: '3', title: 'Értékelés', desc: 'Előzetes tanulmányok elismerése' },
                { step: '4', title: 'Beiratkozás', desc: 'Sikeres felvétel után tanulmányok kezdése' }
              ].map((item) => (
                <div key={item.step} className="text-center">
                  <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-3">
                    {item.step}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}