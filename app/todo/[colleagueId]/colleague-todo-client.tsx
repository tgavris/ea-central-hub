'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { TodoBoard } from '@/components/todo-board'
import { PreferencesContent } from '@/components/preferences-content'
import { cn } from '@/lib/utils'
import { useTodo } from '@/lib/todo-context'
import { getColleagueById } from '@/lib/data/colleagues'

interface ColleagueTodoClientProps {
  colleagueId: string
}

export function ColleagueTodoClient({ colleagueId }: ColleagueTodoClientProps) {
  const colleague = getColleagueById(colleagueId)
  const { todos } = useTodo()
  const [search, setSearch] = useState('')
  const [activeTab, setActiveTab] = useState('insights')

  if (!colleague) {
    return <div>Colleague not found</div>
  }

  const collegeTodos = todos.filter(t => t.colleagueId === colleagueId && t.status !== 'done')
  const todoCount = collegeTodos.length
  const colleagueNameLower = colleague.name.toLowerCase().replace(' ', '-')

  const tabs = [
    { id: 'insights', label: 'Insights', count: todoCount },
    { id: 'teams', label: 'Teams' },
    { id: 'desk-notes', label: 'Desk Notes' },
    { id: 'preferences', label: 'Preferences' },
  ]

  return (
    <div className="flex flex-col h-full">
      <header className="sticky top-0 z-10 bg-background border-b">
        {/* Title row */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4">
          <h1 className="text-3xl font-bold text-foreground">
            {colleague.name}
          </h1>
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <Input
              placeholder="Search tasks"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 h-8 w-48 text-xs"
            />
          </div>
        </div>

        {/* Tabs row */}
        <div className="flex items-center justify-between px-6">
          <div className="flex items-center gap-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 py-3 text-sm border-b-2 -mb-px transition-colors',
                  activeTab === tab.id
                    ? 'border-foreground text-foreground font-medium'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                )}
              >
                {tab.label}
                {tab.count !== undefined && (
                  <span className={cn(
                    'text-xs px-1.5 py-0.5 rounded-full',
                    activeTab === tab.id
                      ? 'bg-foreground/10 text-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
          <Button size="sm" className="text-xs h-8 mb-px bg-[#2251FF] text-white hover:bg-[#2251FF]/90">
            Create EOD Summary
          </Button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6">
        {activeTab === 'insights' && (
          <TodoBoard viewBy="status" colleagueId={colleagueId} search={search} />
        )}
        {activeTab === 'teams' && (
          <div>
            <p className="text-muted-foreground">Teams content for {colleague.name} coming soon</p>
          </div>
        )}
        {activeTab === 'desk-notes' && (
          <div>
            <p className="text-muted-foreground">Desk Notes for {colleague.name} coming soon</p>
          </div>
        )}
        {activeTab === 'preferences' && (
          <PreferencesContent />
        )}
      </main>
    </div>
  )
}
