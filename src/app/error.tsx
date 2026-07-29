'use client'

import { Button } from '@/components/ui'
import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
      <h2 className="text-2xl font-bold">خطایی رخ داده است!</h2>
      <p className="text-muted-foreground">{error.message || 'لطفاً دوباره تلاش کنید'}</p>
      <Button onClick={reset}>تلاش مجدد</Button>
    </div>
  )
}