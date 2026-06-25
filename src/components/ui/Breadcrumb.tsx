import Link from 'next/link'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

export default function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-sm text-gray-500">
      {items.map((item, index) => {
        const isLast = index === items.length - 1
        return (
          <span key={index} className="flex items-center gap-1.5">
            {index > 0 && <span className="text-gray-300">/</span>}
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-black transition">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? 'text-black font-medium' : ''}>{item.label}</span>
            )}
          </span>
        )
      })}
    </nav>
  )
}
