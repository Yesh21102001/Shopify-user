'use client'

import { useEffect, useState } from 'react'
import { Provider } from 'react-redux'
import { store } from '@/store'

export { store }

export function StoreProvider({ children }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return <>{children}</>
  }

  return <Provider store={store}>{children}</Provider>
}

export default function Providers({ children }) {
  return <StoreProvider>{children}</StoreProvider>
}
