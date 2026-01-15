import { useMemo, useEffect, useRef, useState } from 'react'
import type React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import NiceModal, { useModal } from '@ebay/nice-modal-react'
import { AxiosHeaders } from 'axios'
import { useGetApiGallery, getApiGalleryQueryKey } from '@/gen/sneakverse/hooks/useGetApiGallery'
import { usePostApiGallery } from '@/gen/sneakverse/hooks/usePostApiGallery'
import { useGetApiAuthMe } from '@/gen/sneakverse/hooks/useGetApiAuthMe'
import SplitText from '@/anim/SplitText/SplitText'
import { useQueryClient } from '@tanstack/react-query'
import { Upload, X, ImagePlus, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/gallery/')({
  component: Gallery,
})

type GalleryItem = any

function resolveItems(data: any): GalleryItem[] {
  if (!data) return []
  if (Array.isArray(data)) return data
  if (Array.isArray((data as any).items)) return (data as any).items
  if (Array.isArray((data as any).data)) return (data as any).data
  return []
}

function getImageUrl(item: any): string {
  return (
    item?.imageUrl ??
    item?.ImageUrl ??
    item?.url ??
    item?.Url ??
    item?.thumbnailUrl ??
    item?.ThumbnailUrl ??
    ''
  )
}

function getUploaderName(item: any): string {
  return (
    item?.uploaderName ??
    item?.UploaderName ??
    item?.uploadedBy ??
    item?.UploadedBy ??
    item?.author ??
    item?.Author ??
    item?.userName ??
    item?.UserName ??
    item?.createdBy ??
    item?.CreatedBy ??
    'Unknown uploader'
  )
}

function getUploadedAt(item: any): string {
  const raw =
    item?.uploadedAt ??
    item?.UploadedAt ??
    item?.createdAt ??
    item?.CreatedAt ??
    item?.date ??
    item?.Date

  if (!raw) return '-'
  const d = new Date(raw)
  if (Number.isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

const GalleryItemModal = NiceModal.create(({ item }: { item: GalleryItem }) => {
  const modal = useModal()

  useEffect(() => {
    if (modal.visible) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [modal.visible])

  if (!modal.visible || !item) return null

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/70 backdrop-blur-sm px-4"
      onClick={() => modal.hide()}
    >
      <div
        className="relative max-w-5xl mt-16 w-full bg-transparent"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.55)]">
          <div className="bg-black/5">
            <img
              src={getImageUrl(item)}
              alt={getUploaderName(item)}
              className="w-full max-h-[70vh] object-cover"
            />
          </div>
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 px-8 py-6 border-t border-black/5 bg-white">
            <div>
              <div className="text-[13px] uppercase tracking-[0.25em] text-black/40">Uploaded by</div>
              <div className="mt-1 text-[15px] font-semibold">{getUploaderName(item)}</div>
              <div className="mt-1 text-[15px] text-black/50">{getUploadedAt(item)}</div>
            </div>
            <button
              type="button"
              onClick={() => modal.hide()}
              className="text-xs uppercase tracking-[0.25em] px-5 py-2 rounded-full border border-black/15 bg-white hover:bg-black cursor-pointer hover:text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})

const UploadModal = NiceModal.create(() => {
  const modal = useModal()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const queryClient = useQueryClient()

  const { mutate: uploadImage, isPending } = usePostApiGallery({
    client: {
      headers: new AxiosHeaders({
        'Content-Type': 'multipart/form-data',
      }),
    },
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getApiGalleryQueryKey() })
        modal.hide()
      },
    },
  })

  useEffect(() => {
    if (modal.visible) {
      const prev = document.body.style.overflow
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = prev
      }
    }
  }, [modal.visible])

  if (!modal.visible) return null

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (isPending) return
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (isPending) return
    const selectedFile = e.dataTransfer.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  const handleSubmit = () => {
    if (!file || isPending) return
    uploadImage({ data: { Image: file } })
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/80 backdrop-blur-md px-4"
      onClick={() => !isPending && modal.hide()}
    >
      <div
        className="relative w-full max-w-xl bg-white rounded-3xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold tracking-tight">Upload Snapshot</h2>
            <button
              type="button"
              onClick={() => modal.hide()}
              disabled={isPending}
              className="p-2 cursor-pointer hover:bg-black/5 rounded-full transition-colors disabled:opacity-50"
            >
              <X size={20} />
            </button>
          </div>

          <div
            className={`
              relative flex flex-col items-center justify-center w-full aspect-[4/3] rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
              ${
                preview
                  ? 'border-transparent bg-black/5'
                  : 'border-black/10 hover:border-black/30 hover:bg-black/5'
              }
            `}
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="flex flex-col items-center text-black/40">
                <div className="p-4 bg-black/5 rounded-full mb-4">
                  <ImagePlus size={32} />
                </div>
                <p className="text-sm font-medium">Click or drop image here</p>
                <p className="text-xs mt-1 opacity-60">Supports JPG, PNG, WEBP</p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              disabled={isPending}
              onChange={handleFileChange}
            />
          </div>

          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => !isPending && modal.hide()}
              disabled={isPending}
              className="px-6 py-2.5 text-sm font-medium cursor-pointer text-black/60 hover:text-black hover:bg-black/5 rounded-full transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!file || isPending}
              className="flex items-center gap-2 px-6 py-2.5 cursor-pointer text-sm font-medium text-white bg-black rounded-full hover:bg-black/80 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload size={16} />
                  Upload Photo
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
})

