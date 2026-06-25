interface StarRatingProps {
  rating: number
  count?: number
  showCount?: boolean
  size?: number
}

export default function StarRating({ rating, count = 0, showCount = true, size = 16 }: StarRatingProps) {
  const stars = Array.from({ length: 5 }, (_, i) => {
    const filled = i + 1 <= Math.floor(rating)
    const half = !filled && i < rating && rating - i >= 0.5
    return { filled, half }
  })

  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {stars.map((star, i) => (
          <svg
            key={i}
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {star.half ? (
              <defs>
                <linearGradient id={`half-${i}`}>
                  <stop offset="50%" stopColor="#FBBF24" />
                  <stop offset="50%" stopColor="#D1D5DB" />
                </linearGradient>
              </defs>
            ) : null}
            <polygon
              points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
              fill={
                star.filled
                  ? '#FBBF24'
                  : star.half
                  ? `url(#half-${i})`
                  : '#D1D5DB'
              }
              stroke={star.filled || star.half ? '#FBBF24' : '#D1D5DB'}
              strokeWidth="1"
            />
          </svg>
        ))}
      </div>
      {showCount && (
        <span className="text-sm text-gray-500">
          ({count} {count === 1 ? 'review' : 'reviews'})
        </span>
      )}
    </div>
  )
}
