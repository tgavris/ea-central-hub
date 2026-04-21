'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Plus, Mail, Calendar, Plane, FileText, AlertTriangle, X, Zap, Sparkles, ArrowRight, ArrowLeft, ExternalLink, ChevronDown, MoreHorizontal, Trash2, CheckCircle2, PenLine } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Insight, TodoItem, TodoStatus, TodoSpeed, TodoUrgency, TodoViewBy } from '@/lib/types'
import { useTodo } from '@/lib/todo-context'
import { InsightDetailBody } from '@/components/insight-detail-body'
import { colleagues } from '@/lib/data/colleagues'
import { insights } from '@/lib/data/insights'
import { getColleagueName } from '@/lib/data/colleagues'
import { formatDistanceToNow } from '@/lib/format-date'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface Column<T extends string> {
  id: T
  title: string
  dot: string
}

const statusColumns: Column<TodoStatus>[] = [
  { id: 'todo',        title: 'Insights',    dot: 'bg-blue-500' },
  { id: 'in-progress', title: 'In progress', dot: 'bg-amber-400' },
  { id: 'done',        title: 'Done',        dot: 'bg-emerald-500' },
  { id: 'snoozed',     title: 'Snoozed',     dot: 'bg-muted-foreground/40' },
]

const speedColumns: Column<TodoSpeed>[] = [
  { id: 'urgent',    title: 'Urgent',    dot: 'bg-red-500' },
  { id: 'soon',      title: 'Soon',      dot: 'bg-amber-400' },
  { id: 'whenever',  title: 'Whenever',  dot: 'bg-muted-foreground/40' },
]

const urgencyColumns: Column<TodoUrgency>[] = [
  { id: 'high',   title: 'High',   dot: 'bg-red-500' },
  { id: 'medium', title: 'Medium', dot: 'bg-amber-400' },
  { id: 'low',    title: 'Low',    dot: 'bg-muted-foreground/40' },
]

const TYPE_ICON = {
  email:    Mail,
  calendar: Calendar,
  travel:   Plane,
  document: FileText,
}

const TYPE_LABELS: Record<string, string> = {
  email:    'Email',
  calendar: 'Calendar',
  travel:   'Travel',
  document: 'Document',
}

// ─── Insight detail modal ────────────────────────────────────────────────────

