import { cn } from '@/lib/utils'

interface BadgeProps {
  variant: 'sale' | 'new' | 'hot'
  children: React.ReactNode
  className?: string
}

export default function Badge({ variant, children, className }: BadgeProps) {
  const variants = {
    sale: 'bg-[#da3f3f] text-white',
    new: 'bg-[#64bf99] text-white',
    hot: 'bg-orange-500 text-white',
  }

  return (
    <span
      className={cn(
        'absolute top-2 left-2 text-xs font-medium px-2 py-0.5 rounded-full z-10',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
