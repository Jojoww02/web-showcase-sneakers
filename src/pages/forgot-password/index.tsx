import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import HeroSection from '@/components/organism/HeroSection/HeroSection'
import { cn } from '@/lib/utils'
import { usePostApiAuthForgotPassword } from '@/gen/sneakverse/hooks/usePostApiAuthForgotPassword'

const forgotPasswordSchema = z.object({
  email: z.string().email('Invalid email'),
})

type FormValues = z.infer<typeof forgotPasswordSchema>

export const Route = createFileRoute('/forgot-password/')({
  component: ForgotPassword,
})

function ForgotPassword() {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(forgotPasswordSchema),
  })

  const navigate = useNavigate()
  const [isSuccessOpen, setIsSuccessOpen] = useState(false)
  const forgotMutation = usePostApiAuthForgotPassword()

  const onSubmit = (values: FormValues) => {
    forgotMutation.mutate(
      { data: { email: values.email } },
      {
        onSuccess: () => {
          setIsSuccessOpen(true)
        },
        onError: (err) => {
          console.error('Forgot password failed', err)
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
            <h1 className="text-4xl font-bold tracking-tighter">Reset Password</h1>
            <p className="mt-2 text-sm text-black/60">
              Enter your email address and we'll send you a code to reset your password.
            </p>
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

            <button
              type="submit"
              disabled={forgotMutation.isPending}
              className="w-full h-11 rounded-lg cursor-pointer bg-[#ff6b6b] text-white font-bold tracking-wide shadow-[0_10px_24px_-8px_rgba(255,107,107,0.6)] hover:brightness-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {forgotMutation.isPending ? 'Sending code...' : 'Send Reset Code'}
            </button>

            <div className="text-center text-sm text-black/70">
              Remember your password? <a className="font-bold text-blue-500 cursor-pointer relative group inline-block" onClick={() => navigate({ to: '/login' })}>
                Login
                <span className="absolute bottom-0 left-0 w-full h-[1px] bg-blue-500 origin-right scale-x-0 transition-transform duration-300 ease-out group-hover:origin-left group-hover:scale-x-100"></span>
              </a>
            </div>
          </form>
        </div>
        {isSuccessOpen && (
          <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-black/40">
            <div className="w-full max-w-sm rounded-2xl bg-white shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)] border border-black/5 p-6 text-center">
              <h2 className="text-2xl font-bold tracking-tight">Check your email</h2>
              <p className="mt-2 text-sm text-black/70">
                We have sent a 6-digit reset code to your registered email address.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <button
                  type="button"
                  className="px-4 h-10 rounded-lg bg-[#ff6b6b] text-white font-semibold cursor-pointer hover:brightness-95 transition"
                  onClick={() => {
                    setIsSuccessOpen(false)
                    navigate({ to: '/reset-password' })
                  }}
                >
                  Go to Reset Password
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