function Gallery() {
  const { data, isLoading, isError } = useGetApiGallery()
  const { data: authMe, isSuccess: isAuthSuccess } = useGetApiAuthMe({
    query: {
      retry: 0,
      refetchOnWindowFocus: false,
    },
  })

  const items = useMemo(() => resolveItems(data), [data])
  const canUpload = Boolean(authMe && isAuthSuccess)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <span className="text-sm tracking-widest uppercase text-black/50">Loading gallery...</span>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-white text-black flex items-center justify-center">
        <span className="text-sm tracking-widest uppercase text-[#ff6b6b]">Failed to load gallery</span>
      </div>
    )
  }

  const hasItems = items && items.length > 0

  return (
    <div className="min-h-screen mt-3 bg-white text-black">
      <div className="px-[5vw] py-16">
        <div className="flex items-baseline justify-between gap-4">
          <div className="flex flex-col items-start">
            <SplitText
              text="Gallery"
              className="text-[clamp(3rem,7vw,6rem)] font-medium leading-[1] tracking-tight block"
              delay={50}
              tag="h1"
              textAlign="left"
              splitType="chars"
            />
            <SplitText
              text="Curated moments from the SneakerVerse community. Tap any photo to see who captured it and when it was uploaded."
              className="mt-3 text-black/60 max-w-[40ch] text-sm md:text-base block"
              delay={100}
              tag="p"
              textAlign="left"
              splitType="words"
            />
          </div>
          <div className="gallery-header-element hidden md:flex flex-col items-end gap-6">
            <div className="text-xs uppercase tracking-[0.2em] text-black/40 text-right">
              <span>Snapshots</span>
              <span className="block mt-1 text-[10px]">
                {hasItems ? `${items.length} images` : 'No images yet'}
              </span>
            </div>
            {canUpload && (
              <button
                type="button"
                onClick={() => NiceModal.show(UploadModal)}
                className="group flex items-center gap-2 cursor-pointer pl-4 pr-5 py-2.5 bg-black text-white rounded-full hover:bg-black/80 transition-all active:scale-95"
              >
                <div className="p-1 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors">
                  <Upload size={14} />
                </div>
                <span className="text-xs font-medium uppercase tracking-wider">Submit Photo</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-10 h-[1px] bg-black/10" />

        {hasItems ? (
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {items.map((item: GalleryItem, idx: number) => {
              const src = getImageUrl(item)
              if (!src) return null

              const uploader = getUploaderName(item)
              const uploadedAt = getUploadedAt(item)

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => NiceModal.show(GalleryItemModal, { item })}
                  className="group relative cursor-pointer overflow-hidden rounded-3xl bg-black/5 aspect-[3/4] shadow-sm hover:shadow-xl transition-all duration-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-black/60"
                >
                  <img
                    src={src}
                    alt={uploader}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="text-[14px] font-semibold uppercase tracking-[0.16em] text-white/80 line-clamp-1">
                      {uploader}
                    </div>
                    <div className="mt-1 text-[14px] text-white/70">{uploadedAt}</div>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          <div className="mt-16 flex flex-col items-center justify-center text-center text-black/50">
            <div className="text-2xl font-semibold">No photos yet</div>
            <p className="mt-2 max-w-[32ch] text-sm">
              Once the community starts uploading, their best moments will appear right here.
            </p>
          </div>
        )}
      </div>

    </div>
  )
}