function InsightModal({
  insight,
  onClose,
  onMoveTo,
}: {
  insight: Insight
  onClose: () => void
  onMoveTo: (status: TodoStatus, urgency: TodoUrgency, speed: TodoSpeed) => void
}) {
  const Icon = TYPE_ICON[insight.type] ?? FileText
  const colleagueName = getColleagueName(insight.colleagueId)

  const defaultUrgency: TodoUrgency =
    insight.urgency === 'urgent' ? 'high' : insight.badge ? 'medium' : 'low'
  const [selectedUrgency, setSelectedUrgency] = useState<TodoUrgency>(defaultUrgency)
  const [selectedSpeed, setSelectedSpeed] = useState<TodoSpeed>('medium')

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-xl max-h-[85vh] bg-background rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-5 pb-4 border-b shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              {insight.badge && (
                <div className="mb-2">
                  {insight.badge === 'Decision needed' && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded-full">
                      <Zap className="h-3 w-3" /> Decision needed
                    </span>
                  )}
                  {insight.badge === 'Predicted risk' && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium bg-muted text-muted-foreground border border-border px-2 py-0.5 rounded-full">
                      <Sparkles className="h-3 w-3" /> Predicted risk
                    </span>
                  )}
                </div>
              )}
              <h2 className="text-base font-semibold text-foreground leading-snug">{insight.title}</h2>
              <div className="flex items-center gap-1.5 mt-1.5 text-xs text-muted-foreground flex-wrap">
                <Icon className="h-3.5 w-3.5" />
                <span>{TYPE_LABELS[insight.type]}</span>
                <span className="opacity-40">·</span>
                <span>{insight.rule}</span>
                <span className="opacity-40">·</span>
                <span>{colleagueName}</span>
                <span className="opacity-40">·</span>
                <span>{formatDistanceToNow(insight.timestamp)}</span>
              </div>
            </div>
            <button onClick={onClose} className="shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          <InsightDetailBody insight={insight} />
        </div>

        <div className="px-6 py-4 border-t bg-muted/20 shrink-0 space-y-3">
          <div className="flex items-start gap-6">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Urgency</p>
              <div className="flex items-center gap-1">
                {([
                  { id: 'high',   label: 'High',   dot: 'bg-red-500' },
                  { id: 'medium', label: 'Medium',  dot: 'bg-amber-400' },
                  { id: 'low',    label: 'Low',     dot: 'bg-muted-foreground/40' },
                ] as { id: TodoUrgency; label: string; dot: string }[]).map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedUrgency(opt.id)}
                    className={cn(
                      'flex items-center gap-1.5 text-xs font-medium border rounded-md px-2.5 py-1 transition-colors',
                      selectedUrgency === opt.id
                        ? 'bg-muted text-foreground border-border'
                        : 'border-border text-muted-foreground hover:bg-muted'
                    )}
                  >
                    <span className={cn('h-1.5 w-1.5 rounded-full', selectedUrgency === opt.id ? opt.dot : 'bg-muted-foreground/30')} />
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Speed</p>
              <div className="flex items-center gap-1">
                {([
                  { id: 'quick',  label: 'Quick' },
                  { id: 'medium', label: 'Medium' },
                  { id: 'long',   label: 'Long' },
                ] as { id: TodoSpeed; label: string }[]).map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSelectedSpeed(opt.id)}
                    className={cn(
                      'text-xs font-medium border rounded-md px-2.5 py-1 transition-colors',
                      selectedSpeed === opt.id
                        ? 'bg-muted text-foreground border-border'
                        : 'border-border text-muted-foreground hover:bg-muted'
                    )}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Move to</p>
            <div className="flex items-center gap-2">
              {([
                { id: 'in-progress', label: 'In progress' },
                { id: 'done',        label: 'Done' },
                { id: 'snoozed',     label: 'Snoozed' },
              ] as { id: TodoStatus; label: string }[]).map((col) => (
                <button
                  key={col.id}
                  onClick={() => { onMoveTo(col.id, selectedUrgency, selectedSpeed); onClose() }}
                  className="flex items-center gap-1.5 text-xs font-medium border border-border rounded-md px-3 py-1.5 hover:bg-muted transition-colors"
                >
                  <ArrowRight className="h-3 w-3" />
                  {col.label}
                </button>
              ))}
              <Link
                href={`/insights/${insight.colleagueId}/${insight.id}`}
                className="ml-auto text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
              >
                Full detail <ExternalLink className="h-3 w-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Todo detail modal ────────────────────────────────────────────────────────

