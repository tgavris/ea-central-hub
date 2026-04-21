'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface InsightsHeaderProps {
  colleagueName?: string
  insightCount?: number
  todoCount?: number
}

export function InsightsHeader({ colleagueName, insightCount, todoCount = 0 }: InsightsHeaderProps) {
  const pathname = usePathname()
  const title = colleagueName ? `Insights for ${colleagueName}` : 'All Insights'
  
  const tabs = [
    { label: 'Insights', href: '/todo', count: todoCount },
  ]

  const isActive = (href: string) => pathname === '/todo' || pathname.startsWith('/todo/')

  return (
    <header className="sticky top-0 z-10 bg-background border-b">
      {/* H1 - matches left nav selection */}
      <div className="px-6 pt-5 pb-0">
        <h1 className="text-3xl font-bold text-foreground mb-6">
          {colleagueName || 'All Insights'}
        </h1>
      </div>
      
      {/* Tabs */}
      <div className="flex items-center gap-6 px-6">
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={cn(
              'flex items-center gap-2 py-3 text-sm border-b-2 -mb-px transition-colors',
              isActive(tab.href)
                ? 'border-foreground text-foreground font-medium'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {tab.label}
            {tab.count !== undefined && (
              <span className={cn(
                'text-xs px-1.5 py-0.5 rounded-full',
                isActive(tab.href) 
                  ? 'bg-foreground/10 text-foreground' 
                  : 'bg-muted text-muted-foreground'
              )}>
                {tab.count}
              </span>
            )}
          </Link>
        ))}
      </div>
    </header>
  )
}
