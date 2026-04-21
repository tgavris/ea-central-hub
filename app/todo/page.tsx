'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TodoBoard } from '@/components/todo-board'
import { useTodo } from '@/lib/todo-context'
import { insights } from '@/lib/data/insights'

export default function TodoPage() {
  const { todos } = useTodo()
  const [search, setSearch] = useState('')

  const todoInsightIds = new Set(todos.filter(t => t.source === 'insight').map(t => t.sourceId))
  const pendingInsights = insights.filter(i => !todoInsightIds.has(i.id))
  const queuedTodos = todos.filter(t => t.status === 'todo')
  const todoCount = queuedTodos.length + pendingInsights.length

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-background border-b">
        {/* Title row */}
        <div className="px-6 pt-5 pb-4">
          <h1 className="text-3xl font-bold text-foreground">
            All Insights
          </h1>
        </div>

        {/* Search and action row */}
        <div className="flex items-center justify-between px-6 pb-4">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="h-8 pl-8 pr-3 text-xs w-44 border-input/60 bg-muted/60 placeholder:text-muted-foreground/70"
            />
          </div>
          <Button size="sm" className="text-xs h-8 bg-[#2251FF] text-white hover:bg-[#2251FF]/90">
            Create EOD Summary
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-y-auto p-6">
        <TodoBoard viewBy="status" search={search} />
      </main>
    </div>
  )
}
