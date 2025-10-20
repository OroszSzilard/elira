'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Award, Download, Share2, Calendar, BookOpen, Trophy, Star, ExternalLink } from 'lucide-react'

/**
 * Certificates Dashboard
 * 
 * User achievement showcase with certificates, badges, and learning milestones
 */

export default function CertificatesPage() {
  const [activeTab, setActiveTab] = useState<'certificates' | 'badges' | 'achievements'>('certificates')

  // Mock data - will be replaced with real data
  const certificates = [
    {
      id: '1',
      title: 'Advanced React Development',
      courseTitle: 'Modern React fejlesztés',
      issueDate: '2024-03-15',
      instructorName: 'Dr. Kovács János',
      certificateUrl: '#',
      skills: ['React', 'Redux', 'TypeScript', 'Testing']
    },
    {
      id: '2', 
      title: 'Digital Marketing Fundamentals',
      courseTitle: 'Digitális marketing alapok',
      issueDate: '2024-02-28',
      instructorName: 'Nagy Éva',
      certificateUrl: '#',
      skills: ['SEO', 'Social Media', 'Analytics', 'Content Marketing']
    }
  ]

  const badges = [
    { id: '1', name: 'Early Adopter', icon: '🌟', description: 'Az első 100 felhasználó egyike' },
    { id: '2', name: 'Course Completor', icon: '🎯', description: '10 kurzus sikeresen befejezve' },
    { id: '3', name: 'Quiz Master', icon: '🧠', description: '50 kvíz 90% feletti eredménnyel' },
    { id: '4', name: 'Consistent Learner', icon: '📚', description: '30 napos tanulási sorozat' }
  ]

  const achievements = [
    { id: '1', title: 'Első kurzus befejezése', date: '2024-01-15', points: 100 },
    { id: '2', title: '5 órás tanulási maraton', date: '2024-02-10', points: 250 },
    { id: '3', title: 'Tökéletes kvíz eredmény', date: '2024-03-01', points: 150 },
    { id: '4', title: '1 hónapos tanulási sorozat', date: '2024-03-15', points: 500 }
  ]

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Képesítések és Eredmények</h1>
            <p className="text-gray-600 mt-1">
              Tekintse meg tanúsítványait, jelvényeit és tanulási eredményeit
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900">2,150</div>
              <div className="text-sm text-gray-600">Összpontszám</div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
          {[
            { key: 'certificates', label: 'Tanúsítványok', icon: Award },
            { key: 'badges', label: 'Jelvények', icon: Star },
            { key: 'achievements', label: 'Eredmények', icon: Trophy }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === key
                  ? 'bg-white text-teal-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {label}
            </button>
          ))}
        </div>

        {/* Certificates Tab */}
        {activeTab === 'certificates' && (
          <div className="space-y-6">
            {certificates.length === 0 ? (
              <Card className="p-12 text-center">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Még nincsenek tanúsítványai
                </h3>
                <p className="text-gray-600 mb-6">
                  Fejezzen be kurzusokat, hogy megszerezze első tanúsítványát
                </p>
                <Button>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Kurzusok böngészése
                </Button>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {certificates.map((cert) => (
                  <Card key={cert.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg text-gray-900 mb-1">
                            {cert.title}
                          </CardTitle>
                          <p className="text-sm text-gray-600">{cert.courseTitle}</p>
                        </div>
                        <Award className="w-8 h-8 text-yellow-500 flex-shrink-0" />
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0 space-y-4">
                      <div className="flex items-center justify-between text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {new Date(cert.issueDate).toLocaleDateString('hu-HU')}
                        </div>
                        <span>Oktató: {cert.instructorName}</span>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {cert.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button size="sm" className="flex-1">
                          <Download className="w-4 h-4 mr-2" />
                          Letöltés
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="w-4 h-4 mr-2" />
                          Megosztás
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Megtekintés
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Badges Tab */}
        {activeTab === 'badges' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {badges.map((badge) => (
              <Card key={badge.id} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="text-4xl mb-3">{badge.icon}</div>
                  <h3 className="font-semibold text-gray-900 mb-2">{badge.name}</h3>
                  <p className="text-sm text-gray-600">{badge.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Achievements Tab */}
        {activeTab === 'achievements' && (
          <div className="space-y-4">
            {achievements.map((achievement) => (
              <Card key={achievement.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center">
                        <Trophy className="w-5 h-5 text-teal-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{achievement.title}</h3>
                        <p className="text-sm text-gray-600">
                          {new Date(achievement.date).toLocaleDateString('hu-HU')}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      +{achievement.points} pont
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}