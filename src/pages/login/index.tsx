import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import HeroSection from '@/components/organism/HeroSection/HeroSection'
import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'
import { usePostApiAuthLogin } from '@/gen/sneakverse/hooks/usePostApiAuthLogin'
import { useUserStore } from '@/store/userStore'

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
})

type FormValues = z.infer<typeof loginSchema>

export const Route = createFileRoute('/login/')({
  component: Login,
})

function Login() {
  const { register, handleSubmit, formState: { errors }, setError } = useForm<FormValues>({
    resolver: zodResolver(loginSchema),
  })
  const [showPassword, setShowPassword] = useState(false)
  const setToken = useUserStore(s => s.setToken)
  const setRefreshToken = useUserStore(s => s.setRefreshToken)
  const loginMutation = usePostApiAuthLogin()
  const navigate = useNavigate()

  const decodeJwt = (t: string) => {
    try {
      const b64 = t.split('.')[1]
      const json = atob(b64.replace(/-/g, '+').replace(/_/g, '/'))
      return JSON.parse(json)
    } catch {
      return null
    }
  }

  const extractTokens = (res: any) => {
    const accessToken = res?.accessToken || res?.token || res?.data?.accessToken || res?.data?.token
    const refreshToken = res?.refreshToken || res?.data?.refreshToken
    return { accessToken, refreshToken }
  }

  const onSubmit = (values: FormValues) => {
    loginMutation.mutate(
      { data: values },
      {
        onSuccess: (res) => {
          const { accessToken, refreshToken } = extractTokens(res)
          if (!accessToken) {
            const message = 'Email atau password salah'
            setError('email', { type: 'manual', message })
            setError('password', { type: 'manual', message })
            return
          }

          setToken(accessToken)
          if (refreshToken) setRefreshToken(refreshToken)
          const payload = decodeJwt(accessToken)
          console.log('JWT payload', payload)
          navigate({ to: '/' })
        },
        onError: (err) => {
          const resp = (err as any)?.response
          const data = resp?.data ?? (err as any)?.data
          const msg = data?.message || data?.error || (Array.isArray(data?.errors) ? data.errors[0] : undefined) || err?.message || 'Terjadi kesalahan'
          setError('email', { type: 'server', message: String(msg) })
          setError('password', { type: 'server', message: String(msg) })
          console.error('Login failed', err)
        },
      }
    )
  }

  return (
    <div className="relative min-h-screen bg-[#f6f5f2] text-black">
      <div className="absolute inset-0 pointer-events-none">
        <div className="opacity-25">
          <HeroSection />
        </div>
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30" />
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)] border border-black/5">
          <div className="px-6 pt-8 pb-4 text-center">
            <h1 className="text-4xl font-bold tracking-tighter">Login</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest">Email</label>
              <input
                type="email"
                className={cn(
                  "w-full h-11 rounded-lg border border-black/10 bg-[#f6f5f2] px-3 outline-none focus:ring-2 focus:ring-[#ff6b6b] transition-all",
                  errors.email && "border-[#ff6b6b] focus:ring-[#ff6b6b]"
                )}
                placeholder="you@example.com"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-[#ff6b6b] text-xs">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={cn(
                    "w-full h-11 rounded-lg border border-black/10 bg-[#f6f5f2] px-3 pr-10 outline-none focus:ring-2 focus:ring-[#ff6b6b] transition-all",
                    errors.password && "border-[#ff6b6b] focus:ring-[#ff6b6b]"
                  )}
                  placeholder="••••••••"
                  {...register('password')}
                />
                <button
                  type="button"
                  className={cn('absolute right-3 top-1/2 cursor-pointer -translate-y-1/2 text-black/50 hover:text-black transition-colors')}
                  onClick={() => setShowPassword(v => !v)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[#ff6b6b] text-xs">{errors.password.message}</p>
              )}
              <div className="flex justify-end pt-1">
                <a className="text-sm font-medium text-black/60 hover:text-black relative group cursor-pointer" onClick={() => navigate({ to: '/forgot-password' })}>
                  Forgot password?
                  <span className="absolute bottom-0 left-0 w-full h-[1px] bg-black origin-right scale-x-0 transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100"></span>
                </a>
              </div>
            </div>

            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full h-11 rounded-lg cursor-pointer bg-[#ff6b6b] text-white font-bold tracking-wide shadow-[0_10px_24px_-8px_rgba(255,107,107,0.6)] hover:brightness-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? 'Logging in...' : 'Login'}
            </button>

            <div className="text-center text-sm text-black/70">
              Don't have an account? <a className="font-bold text-blue-500 cursor-pointer relative group inline-block" onClick={() => navigate({ to: '/register' })}>
                Register
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-blue-500 origin-right scale-x-0 transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100"></span>
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
