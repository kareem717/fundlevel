'use client'

import { useState, useEffect } from 'react'
import { useInView } from 'react-intersection-observer'
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"

interface InfiniteScrollAreaProps<T> {
  initialData: T[]
  fetchMore: () => Promise<T[]>
  renderItem: (item: T) => React.ReactNode
  height?: string
  loading?: boolean
}

export default function InfiniteScrollArea<T>({
  initialData,
  fetchMore,
  renderItem,
  height = 'h-[400px]',
  loading: initialLoading = false,
}: InfiniteScrollAreaProps<T>) {
  const [data, setData] = useState<T[]>(initialData)
  const [loading, setLoading] = useState(initialLoading)
  const [ref, inView] = useInView({
    threshold: 0,
  })

  useEffect(() => {
    if (inView && !loading) {
      loadMore()
    }
  }, [inView])

  const loadMore = async () => {
    setLoading(true)
    try {
      const newData = await fetchMore()
      setData((prevData) => [...prevData, ...newData])
    } catch (error) {
      console.error('Error fetching more data:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <ScrollArea className={`w-full ${height} rounded-md border`}>
      <div className="p-4">
        {data.map((item, index) => (
          <div key={index}>{renderItem(item)}</div>
        ))}
        <div ref={ref} className="h-10 flex items-center justify-center">
          {loading && <Loader2 className="h-6 w-6 animate-spin" />}
        </div>
      </div>
    </ScrollArea>
  )
}