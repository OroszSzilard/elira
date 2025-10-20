import { Navbar } from '@/components/navigation/navbar'
import { Footer } from '@/components/navigation/footer'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen pt-[74px] bg-gradient-to-b from-[#f8f9fa] to-[#e0e7ff] dark:from-gray-900 dark:to-gray-800">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}