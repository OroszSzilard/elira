'use client'

import { useState, Suspense, useEffect } from 'react'
import { useLogin } from '@/hooks/useAuthQueries'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Info } from 'lucide-react'
import { toast } from 'sonner'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showVerificationAlert, setShowVerificationAlert] = useState(false)
  const login = useLogin()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams?.get('redirect_to') || '/dashboard'
  const justRegistered = searchParams?.get('registered') === 'true'

  useEffect(() => {
    if (justRegistered) {
      setShowVerificationAlert(true)
    }
  }, [justRegistered])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const result = await login.mutateAsync({ email, password })
      console.log('✅ Login result:', result)
      
      toast.success('Sikeres bejelentkezés! Átirányítás...')

      // Determine default landing if none specified
      let target = redirectTo
      if (!searchParams?.get('redirect_to')) {
        const role = result.user.role
        console.log('🔧 User role:', role)
        if (role === 'UNIVERSITY_ADMIN' || role === 'university_admin') target = '/university-admin/dashboard'
        else if (role === 'instructor') target = '/instructor/dashboard'
        else if (role === 'admin') target = '/admin'
        else target = '/dashboard'
      }
      
      console.log('🔧 Redirecting to:', target)
      
      // Use window.location for more reliable redirect
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.href = target
        } else {
          router.push(target)
        }
      }, 1000)
      
    } catch (err: any) {
      console.error('❌ Login error:', err)
      toast.error(err?.response?.data?.message || err?.message || 'Valami nem stimmel. Kérjük, próbálja újra.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Kezdődjön a tanulás!</CardTitle>
          <CardDescription>Jelentkezzen be a fiókjába a folytatáshoz.</CardDescription>
        </CardHeader>
        <CardContent>
          {showVerificationAlert && (
            <Alert className="mb-4">
              <Info className="h-4 w-4" />
              <AlertDescription>
                Sikeres regisztráció! Kérjük ellenőrizze email fiókját és erősítse meg email címét a bejelentkezéshez.
              </AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail cím</Label>
              <Input
                id="email"
                type="email"
                placeholder="nev@pelda.com"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                required
                disabled={login.isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Jelszó</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                required
                disabled={login.isPending}
              />
            </div>
            <div className="text-right text-sm">
              <Link href="/forgot-password" className="font-medium text-primary hover:underline">
                Elfelejtette a jelszavát?
              </Link>
            </div>
            <Button type="submit" className="w-full" disabled={login.isPending}>
              {login.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Bejelentkezés
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Még nincs fiókja?{' '}
              <Link href="/register" className="font-semibold text-primary hover:underline">
                Regisztráljon ingyenesen
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div>Betöltés...</div>}>
      <LoginForm />
    </Suspense>
  );
} 