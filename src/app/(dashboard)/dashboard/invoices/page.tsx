'use client'

import { useState, useEffect } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { collection, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { FileText, Download, CreditCard, Calendar, CheckCircle, XCircle, Clock } from 'lucide-react'
import { format } from 'date-fns'
import { hu } from 'date-fns/locale'

interface Payment {
  id: string
  courseId: string
  courseTitle: string
  amount: number
  currency: string
  status: 'succeeded' | 'pending' | 'failed'
  paymentMethod: string
  stripeSessionId?: string
  createdAt: Timestamp
  invoiceUrl?: string
}

export default function InvoicesPage() {
  const { user } = useAuthStore()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.uid) {
      fetchPayments()
    }
  }, [user])

  const fetchPayments = async () => {
    if (!user?.uid) return

    try {
      const paymentsQuery = query(
        collection(db, 'payments'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )

      const snapshot = await getDocs(paymentsQuery)
      const paymentsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Payment[]

      setPayments(paymentsData)
    } catch (error) {
      console.error('Error fetching payments:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return null
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'Sikeres'
      case 'pending':
        return 'Folyamatban'
      case 'failed':
        return 'Sikertelen'
      default:
        return status
    }
  }

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('hu-HU', {
      style: 'currency',
      currency: currency || 'HUF'
    }).format(amount / 100) // Stripe amounts are in cents
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Számlák és fizetések
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Itt láthatod az összes korábbi fizetésed és számládat
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-12 text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Még nincsenek fizetéseid
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Amikor vásárolsz egy kurzust, itt fogod látni a fizetési előzményeidet
          </p>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Dátum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Kurzus
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Összeg
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Státusz
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Fizetési mód
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Műveletek
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-900 dark:text-white">
                          {format(payment.createdAt.toDate(), 'yyyy. MMMM dd.', { locale: hu })}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white font-medium">
                        {payment.courseTitle || 'Kurzus'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900 dark:text-white">
                        {formatAmount(payment.amount, payment.currency)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(payment.status)}
                        <span className="ml-2 text-sm text-gray-900 dark:text-white">
                          {getStatusText(payment.status)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {payment.paymentMethod || 'Bankkártya'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      {payment.invoiceUrl && (
                        <button
                          onClick={() => window.open(payment.invoiceUrl, '_blank')}
                          className="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                        >
                          <Download className="h-4 w-4 mr-1" />
                          Számla
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="mt-8 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <FileText className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
              Számla letöltése
            </h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-300">
              <p>
                A sikeres fizetésekről automatikusan számlát állítunk ki. A számlákat PDF formátumban töltheted le a "Számla" gombra kattintva.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}