'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, ArrowRight } from 'lucide-react'
import { getBlogPosts } from '@/lib/api'
import { formatDate, truncate } from '@/lib/utils'

interface Post {
  _id: string
  title: string
  slug: string
  excerpt: string
  author: string
  image?: { url: string; alt: string }
  tags: string[]
  publishedAt?: string
  createdAt: string
}

export default function BlogPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getBlogPosts()
      .then((data) => setPosts(Array.isArray(data) ? data : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false))
  }, [])

  const mainPost = posts[0]
  const restPosts = posts.slice(1)

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-medium mb-3">Our Blog</h1>
        <p className="text-subtext max-w-xl mx-auto">Style tips, fashion trends, and behind-the-scenes stories from our team.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[16/10] bg-gray-100 rounded-lg mb-4" />
              <div className="h-3 bg-gray-100 rounded w-1/4 mb-3" />
              <div className="h-5 bg-gray-100 rounded mb-2" />
              <div className="h-4 bg-gray-100 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 text-subtext">No posts published yet.</div>
      ) : (
        <>
          {/* Featured post */}
          {mainPost && (
            <Link href={`/blog/${mainPost.slug}`} className="group block mb-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={mainPost.image?.url || `https://placehold.co/800x600/f5f5f5/999?text=${encodeURIComponent(mainPost.title)}`}
                    alt={mainPost.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8 flex flex-col justify-center">
                  {mainPost.tags?.[0] && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-subtext mb-3">{mainPost.tags[0]}</span>
                  )}
                  <h2 className="text-2xl font-medium mb-4 group-hover:underline">{mainPost.title}</h2>
                  <p className="text-subtext mb-5 leading-relaxed">{truncate(mainPost.excerpt || '', 150)}</p>
                  <div className="flex items-center gap-4 text-sm text-subtext">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {formatDate(mainPost.publishedAt || mainPost.createdAt)}
                    </span>
                    <span>By {mainPost.author}</span>
                  </div>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-black hover:gap-3 transition-all">
                    Read More <ArrowRight size={16} />
                  </span>
                </div>
              </div>
            </Link>
          )}

          {/* Rest of posts */}
          {restPosts.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {restPosts.map((post) => (
                <Link key={post._id} href={`/blog/${post.slug}`} className="group">
                  <div className="aspect-[16/10] overflow-hidden rounded-lg bg-gray-100 mb-4">
                    <img
                      src={post.image?.url || `https://placehold.co/600x375/f5f5f5/999?text=${encodeURIComponent(post.title)}`}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  {post.tags?.[0] && (
                    <span className="text-xs font-semibold uppercase tracking-wider text-subtext mb-2 block">{post.tags[0]}</span>
                  )}
                  <h3 className="font-medium text-base mb-2 group-hover:underline leading-snug">{post.title}</h3>
                  <p className="text-sm text-subtext mb-3 leading-relaxed">{truncate(post.excerpt || '', 100)}</p>
                  <div className="flex items-center gap-3 text-xs text-subtext">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {formatDate(post.publishedAt || post.createdAt)}
                    </span>
                    <span>By {post.author}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
