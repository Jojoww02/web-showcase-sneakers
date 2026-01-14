import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import HeroSection from '@/components/organism/HeroSection/HeroSection'
import { cn } from '@/lib/utils'
import { Eye, EyeOff } from 'lucide-react'
import { usePostApiAuthRegister } from '@/gen/sneakverse/hooks/usePostApiAuthRegister'

const registerSchema = z.object({
  name: z.string().min(2, 'Min 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
  confirmPassword: z.string().min(6, 'Min 6 characters'),
}).refine((data) => data.password === data.confirmPassword, {
  path: ['confirmPassword'],
  message: 'Passwords do not match',
})

type FormValues = z.infer<typeof registerSchema>

export const Route = createFileRoute('/register/')({
  component: Register,
})

function Register() {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(registerSchema),
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const registerMutation = usePostApiAuthRegister()

  const onSubmit = (values: FormValues) => {
    registerMutation.mutate(
      { data: { fullName: values.name, email: values.email, password: values.password } },
      {
        onSuccess: () => {
          reset()
          setIsSuccessOpen(true)
        },
        onError: (err) => {
          console.error('Register failed', err)
        },
      }
    )
  }

  const navigate = useNavigate()

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
            <h1 className="text-4xl font-bold tracking-tighter">Register</h1>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="px-6 pb-8 space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest">Full name</label>
              <input
                type="text"
                className={cn(
                  "w-full h-11 rounded-lg border border-black/10 bg-[#f6f5f2] px-3 outline-none focus:ring-2 focus:ring-[#ff6b6b] transition-all",
                  errors.name && "border-[#ff6b6b] focus:ring-[#ff6b6b]"
                )}
                placeholder="Your name"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-[#ff6b6b] text-xs">{errors.name.message}</p>
              )}
            </div>

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
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest">Confirm password</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  className={cn(
                    "w-full h-11 rounded-lg border border-black/10 bg-[#f6f5f2] px-3 pr-10 outline-none focus:ring-2 focus:ring-[#ff6b6b] transition-all",
                    errors.confirmPassword && "border-[#ff6b6b] focus:ring-[#ff6b6b]"
                  )}
                  placeholder="••••••••"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  className={cn('absolute right-3 top-1/2 cursor-pointer -translate-y-1/2 text-black/50 hover:text-black transition-colors')}
                  onClick={() => setShowConfirm(v => !v)}
                >
                  {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-[#ff6b6b] text-xs">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={registerMutation.isPending}
              className="w-full h-11 rounded-lg cursor-pointer bg-[#ff6b6b] text-white font-bold tracking-wide shadow-[0_10px_24px_-8px_rgba(255,107,107,0.6)] hover:brightness-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {registerMutation.isPending ? 'Creating account...' : 'Create account'}
            </button>


            <div className="text-center text-sm text-black/70">
              Already have an account? <a className="font-bold text-blue-500 cursor-pointer relative group inline-block" onClick={() => navigate({ to: '/login' })}>
                Login
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-blue-500 origin-right scale-x-0 transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100"></span>
              </a>
            </div>
          </form>
        </div>
        {isSuccessOpen && (
          <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-black/40">
            <div className="w-full max-w-sm rounded-2xl bg-white shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)] border border-black/5 p-6 text-center">
              <h2 className="text-2xl font-bold tracking-tight">Registration Successful</h2>
              <p className="mt-2 text-sm text-black/70">
                Your account has been created. You can now login.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  className="px-4 h-10 rounded-lg bg-[#ff6b6b] text-white font-semibold cursor-pointer hover:brightness-95 transition"
                  onClick={() => {
                    setIsSuccessOpen(false)
                    navigate({ to: '/login' })
                  }}
                >
                  Go to Login
                </button>
                <button
                  type="button"
                  className="px-4 h-10 rounded-lg border border-black/10 text-sm font-medium cursor-pointer hover:bg-black/5 transition"
                  onClick={() => setIsSuccessOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
