'use client'

import { useState } from 'react'
import { useRegister } from '@/hooks/useAuthQueries'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Check, X } from 'lucide-react'
import { toast } from 'sonner'

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  })
  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasNumber: false,
  })
  const register = useRegister()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
    
    // Check password strength when password changes
    if (name === 'password') {
      setPasswordStrength({
        hasMinLength: value.length >= 8,
        hasUpperCase: /[A-Z]/.test(value),
        hasNumber: /\d/.test(value),
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await register.mutateAsync(form)
      toast.success('Sikeres regisztráció! Kérjük ellenőrizze email fiókját és erősítse meg email címét.')
      // Small delay to ensure signOut completes
      setTimeout(() => {
        router.push('/login?registered=true')
      }, 500)
    } catch (err: any) {
      toast.error(err?.message || 'A regisztráció során hiba lépett fel.')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold tracking-tight">Indítsa el a jövőjét, még ma.</CardTitle>
          <CardDescription>
            Hozzon létre egy fiókot, és tegye meg az első lépést a következő nagy karrierlehetősége felé.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lastName">Vezetéknév</Label>
                <Input id="lastName" name="lastName" value={form.lastName} onChange={handleChange} placeholder="Gipsz" required disabled={register.isPending} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firstName">Keresztnév</Label>
                <Input id="firstName" name="firstName" value={form.firstName} onChange={handleChange} placeholder="Jakab" required disabled={register.isPending} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-mail cím</Label>
              <Input id="email" type="email" name="email" value={form.email} onChange={handleChange} placeholder="nev@pelda.com" required disabled={register.isPending} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Jelszó</Label>
              <Input id="password" type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" required disabled={register.isPending} />
              {form.password && (
                <div className="space-y-1 mt-2">
                  <div className="flex items-center gap-2 text-sm">
                    {passwordStrength.hasMinLength ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-gray-400" />
                    )}
                    <span className={passwordStrength.hasMinLength ? "text-green-600" : "text-gray-500"}>
                      Legalább 8 karakter
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {passwordStrength.hasUpperCase ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-gray-400" />
                    )}
                    <span className={passwordStrength.hasUpperCase ? "text-green-600" : "text-gray-500"}>
                      Legalább egy nagybetű
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {passwordStrength.hasNumber ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <X className="h-3 w-3 text-gray-400" />
                    )}
                    <span className={passwordStrength.hasNumber ? "text-green-600" : "text-gray-500"}>
                      Legalább egy szám
                    </span>
                  </div>
                </div>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={register.isPending}>
              {register.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Ingyenes fiók létrehozása
            </Button>
            <p className="text-center text-sm text-muted-foreground">
              Már van fiókja?{' '}
              <Link href="/login" className="font-semibold text-primary hover:underline">
                Jelentkezzen be
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 