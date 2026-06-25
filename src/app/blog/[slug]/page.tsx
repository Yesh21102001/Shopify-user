'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Calendar, User, ArrowLeft, Tag } from 'lucide-react'
import { getBlogPost } from '@/lib/api'
import { formatDate } from '@/lib/utils'

interface Post {
  _id: string
  title: string
  slug: string
  excerpt: string
  body: string
  author: string
  image?: { url: string; alt: string }
  tags: string[]
  publishedAt: string
  createdAt: string
}

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBlogPost(slug)
      .then((data) => setPost(data || null))
      .catch(() => router.push('/blog'))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="container py-12 max-w-3xl">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-100 rounded w-3/4" />
          <div className="h-4 bg-gray-100 rounded w-1/2" />
          <div className="aspect-[16/9] bg-gray-100 rounded-xl" />
          <div className="space-y-3 mt-8">
            {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-gray-100 rounded" />)}
          </div>
        </div>
      </div>
    )
  }

  if (!post) return null

  return (
    <div className="container py-12 max-w-3xl">
      {/* Back */}
      <Link href="/blog" className="inline-flex items-center gap-2 text-sm text-subtext hover:text-black mb-8 transition-colors">
        <ArrowLeft size={16} />
        Back to Blog
      </Link>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="flex gap-2 mb-4">
          {post.tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-subtext bg-gray-100 px-2.5 py-1 rounded-full">
              <Tag size={11} />{tag}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-medium leading-tight mb-5">{post.title}</h1>

      {/* Meta */}
      <div className="flex items-center gap-5 text-sm text-subtext mb-8 pb-8 border-b border-border">
        <span className="flex items-center gap-1.5">
          <User size={15} />
          {post.author}
        </span>
        <span className="flex items-center gap-1.5">
          <Calendar size={15} />
          {formatDate(post.publishedAt || post.createdAt)}
        </span>
      </div>

      {/* Featured image */}
      {post.image?.url && (
        <div className="aspect-[16/9] overflow-hidden rounded-xl mb-10 bg-gray-100">
          <img src={post.image.url} alt={post.title} className="w-full h-full object-cover" />
        </div>
      )}

      {/* Excerpt */}
      {post.excerpt && (
        <p className="text-lg text-subtext leading-relaxed mb-8 italic border-l-4 border-border pl-5">{post.excerpt}</p>
      )}

      {/* Body */}
      <div
        className="prose max-w-none text-foreground leading-relaxed prose-headings:font-medium prose-a:text-black prose-a:underline"
        dangerouslySetInnerHTML={{ __html: post.body?.replace(/\n/g, '<br/>') || '' }}
      />

      {/* Footer */}
      <div className="mt-12 pt-8 border-t border-border flex items-center justify-between">
        <Link href="/blog" className="text-sm font-medium hover:underline flex items-center gap-2">
          <ArrowLeft size={15} />
          More Articles
        </Link>
      </div>
    </div>
  )
}
