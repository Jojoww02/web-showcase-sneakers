import { createFileRoute, useNavigate } from '@tanstack/react-router'
import HeroSection from '@/components/organism/HeroSection/HeroSection'
import { useGetApiAuthMe } from '@/gen/sneakverse/hooks/useGetApiAuthMe'
import { User, Mail, Calendar, RefreshCw, AlertTriangle } from 'lucide-react'

export const Route = createFileRoute('/profile/')({
  component: Profile,
})

function Profile() {
  const navigate = useNavigate()
  const { data, isLoading, isError, error, refetch, isFetching } = useGetApiAuthMe({
    query: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: true
    }
  })

  const user = (data ?? {}) as any
  const displayName =
    user.fullName || user.name || user.userName || user.username || 'User'
  const email = user.email || '-'
  const createdAt = user.createdAt || user.registeredAt || user.joinDate

  const errorStatus = (error as any)?.response?.status
  const isUnauthorized = errorStatus === 401 || errorStatus === 403

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
        <div className="w-full max-w-2xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)] border border-black/5 overflow-hidden">
          <div className="px-6 pt-8 pb-4 border-b border-black/5">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tighter flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black text-white">
                <User size={20} />
              </span>
              <span>Profile</span>
            </h1>
            <p className="mt-2 text-sm text-black/60">
              Account details connected to your login session.
            </p>
          </div>

          <div className="px-6 py-6 md:py-8 space-y-6">
            {(isLoading || isFetching) && (
              <div className="flex items-center justify-center py-10 text-black/60 gap-3">
                <RefreshCw size={18} className="animate-spin" />
                <span>Loading profile data...</span>
              </div>
            )}

            {isError && !isLoading && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 flex flex-col gap-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle size={18} className="mt-[2px]" />
                  <div>
                    <p className="font-semibold">
                      Failed to load profile data.
                    </p>
                    {isUnauthorized ? (
                      <p className="mt-1">
                        Your session may have expired. Please log in again to
                        view this page.
                      </p>
                    ) : (
                      <p className="mt-1">
                        An error occurred while fetching data. Please try again
                        later.
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-end">
                  <button
                    type="button"
                    className="px-4 h-9 rounded-lg border border-red-300 text-xs font-semibold text-red-700 cursor-pointer hover:bg-red-100 transition"
                    onClick={() => refetch()}
                  >
                    Try again
                  </button>
                  {isUnauthorized && (
                    <button
                      type="button"
                      className="px-4 h-9 rounded-lg bg-red-600 text-white text-xs font-semibold cursor-pointer hover:bg-red-700 transition"
                      onClick={() => navigate({ to: '/login' })}
                    >
                      Go to login page
                    </button>
                  )}
                </div>
              </div>
            )}

            {!isLoading && !isError && (
              <div className="space-y-6">
                <div className="flex flex-col md:flex-row md:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="h-14 w-14 rounded-full bg-black text-white flex items-center justify-center text-xl font-bold">
                      {String(displayName).charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-lg font-semibold leading-tight">{displayName}</p>
                      <p className="text-sm text-black/60 flex items-center gap-1">
                        <Mail size={14} />
                        <span>{email}</span>
                      </p>
                    </div>
                  </div>
                  {createdAt && (
                    <div className="flex items-center gap-2 text-sm text-black/60 md:ml-auto">
                      <Calendar size={14} />
                      <span>
                        Joined: {new Date(createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {user && Object.keys(user).length > 0 && (
                  <div className="pt-4 border-t border-black/5">
                    <h2 className="text-sm font-semibold tracking-wide uppercase text-black/60 mb-3">
                      Account detail
                    </h2>
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm">
                      {Object.entries(user)
                        .filter(([key]) => {
                          const k = key.toLowerCase()
                          return ![
                            'password',
                            'token',
                            'accesstoken',
                            'refreshtoken',
                            'id',
                            'userid',
                            'user_id',
                            'createdat',
                            'created_at',
                            'updatedat',
                            'updated_at',
                          ].includes(k)
                        })
                        .filter(([, value]) => {
                          const t = typeof value
                          return t === 'string' || t === 'number' || t === 'boolean'
                        })
                        .slice(0, 10)
                        .map(([key, value]) => {
                          const formattedKey = key
                            .replace(/([A-Z])/g, ' $1')
                            .replace(/_/g, ' ')
                            .replace(/\b\w/g, (c) => c.toUpperCase())
                            .trim()

                          return (
                            <div key={key} className="flex flex-col">
                              <dt className="text-xs uppercase tracking-wide text-black/50">
                                {formattedKey}
                              </dt>
                              <dd className="font-medium text-black/80 break-all">
                                {String(value)}
                              </dd>
                            </div>
                          )
                        })}
                    </dl>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
