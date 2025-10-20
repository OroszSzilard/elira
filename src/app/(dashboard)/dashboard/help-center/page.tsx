'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'
import { db } from '@/lib/firebase'
import { collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, doc, updateDoc, arrayUnion } from 'firebase/firestore'
import { 
  HelpCircle,
  MessageSquare,
  Send,
  Clock,
  CheckCircle,
  AlertCircle,
  Phone,
  Mail,
  ChevronRight,
  ChevronLeft,
  Search,
  BookOpen,
  FileQuestion,
  Zap,
  Shield,
  CreditCard,
  Users,
  Settings,
  Video,
  Star,
  User,
  XCircle
} from 'lucide-react'

// Helper function to get category name
const getCategoryName = (category: string) => {
  switch (category) {
    case 'technical': return 'Technikai'
    case 'payment': return 'Számlázás'
    case 'course': return 'Kurzus'
    case 'account': return 'Fiók'
    case 'general': return 'Általános'
    default: return 'Egyéb'
  }
}

// Mock FAQ adatok
const faqCategories = [
  {
    id: 'getting-started',
    title: 'Első lépések',
    icon: BookOpen,
    questions: [
      {
        q: 'Hogyan regisztrálhatok az ELIRA platformra?',
        a: 'A regisztráció egyszerű! Kattints a "Regisztráció" gombra a főoldalon, add meg az email címed és jelszavad, majd erősítsd meg az email címed.'
      },
      {
        q: 'Milyen kurzusokhoz férhetek hozzá ingyen?',
        a: 'Számos ingyenes kurzust és tananyagot találsz az "Ingyenes anyagok" menüpontban. Ezek regisztráció után azonnal elérhetők.'
      },
      {
        q: 'Hogyan találom meg a számomra megfelelő kurzust?',
        a: 'Használd a keresőt, szűrj kategória, szint vagy ár alapján. A "Karrierutak" menüpont segít a célodnak megfelelő kurzusok kiválasztásában.'
      }
    ]
  },
  {
    id: 'payments',
    title: 'Fizetés és számlázás',
    icon: CreditCard,
    questions: [
      {
        q: 'Milyen fizetési módok érhetők el?',
        a: 'Elfogadunk bankkártyás fizetést (Visa, Mastercard), PayPal-t, és banki átutalást is.'
      },
      {
        q: 'Hogyan tölthetem le a számlámat?',
        a: 'A "Számlák" menüpontban megtalálod az összes korábbi vásárlásod számláját PDF formátumban.'
      },
      {
        q: 'Van-e visszatérítési garancia?',
        a: 'Igen! 30 napos pénzvisszafizetési garanciát vállalunk minden fizetős kurzusra.'
      }
    ]
  },
  {
    id: 'technical',
    title: 'Technikai problémák',
    icon: Settings,
    questions: [
      {
        q: 'Nem tudok bejelentkezni, mit tegyek?',
        a: 'Ellenőrizd az email címed és jelszavad. Ha elfelejtetted a jelszavad, használd az "Elfelejtett jelszó" funkciót.'
      },
      {
        q: 'A videók nem játszódnak le megfelelően',
        a: 'Ellenőrizd az internetkapcsolatod, próbáld meg frissíteni a böngésződ, vagy váltsd át a videó minőségét alacsonyabbra.'
      },
      {
        q: 'Milyen böngészőket támogat a platform?',
        a: 'Chrome, Firefox, Safari és Edge legújabb verzióit támogatjuk. Mobilon iOS 12+ és Android 8+ verziókat.'
      }
    ]
  },
  {
    id: 'certificates',
    title: 'Tanúsítványok',
    icon: Shield,
    questions: [
      {
        q: 'Hogyan kapom meg a tanúsítványomat?',
        a: 'A kurzus sikeres befejezése után automatikusan generálódik a tanúsítványod, amit a "Tanúsítványaim" menüpontban találsz.'
      },
      {
        q: 'Elismerik-e a tanúsítványokat a munkaadók?',
        a: 'Igen! Partnereink között számos nagyvállalat és egyetem van, akik elismerik tanúsítványainkat.'
      },
      {
        q: 'Hogyan oszthatom meg a LinkedIn-en?',
        a: 'Minden tanúsítványnál találsz egy "Megosztás LinkedIn-en" gombot, ami automatikusan hozzáadja a profilodhoz.'
      }
    ]
  }
]

// Removed mock tickets - will use real Firestore data

