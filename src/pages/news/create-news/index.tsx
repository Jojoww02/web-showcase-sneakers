import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosHeaders } from 'axios'
import { cn } from '@/lib/utils'
import { usePostApiArticles } from '@/gen/sneakverse/hooks/usePostApiArticles'
import { useUserStore } from '@/store/userStore'

const createNewsSchema = z.object({
  title: z.string().min(3, 'Min 3 characters'),
  category: z.string().min(2, 'Min 2 characters').max(100, 'Max 100 characters'),
  content: z.string().min(20, 'Min 20 characters'),
  thumbnail: z
    .any()
    .refine((fileList) => fileList instanceof FileList && fileList.length > 0, 'Thumbnail is required'),
})

type FormValues = z.infer<typeof createNewsSchema>

export const Route = createFileRoute('/news/create-news/')({
  component: CreateNews,
})

function CreateNews() {
  const [pendingData, setPendingData] = useState<FormValues | null>(null)
  const [showPolicyModal, setShowPolicyModal] = useState(false)
  const [policyAccepted, setPolicyAccepted] = useState(false)
  const token = useUserStore(s => s.token)
  const navigate = useNavigate()
  const { register, handleSubmit, reset, setError, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(createNewsSchema),
  })
  const createNewsMutation = usePostApiArticles({
    client: {
      headers: new AxiosHeaders({
        'Content-Type': 'multipart/form-data',
      }),
    },
  })

  useEffect(() => {
    if (!token) {
      navigate({ to: '/login' })
    }
  }, [token, navigate])

  const doUpload = (values: FormValues) => {
    const fileList = values.thumbnail as unknown as FileList
    const file = fileList?.[0]
    if (!file) {
      setError('thumbnail', { type: 'manual', message: 'Thumbnail is required' })
      return
    }

    createNewsMutation.mutate(
      {
        data: {
          Title: values.title,
          Category: values.category,
          Content: values.content,
          Thumbnail: file,
        },
      },
      {
        onSuccess: () => {
          setPendingData(null)
          setShowPolicyModal(false)
          setPolicyAccepted(false)
          reset()
          navigate({ to: '/news/' })
        },
        onError: (err) => {
          const resp = (err as any)?.response
          const data = resp?.data ?? (err as any)?.data
          const msg =
            data?.message ||
            data?.error ||
            (Array.isArray(data?.errors) ? data.errors[0] : undefined) ||
            err?.message ||
            'Terjadi kesalahan'
          setError('title', { type: 'server', message: String(msg) })
        },
      },
    )
  }

  const onSubmit = (values: FormValues) => {
    setPendingData(values)
    setPolicyAccepted(false)
    setShowPolicyModal(true)
  }

  return (
    <div className="relative min-h-screen bg-[#f6f5f2] text-black">
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="mt-10 mb-8">
          <h1 className="text-4xl font-bold tracking-tight">Create news</h1>
          <p className="mt-2 text-sm md:text-base text-black/70">Upload new article for Sneakverse.</p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white rounded-2xl shadow-[0_20px_40px_-12px_rgba(0,0,0,0.15)] border border-black/5 p-6 md:p-8 space-y-6"
        >
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest">Title</label>
            <input
              type="text"
              className={cn(
                'w-full h-11 rounded-lg border border-black/10 bg-[#f6f5f2] px-3 outline-none focus:ring-2 focus:ring-[#ff6b6b] transition-all',
                errors.title && 'border-[#ff6b6b] focus:ring-[#ff6b6b]',
              )}
              placeholder="Write an engaging title..."
              {...register('title')}
            />
            {errors.title && <p className="text-[#ff6b6b] text-xs">{errors.title.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest">Category</label>
            <input
              type="text"
              className={cn(
                'w-full h-11 rounded-lg border border-black/10 bg-[#f6f5f2] px-3 outline-none focus:ring-2 focus:ring-[#ff6b6b] transition-all',
                errors.category && 'border-[#ff6b6b] focus:ring-[#ff6b6b]',
              )}
              placeholder="e.g. Release, Event, Opinion"
              {...register('category')}
            />
            {errors.category && <p className="text-[#ff6b6b] text-xs">{errors.category.message}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest">Thumbnail</label>
            <input
              type="file"
              accept="image/*"
              className={cn(
                'block w-full text-sm text-black/80 file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-black file:text-white hover:file:bg-black/90 cursor-pointer',
                errors.thumbnail && 'text-[#ff6b6b]',
              )}
              {...register('thumbnail')}
            />
            {errors.thumbnail && (
              <p className="text-[#ff6b6b] text-xs">{String(errors.thumbnail.message)}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest">Content</label>
            <textarea
              rows={8}
              className={cn(
                'w-full rounded-lg border border-black/10 bg-[#f6f5f2] px-3 py-2 outline-none focus:ring-2 focus:ring-[#ff6b6b] transition-all resize-none',
                errors.content && 'border-[#ff6b6b] focus:ring-[#ff6b6b]',
              )}
              placeholder="Write your article content here..."
              {...register('content')}
            />
            {errors.content && <p className="text-[#ff6b6b] text-xs">{errors.content.message}</p>}
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate({ to: '/news/' })}
              className="h-11 px-5 rounded-lg cursor-pointer border border-black/10 bg-white text-sm font-medium hover:bg-black/5 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createNewsMutation.isPending}
              className="h-11 px-6 rounded-lg cursor-pointer bg-[#ff6b6b] text-white text-sm font-bold tracking-wide shadow-[0_10px_24px_-8px_rgba(255,107,107,0.6)] hover:brightness-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {createNewsMutation.isPending ? 'Uploading...' : 'Publish news'}
            </button>
          </div>
        </form>
      </div>

      {showPolicyModal && pendingData && (
        <div className="absolute inset-0 z-[9999] flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-[0_20px_40px_-12px_rgba(0,0,0,0.25)] border border-black/5 p-6 md:p-7">
            <h2 className="text-2xl font-bold tracking-tight">Publication policy</h2>
            <p className="mt-3 text-sm text-black/70">
              Before publishing a news article, please ensure that your content:
            </p>
            <ul className="mt-3 space-y-1 text-sm text-black/75 list-disc list-inside">
              <li>Does not contain hate speech, harassment, or spam.</li>
              <li>Uses images and assets that you have the rights to use.</li>
              <li>Provides accurate information and does not intentionally mislead readers.</li>
            </ul>

            <label className="mt-4 flex items-start gap-2 text-sm text-black/80 cursor-pointer select-none">
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded border border-black/40"
                checked={policyAccepted}
                onChange={(e) => setPolicyAccepted(e.target.checked)}
              />
              <span>
                I have read and agree to the content publication procedures and policies on Sneakverse.
              </span>
            </label>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="h-10 px-4 rounded-lg border border-black/10 bg-white text-sm font-medium cursor-pointer hover:bg-black/5 transition"
                onClick={() => {
                  setShowPolicyModal(false)
                  setPendingData(null)
                  setPolicyAccepted(false)
                }}
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!policyAccepted || createNewsMutation.isPending}
                className="h-10 px-5 rounded-lg cursor-pointer bg-[#ff6b6b] text-white text-sm font-semibold shadow-[0_10px_24px_-8px_rgba(255,107,107,0.6)] hover:brightness-95 transition disabled:opacity-60 disabled:cursor-not-allowed"
                onClick={() => {
                  if (!pendingData || !policyAccepted) return
                  doUpload(pendingData)
                }}
              >
                {createNewsMutation.isPending ? 'Uploading...' : 'Agree & upload'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}