function TodoModal({
  todo,
  onClose,
  onMoveTo,
}: {
  todo: TodoItem
  onClose: () => void
  onMoveTo: (status: TodoStatus) => void
}) {
  const colleagueName = getColleagueName(todo.colleagueId)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div
        className="relative z-10 w-full max-w-xl max-h-[85vh] bg-background rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 pt-5 pb-4 border-b shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap mb-1.5">
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{colleagueName}</span>
              </div>
              <h2 className="text-base font-semibold text-foreground leading-snug">{todo.title}</h2>
            </div>
            <button onClick={onClose} className="shrink-0 p-1.5 rounded-lg hover:bg-muted transition-colors text-muted-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5">
          {todo.description && (
            <div className="rounded-lg border bg-card px-4 py-3 space-y-1.5">
              <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                Context
              </p>
              <p className="text-sm text-foreground leading-relaxed">{todo.description}</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t bg-muted/20 shrink-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground mb-1.5">Move to</p>
          <div className="flex items-center gap-2">
            {([
              { id: 'todo',        label: 'Insights' },
              { id: 'in-progress', label: 'In progress' },
              { id: 'done',        label: 'Done' },
              { id: 'snoozed',     label: 'Snoozed' },
            ] as { id: TodoStatus; label: string }[])
              .filter((col) => col.id !== todo.status)
              .map((col) => (
                <button
                  key={col.id}
                  onClick={() => onMoveTo(col.id)}
                  className="flex items-center gap-1.5 text-xs font-medium border border-border rounded-md px-3 py-1.5 hover:bg-muted transition-colors"
                >
                  <ArrowRight className="h-3 w-3" />
                  {col.label}
                </button>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── List row ─────────────────────────────────────────────────────────────────

function TodoListRow({
  todo,
  onClick,
  onRemove,
  onStatusChange,
  hideColleagueName = false,
  showMoveToDone = false,
  onBackToInsights,
}: {
  todo: TodoItem
  onClick: () => void
  onRemove: (id: string) => void
  onStatusChange: (id: string, status: TodoStatus) => void
  hideColleagueName?: boolean
  showMoveToDone?: boolean
  onBackToInsights?: () => void
}) {
  const colleagueName = getColleagueName(todo.colleagueId)
  const isDone = todo.status === 'done'

  return (
    <div
      className="group flex items-center gap-3 px-4 py-2.5 hover:bg-muted/40 transition-colors border-b border-border/50 last:border-b-0 cursor-pointer"
      onClick={onClick}
    >
      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          onStatusChange(todo.id, isDone ? 'todo' : 'done')
        }}
        className={cn(
          'shrink-0 h-4 w-4 rounded-full border-2 transition-colors flex items-center justify-center',
          isDone
            ? 'bg-emerald-500 border-emerald-500'
            : 'border-border hover:border-foreground/50'
        )}
        aria-label={isDone ? 'Mark incomplete' : 'Mark complete'}
      >
        {isDone && (
          <svg viewBox="0 0 10 8" fill="none" className="h-2.5 w-2.5">
            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      {/* Title */}
      <span className={cn('flex-1 text-sm text-foreground truncate', isDone && 'line-through text-muted-foreground')}>
        {todo.title}
      </span>

      {/* Tags */}
      <div className="hidden md:flex items-center gap-1.5 shrink-0">
        {!hideColleagueName && (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {colleagueName}
          </span>
        )}
        <span className={cn(
          'text-xs px-2 py-0.5 rounded-full capitalize',
          todo.urgency === 'high' && 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400',
          todo.urgency === 'medium' && 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400',
          todo.urgency === 'low' && 'bg-muted text-muted-foreground',
        )}>
          {todo.urgency}
        </span>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full capitalize">
          {todo.speed}
        </span>
      </div>

      {/* Date */}
      <span className="hidden lg:block text-xs text-muted-foreground shrink-0 w-24 text-right">
        {formatDistanceToNow(todo.createdAt)}
      </span>

      {/* In-progress action buttons */}
      {(showMoveToDone || onBackToInsights) && (
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          {onBackToInsights && (
            <button
              onClick={(e) => { e.stopPropagation(); onBackToInsights() }}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 px-2 py-1 rounded transition-colors"
            >
              <ArrowLeft className="h-3 w-3" />
              Back
            </button>
          )}
          {showMoveToDone && (
            <button
              onClick={(e) => { e.stopPropagation(); onStatusChange(todo.id, 'done') }}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 px-2 py-1 rounded transition-colors"
            >
              <CheckCircle2 className="h-3 w-3" />
              Done
            </button>
          )}
        </div>
      )}

      {/* Three-dot menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 shrink-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={(e) => { e.stopPropagation(); onRemove(todo.id) }}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Remove
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}

function InsightListRow({
  insight,
  onClick,
  hideColleagueName = false,
  onMoveToInProgress,
  onMoveToDone,
}: {
  insight: Insight
  onClick: () => void
  hideColleagueName?: boolean
  onMoveToInProgress?: () => void
  onMoveToDone?: () => void
}) {
  const colleagueName = getColleagueName(insight.colleagueId)
  const Icon = TYPE_ICON[insight.type] ?? FileText

  return (
    <div
      className="group flex items-start gap-3 px-4 py-2.5 hover:bg-muted/40 transition-colors border-b border-border/50 last:border-b-0 cursor-pointer"
      onClick={onClick}
    >
      {/* Icon circle */}
      <div className="shrink-0 mt-1 h-4 w-4 rounded-full border-2 border-border flex items-center justify-center">
        <Icon className="h-2 w-2 text-muted-foreground" />
      </div>

      {/* Origin icon */}
      {insight.origin === 'ai' && (
        <Sparkles className="h-3.5 w-3.5 text-violet-400 shrink-0 mt-0.5" aria-label="AI generated" />
      )}
      {insight.origin === 'manual' && (
        <PenLine className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" aria-label="Manual task" />
      )}

      {/* Title + description */}
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-foreground">{insight.title}</span>
        {insight.description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{insight.description}</p>
        )}
      </div>

      {/* Tags */}
      <div className="hidden md:flex items-center gap-1.5 shrink-0">
        {!hideColleagueName && (
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {colleagueName}
          </span>
        )}
        {insight.badge && (
          <span className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-full flex items-center gap-1">
            {insight.badge === 'Decision needed' && <Zap className="h-2.5 w-2.5" />}
            {insight.badge === 'Predicted risk' && <Sparkles className="h-2.5 w-2.5" />}
            {insight.badge}
          </span>
        )}
        {insight.urgency === 'urgent' && !insight.badge && (
          <span className="text-xs bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400 px-2 py-0.5 rounded-full flex items-center gap-1">
            <AlertTriangle className="h-2.5 w-2.5" />
            Urgent
          </span>
        )}
      </div>

      {/* Date */}
      <span className="hidden lg:block text-xs text-muted-foreground shrink-0 w-24 text-right pt-0.5">
        {formatDistanceToNow(insight.timestamp)}
      </span>

      {/* Action buttons */}
      <div className="flex items-center gap-1 shrink-0 pt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        {onMoveToInProgress && (
          <button
            onClick={(e) => { e.stopPropagation(); onMoveToInProgress() }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 px-2 py-1 rounded transition-colors"
          >
            <ArrowRight className="h-3 w-3" />
            In Progress
          </button>
        )}
        {onMoveToDone && (
          <button
            onClick={(e) => { e.stopPropagation(); onMoveToDone() }}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground bg-muted hover:bg-muted/80 px-2 py-1 rounded transition-colors"
          >
            <CheckCircle2 className="h-3 w-3" />
            Done
          </button>
        )}
      </div>
    </div>
  )
}

// ─── Collapsible section ──────────────────────────────────────────────────────

function Section({
  title,
  dot,
  count,
  children,
  defaultOpen = true,
  footer,
}: {
  title: string
  dot: string
  count: number
  children: React.ReactNode
  defaultOpen?: boolean
  footer?: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)

  return (
    <div className="border border-border rounded-lg overflow-hidden">
      {/* Section header */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3 bg-background hover:bg-muted/30 transition-colors"
      >
        <div className="flex items-center gap-2.5">
          <span className={cn('h-2 w-2 rounded-full shrink-0', dot)} />
          <span className="text-sm font-medium text-foreground">{title}</span>
          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded-full leading-none">
            {count}
          </span>
        </div>
        <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', open && 'rotate-180')} />
      </button>

      {/* Items */}
      {open && (
        <div className="bg-background">
          {count === 0 ? (
            <p className="px-4 py-6 text-sm text-muted-foreground text-center">No items</p>
          ) : (
            children
          )}
          {footer && <div className="px-4 py-2 border-t border-border/50">{footer}</div>}
        </div>
      )}
    </div>
  )
}

// ─── Main board ───────────────────────────────────────────────────────────────

interface TodoBoardProps {
  viewBy: TodoViewBy
  colleagueId?: string
}

export function TodoBoard({ viewBy, colleagueId }: TodoBoardProps) {
  const { todos, updateTodoStatus, addTodo, removeTodo } = useTodo()
  const [modalInsight, setModalInsight] = useState<Insight | null>(null)
  const [modalTodo, setModalTodo] = useState<TodoItem | null>(null)
  const [addingTask, setAddingTask] = useState(false)
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [newTaskColleagueId, setNewTaskColleagueId] = useState(colleagueId ?? 'personal')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (addingTask) inputRef.current?.focus()
  }, [addingTask])

  const handleTodoCardClick = (todo: TodoItem) => {
    if (todo.source === 'insight') {
      const linked = insights.find((i) => i.id === todo.sourceId)
      if (linked) { setModalInsight(linked); return }
    }
    setModalTodo(todo)
  }

  const handleAddTask = () => {
    const title = newTaskTitle.trim()
    if (!title) { setAddingTask(false); return }
    addTodo({
      title,
      description: '',
      colleagueId: newTaskColleagueId,
      source: 'inbox',
      sourceId: `manual-${Date.now()}`,
      status: 'todo',
      speed: 'medium',
      urgency: 'medium',
      metadata: {},
    })
    setNewTaskTitle('')
    setAddingTask(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAddTask()
    if (e.key === 'Escape') { setNewTaskTitle(''); setAddingTask(false) }
  }

  const addInsightAsTodo = (insight: Insight, status: TodoStatus, urgency: TodoUrgency, speed: TodoSpeed) => {
    const existing = todos.find((t) => t.source === 'insight' && t.sourceId === insight.id)
    if (existing) { updateTodoStatus(existing.id, status); return }
    addTodo({
      colleagueId: insight.colleagueId,
      title: insight.title,
      description: insight.description,
      source: 'insight',
      sourceId: insight.id,
      status,
      speed,
      urgency,
      metadata: { type: insight.type, rule: insight.rule },
    })
  }

  const filteredTodos = colleagueId ? todos.filter((t) => t.colleagueId === colleagueId) : todos

  const getTodosByStatus = (status: TodoStatus) =>
    filteredTodos.filter((t) => t.status === status)

  const getTodosBySpeed = (speed: TodoSpeed) =>
    filteredTodos.filter((t) => t.speed === speed)

  const getTodosByUrgency = (urgency: TodoUrgency) =>
    filteredTodos.filter((t) => t.urgency === urgency)

  // Raw insights not yet converted
  const todoInsightIds = new Set(todos.filter((t) => t.source === 'insight').map((t) => t.sourceId))
  const columnInsights = (colleagueId
    ? insights.filter((i) => i.colleagueId === colleagueId)
    : insights
  ).filter((i) => !todoInsightIds.has(i.id))

  const queuedTodos = getTodosByStatus('todo')

  // Render columns for speed / urgency views
  const renderSimpleColumns = <T extends string>(cols: Column<T>[], getItems: (id: T) => TodoItem[]) =>
    cols.map((col) => {
      const items = getItems(col.id)
      return (
        <Section key={col.id} title={col.title} dot={col.dot} count={items.length}>
          {items.map((todo) => (
            <TodoListRow
              key={todo.id}
              todo={todo}
              onClick={() => handleTodoCardClick(todo)}
              onRemove={removeTodo}
              onStatusChange={updateTodoStatus}
              hideColleagueName={!!colleagueId}
            />
          ))}
        </Section>
      )
    })

  return (
    <div className="space-y-3">
      {viewBy === 'status' && (
        <>
          {/* Insights section (todo status) */}
          <Section
            title="Insights"
            dot="bg-blue-500"
            count={queuedTodos.length + columnInsights.length}
            footer={
              <div>
                {addingTask ? (
                  <div className="space-y-2 py-1">
                    <input
                      ref={inputRef}
                      value={newTaskTitle}
                      onChange={(e) => setNewTaskTitle(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Task title..."
                      className="w-full text-sm bg-transparent outline-none placeholder:text-muted-foreground"
                    />
                    {!colleagueId && (
                      <select
                        value={newTaskColleagueId}
                        onChange={(e) => setNewTaskColleagueId(e.target.value)}
                        className="w-full text-xs bg-muted rounded px-2 py-1 text-foreground outline-none"
                      >
                        {colleagues.map((c) => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    )}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleAddTask}
                        className="text-xs font-medium bg-foreground text-background px-2.5 py-1 rounded hover:opacity-80 transition-opacity"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => { setNewTaskTitle(''); setAddingTask(false) }}
                        className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setAddingTask(true)}
                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors py-0.5"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Add task
                  </button>
                )}
              </div>
            }
          >
            {queuedTodos.map((todo) => (
              <TodoListRow
                key={todo.id}
                todo={todo}
                onClick={() => handleTodoCardClick(todo)}
                onRemove={removeTodo}
                onStatusChange={updateTodoStatus}
                hideColleagueName={!!colleagueId}
              />
            ))}
            {queuedTodos.length > 0 && columnInsights.length > 0 && (
              <div className="flex items-center gap-2 px-4 py-1.5">
                <hr className="flex-1 border-border" />
                <span className="text-[10px] text-muted-foreground shrink-0">All insights</span>
                <hr className="flex-1 border-border" />
              </div>
            )}
            {columnInsights.map((insight) => (
              <InsightListRow
                key={insight.id}
                insight={insight}
                onClick={() => setModalInsight(insight)}
                hideColleagueName={!!colleagueId}
                onMoveToInProgress={() => addInsightAsTodo(insight, 'in-progress', 'medium', 'medium')}
                onMoveToDone={() => addInsightAsTodo(insight, 'done', 'medium', 'medium')}
              />
            ))}
          </Section>

          {/* In progress */}
          {(() => {
            const items = getTodosByStatus('in-progress')
            return (
              <Section title="In progress" dot="bg-amber-400" count={items.length}>
                {items.map((todo) => (
                  <TodoListRow
                    key={todo.id}
                    todo={todo}
                    onClick={() => handleTodoCardClick(todo)}
                    onRemove={removeTodo}
                    onStatusChange={updateTodoStatus}
                    hideColleagueName={!!colleagueId}
                    showMoveToDone
                    onBackToInsights={() => removeTodo(todo.id)}
                  />
                ))}
              </Section>
            )
          })()}

          {/* Done */}
          {(() => {
            const items = getTodosByStatus('done')
            return (
              <Section title="Done" dot="bg-emerald-500" count={items.length} defaultOpen={false}>
                {items.map((todo) => (
                  <TodoListRow
                    key={todo.id}
                    todo={todo}
                    onClick={() => handleTodoCardClick(todo)}
                    onRemove={removeTodo}
                    onStatusChange={updateTodoStatus}
                    hideColleagueName={!!colleagueId}
                  />
                ))}
              </Section>
            )
          })()}

          {/* Snoozed */}
          {(() => {
            const items = getTodosByStatus('snoozed')
            return (
              <Section title="Snoozed" dot="bg-muted-foreground/40" count={items.length} defaultOpen={false}>
                {items.map((todo) => (
                  <TodoListRow
                    key={todo.id}
                    todo={todo}
                    onClick={() => handleTodoCardClick(todo)}
                    onRemove={removeTodo}
                    onStatusChange={updateTodoStatus}
                    hideColleagueName={!!colleagueId}
                  />
                ))}
              </Section>
            )
          })()}
        </>
      )}

      {viewBy === 'speed' && renderSimpleColumns(speedColumns, getTodosBySpeed)}
      {viewBy === 'urgency' && renderSimpleColumns(urgencyColumns, getTodosByUrgency)}

      {/* Modals */}
      {modalInsight && (
        <InsightModal
          insight={modalInsight}
          onClose={() => setModalInsight(null)}
          onMoveTo={(status, urgency, speed) => addInsightAsTodo(modalInsight, status, urgency, speed)}
        />
      )}
      {modalTodo && (
        <TodoModal
          todo={modalTodo}
          onClose={() => setModalTodo(null)}
          onMoveTo={(status) => { updateTodoStatus(modalTodo.id, status); setModalTodo(null) }}
        />
      )}
    </div>
  )
}
