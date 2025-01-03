'use client'

import { ComponentPropsWithoutRef, FC } from 'react'
import { BlogCategory } from '@/payload-types'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import { useQueryStates } from 'nuqs'
import { blogFiltersParsers } from './searchParams'
import { cn } from '@/lib/utils'

export interface BlogFiltersProps extends ComponentPropsWithoutRef<'div'> {
  categories: BlogCategory[]
}

export const BlogFilters: FC<BlogFiltersProps> = ({
  categories,
  className,
  ...props
}) => {
  const [{ category: currentCategory }, setCurrentCategory] =
    useQueryStates(blogFiltersParsers)

  return (
    <div className={cn('', className)} {...props}>
      <div className="hidden md:flex flex-wrap gap-3">
        <Button
          onClick={() => setCurrentCategory({ category: 'all' })}
          className={clsx(
            'px-6 py-2 text-sm font-medium transition-all duration-200 rounded-full hover:shadow-lg',
            currentCategory === 'all'
              ? 'bg-primary text-white shadow-md hover:bg-primary/90'
              : 'bg-secondary/10 text-secondary-foreground hover:bg-secondary/20'
          )}
          variant="ghost"
        >
          All Posts
        </Button>

        {categories.map((category) => (
          <Button
            key={category.id}
            onClick={() => setCurrentCategory({ category: category.slug })}
            className={clsx(
              'px-6 py-2 text-sm font-medium transition-all duration-200 rounded-full hover:shadow-lg',
              currentCategory === category.slug
                ? 'bg-primary text-white shadow-md hover:bg-primary/90'
                : 'bg-secondary/10 text-secondary-foreground hover:bg-secondary/20'
            )}
            variant="ghost"
          >
            {category.title}
          </Button>
        ))}
      </div>

      <div className="md:hidden">
        <Select
          onValueChange={(value) => setCurrentCategory({ category: value })}
          defaultValue="all"
        >
          <SelectTrigger className="w-full bg-secondary/10 border-0 rounded-full">
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent className="rounded-lg border-secondary/20">
            <SelectItem value="all">All Posts</SelectItem>
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.slug ?? ''}>
                {category.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