export default function HelpCenterPage() {
  const { user } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('getting-started')
  const [userTickets, setUserTickets] = useState<any[]>([])
  const [selectedTicket, setSelectedTicket] = useState<any>(null)
  const [replyMessage, setReplyMessage] = useState('')
  const [rating, setRating] = useState(0)
  const [ticketForm, setTicketForm] = useState({
    subject: '',
    category: '',
    priority: 'normal',
    message: ''
  })
  
  // Load user's tickets from Firestore
  useEffect(() => {
    if (!user?.uid) return
    
    const q = query(
      collection(db, 'supportTickets'),
      where('userId', '==', user.uid),
      orderBy('createdAt', 'desc')
    )
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tickets = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      setUserTickets(tickets)
    })
    
    return () => unsubscribe()
  }, [user])

  const handleSubmitTicket = async () => {
    if (!ticketForm.subject || !ticketForm.category || !ticketForm.message) {
      toast.error('Kérjük töltsd ki az összes kötelező mezőt!')
      return
    }
    
    if (!user) {
      toast.error('Kérjük jelentkezz be!')
      return
    }
    
    try {
      // Save ticket to Firestore
      const ticketRef = await addDoc(collection(db, 'supportTickets'), {
        userId: user.uid,
        userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email,
        userEmail: user.email,
        subject: ticketForm.subject,
        category: ticketForm.category,
        priority: ticketForm.priority,
        status: 'open',
        message: ticketForm.message,
        responses: [],
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      
      // Create audit log entry
      await addDoc(collection(db, 'auditLogs'), {
        userId: user.uid,
        userEmail: user.email || '',
        userName: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Unknown User',
        action: 'CREATE_TICKET',
        resource: 'SupportTicket',
        resourceId: ticketRef.id,
        details: JSON.stringify({
          subject: ticketForm.subject,
          category: getCategoryName(ticketForm.category),
          priority: ticketForm.priority
        }),
        severity: 'LOW',
        ipAddress: 'N/A',
        userAgent: 'N/A',
        createdAt: new Date()
      })
      
      toast.success('Támogatási jegyed sikeresen elküldtük! Hamarosan válaszolunk.')
      setTicketForm({
        subject: '',
        category: '',
        priority: 'normal',
        message: ''
      })
    } catch (error) {
      console.error('Error creating ticket:', error)
      toast.error('Hiba történt a jegy létrehozása során')
    }
  }

  // Handle student reply to ticket
  const handleReplyToTicket = async () => {
    if (!replyMessage.trim() || !selectedTicket) {
      toast.error('Írj be egy üzenetet!')
      return
    }

    try {
      const newResponse = {
        message: replyMessage,
        userId: user?.uid,
        userName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || user?.email,
        isStudent: true,
        createdAt: new Date()
      }

      await updateDoc(doc(db, 'supportTickets', selectedTicket.id), {
        responses: arrayUnion(newResponse),
        updatedAt: serverTimestamp()
      })

      setReplyMessage('')
      toast.success('Válasz elküldve')
    } catch (error) {
      console.error('Error sending reply:', error)
      toast.error('Hiba történt a válasz küldésekor')
    }
  }

  // Handle rating submission
  const handleSubmitRating = async () => {
    if (!selectedTicket || rating === 0) {
      toast.error('Kérjük értékeld a támogatást!')
      return
    }

    try {
      await updateDoc(doc(db, 'supportTickets', selectedTicket.id), {
        rating: rating,
        ratedAt: serverTimestamp()
      })

      toast.success('Köszönjük az értékelésed!')
      setRating(0)
    } catch (error) {
      console.error('Error submitting rating:', error)
      toast.error('Hiba történt az értékelés küldésekor')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Megoldva</Badge>
      case 'closed':
        return <Badge className="bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-400">LEZÁRVA</Badge>
      case 'in-progress':
        return <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400">Folyamatban</Badge>
      case 'open':
        return <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Nyitott</Badge>
      default:
        return null
    }
  }

  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Segítség és Támogatás
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Kérdésed van? Itt megtalálod a választ, vagy kapcsolatba léphetsz velünk.
          </p>
        </div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Live Chat</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Azonnal válaszolunk</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Email</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">support@elira.hu</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                  <Phone className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Telefon</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">+36 1 234 5678</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="faq" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="faq">Gyakori kérdések</TabsTrigger>
            <TabsTrigger value="new-ticket">Új támogatási jegy</TabsTrigger>
            <TabsTrigger value="my-tickets">Jegyeim</TabsTrigger>
          </TabsList>

          {/* FAQ Tab */}
          <TabsContent value="faq">
            <Card>
              <CardHeader>
                <CardTitle>Gyakran Ismételt Kérdések</CardTitle>
                <CardDescription>
                  Találd meg a választ a leggyakoribb kérdésekre
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search */}
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <Input
                    type="search"
                    placeholder="Keress a kérdések között..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {faqCategories.map((category) => {
                    const Icon = category.icon
                    return (
                      <Button
                        key={category.id}
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className="gap-2"
                      >
                        <Icon className="w-4 h-4" />
                        {category.title}
                      </Button>
                    )
                  })}
                </div>

                {/* Questions */}
                <div className="space-y-4">
                  {faqCategories
                    .find(c => c.id === selectedCategory)
                    ?.questions.map((item, index) => (
                      <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-teal-600" />
                          {item.q}
                        </h4>
                        <p className="text-gray-600 dark:text-gray-400 pl-6">
                          {item.a}
                        </p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* New Ticket Tab */}
          <TabsContent value="new-ticket">
            <Card>
              <CardHeader>
                <CardTitle>Új támogatási jegy létrehozása</CardTitle>
                <CardDescription>
                  Írj nekünk, és 24 órán belül válaszolunk
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="subject">Tárgy *</Label>
                  <Input
                    id="subject"
                    placeholder="Mi a probléma röviden?"
                    value={ticketForm.subject}
                    onChange={(e) => setTicketForm({...ticketForm, subject: e.target.value})}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Kategória *</Label>
                    <Select 
                      value={ticketForm.category}
                      onValueChange={(value) => setTicketForm({...ticketForm, category: value})}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Válassz kategóriát" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technical">Technikai probléma</SelectItem>
                        <SelectItem value="payment">Fizetés és számlázás</SelectItem>
                        <SelectItem value="course">Kurzusokkal kapcsolatos</SelectItem>
                        <SelectItem value="certificate">Tanúsítvány</SelectItem>
                        <SelectItem value="account">Fiók kezelés</SelectItem>
                        <SelectItem value="other">Egyéb</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="priority">Prioritás</Label>
                    <Select 
                      value={ticketForm.priority}
                      onValueChange={(value) => setTicketForm({...ticketForm, priority: value})}
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Alacsony</SelectItem>
                        <SelectItem value="normal">Normál</SelectItem>
                        <SelectItem value="high">Magas</SelectItem>
                        <SelectItem value="urgent">Sürgős</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="message">Üzenet *</Label>
                  <Textarea
                    id="message"
                    placeholder="Írd le részletesen a problémát..."
                    value={ticketForm.message}
                    onChange={(e) => setTicketForm({...ticketForm, message: e.target.value})}
                    className="mt-1 min-h-[150px]"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Mégse</Button>
                  <Button onClick={handleSubmitTicket} className="gap-2">
                    <Send className="w-4 h-4" />
                    Jegy küldése
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Tickets Tab */}
          <TabsContent value="my-tickets">
            <Card>
              <CardHeader>
                <CardTitle>Támogatási jegyeim</CardTitle>
                <CardDescription>
                  Itt láthatod a korábbi és folyamatban lévő jegyeidet
                </CardDescription>
              </CardHeader>
              <CardContent>
                {!selectedTicket ? (
                  <div className="space-y-4">
                    {userTickets.map((ticket) => (
                      <div 
                        key={ticket.id}
                        onClick={async () => {
                          setSelectedTicket(ticket)
                          // Clear unread flag when student opens the ticket
                          if (ticket.hasUnreadResponse) {
                            try {
                              await updateDoc(doc(db, 'supportTickets', ticket.id), {
                                hasUnreadResponse: false
                              })
                            } catch (error) {
                              console.error('Error clearing unread flag:', error)
                            }
                          }
                        }}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <h4 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                              #{ticket.id.slice(-6).toUpperCase()} - {ticket.subject}
                              {ticket.hasUnreadResponse && (
                                <span className="inline-flex w-3 h-3 bg-green-500 rounded-full animate-pulse ml-2" title="Új üzenet" />
                              )}
                            </h4>
                            {getStatusBadge(ticket.status)}
                            {ticket.status === 'closed' && ticket.rating && (
                              <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star 
                                    key={i}
                                    className={`w-3 h-3 ${i < ticket.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {ticket.createdAt?.toDate ? ticket.createdAt.toDate().toLocaleDateString('hu-HU') : 'Most'}
                            </span>
                            <span>{getCategoryName(ticket.category)}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    ))}
                  </div>
                ) : (
                  // Ticket Detail View
                  <div className="space-y-4">
                    <div className="flex items-center justify-between mb-4">
                      <Button 
                        variant="ghost" 
                        onClick={() => setSelectedTicket(null)}
                        className="gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Vissza
                      </Button>
                      {getStatusBadge(selectedTicket.status)}
                    </div>

                    <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {selectedTicket.subject}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                        <span>#{selectedTicket.id.slice(-6).toUpperCase()}</span>
                        <span>{getCategoryName(selectedTicket.category)}</span>
                        <span>{selectedTicket.createdAt?.toDate ? selectedTicket.createdAt.toDate().toLocaleString('hu-HU') : ''}</span>
                      </div>

                      {/* Conversation */}
                      <div className="space-y-4">
                        {/* Original Message */}
                        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                          <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-teal-100 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-gray-900 dark:text-white">Te</span>
                                <span className="text-xs text-gray-500">
                                  {selectedTicket.createdAt?.toDate ? selectedTicket.createdAt.toDate().toLocaleString('hu-HU') : ''}
                                </span>
                              </div>
                              <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                {selectedTicket.message}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Responses */}
                        {selectedTicket.responses && selectedTicket.responses.map((response: any, index: number) => (
                          <div key={index} className={`rounded-lg p-4 ${
                            response.isStudent 
                              ? 'bg-gray-50 dark:bg-gray-800' 
                              : 'bg-teal-50 dark:bg-teal-900/20'
                          }`}>
                            <div className="flex items-start gap-3">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                                response.isStudent 
                                  ? 'bg-teal-100 dark:bg-teal-900/30'
                                  : 'bg-red-100 dark:bg-red-900/30'
                              }`}>
                                {response.isStudent ? (
                                  <User className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                                ) : (
                                  <Shield className="w-4 h-4 text-red-600 dark:text-red-400" />
                                )}
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-semibold text-gray-900 dark:text-white">
                                    {response.isStudent ? 'Te' : response.adminName || 'Admin'}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {response.createdAt ? new Date(response.createdAt).toLocaleString('hu-HU') : ''}
                                  </span>
                                </div>
                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                                  {response.message}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}

                        {/* Reply Form or Rating */}
                        {selectedTicket.status === 'closed' ? (
                          // Rating Section for Closed Tickets
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            {!selectedTicket.rating ? (
                              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                  Értékeld a támogatást
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                  Mennyire voltál elégedett a kapott segítséggel?
                                </p>
                                <div className="flex items-center gap-2 mb-4">
                                  {[1, 2, 3, 4, 5].map((value) => (
                                    <button
                                      key={value}
                                      onClick={() => setRating(value)}
                                      className="transition-transform hover:scale-110"
                                    >
                                      <Star 
                                        className={`w-8 h-8 ${
                                          value <= rating 
                                            ? 'fill-yellow-400 text-yellow-400' 
                                            : 'fill-gray-200 text-gray-300 dark:fill-gray-700 dark:text-gray-600'
                                        }`}
                                      />
                                    </button>
                                  ))}
                                </div>
                                <Button 
                                  onClick={handleSubmitRating}
                                  disabled={rating === 0}
                                  className="gap-2"
                                >
                                  <Send className="w-4 h-4" />
                                  Értékelés küldése
                                </Button>
                              </div>
                            ) : (
                              <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 text-center">
                                <CheckCircle className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-2" />
                                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                  Köszönjük az értékelésed!
                                </h4>
                                <div className="flex items-center justify-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i}
                                      className={`w-5 h-5 ${
                                        i < selectedTicket.rating 
                                          ? 'fill-yellow-400 text-yellow-400' 
                                          : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        ) : selectedTicket.status !== 'resolved' ? (
                          // Reply Form for Open/In-Progress Tickets
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            <Textarea
                              placeholder="Írj választ..."
                              value={replyMessage}
                              onChange={(e) => setReplyMessage(e.target.value)}
                              className="mb-3"
                              rows={3}
                            />
                            <Button 
                              onClick={handleReplyToTicket}
                              disabled={!replyMessage.trim()}
                              className="gap-2"
                            >
                              <Send className="w-4 h-4" />
                              Válasz küldése
                            </Button>
                          </div>
                        ) : (
                          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 text-center">
                            <AlertCircle className="w-12 h-12 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
                            <p className="text-gray-700 dark:text-gray-300">
                              Ez a jegy megoldva lett. Várj, amíg az admin lezárja.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {userTickets.length === 0 && (
                  <div className="text-center py-8">
                    <FileQuestion className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      Még nincs támogatási jegyed
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Ha segítségre van szükséged, hozz létre egy új jegyet!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bottom Help Section */}
        <Card className="mt-8 bg-gradient-to-r from-teal-50 to-blue-50 dark:from-teal-900/20 dark:to-blue-900/20 border-teal-200 dark:border-teal-800">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white dark:bg-gray-800 rounded-lg">
                  <Video className="w-8 h-8 text-teal-600 dark:text-teal-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    Videó útmutatók
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Nézd meg részletes videó útmutatóinkat a platform használatáról
                  </p>
                </div>
              </div>
              <Button className="gap-2">
                <BookOpen className="w-4 h-4" />
                Útmutatók
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}