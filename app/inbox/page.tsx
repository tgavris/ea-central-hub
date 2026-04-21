'use client'

import { useState, useRef } from 'react'
import { Search, RefreshCw, Plus, Check, ChevronDown, Hash, MessageSquare, User, Upload, ImageIcon, FileText, Clock, Tag } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { getAllInboxItemsSorted, inboxItems } from '@/lib/data/inbox'
import { getColleagueName } from '@/lib/data/colleagues'
import { formatDistanceToNow } from '@/lib/format-date'
import { useTodo } from '@/lib/todo-context'
import type { InboxItem } from '@/lib/types'

// ─── Tab counts ───────────────────────────────────────────────────────────────

const SLACK_THREAD_COUNT = 5
const CLIPPINGS_COUNT = 5

function getEmailUnreadCount() {
  return inboxItems.filter(item => item.unread).length
}

// ─── Tab definitions ──────────────────────────────────────────────────────────

type TabId = 'email' | 'slack' | 'clippings'

const tabs: { id: TabId; label: string; getCount: () => number }[] = [
  { id: 'email', label: 'Email', getCount: getEmailUnreadCount },
  { id: 'slack', label: 'Slack', getCount: () => SLACK_THREAD_COUNT },
  { id: 'clippings', label: 'Clippings', getCount: () => CLIPPINGS_COUNT },
]

// ─── Main Inbox Page ──────────────────────────────────────────────────────────

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState<TabId>('email')

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header with tabs */}
      <div className="border-b bg-background shrink-0">
        <div className="px-6 pt-4 pb-0">
          <h1 className="text-lg font-semibold text-foreground mb-4">Inbox</h1>
          
          {/* Tab bar */}
          <div className="flex gap-6">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id
              const count = tab.getCount()
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'flex items-center gap-2 pb-3 border-b-2 transition-colors',
                    isActive
                      ? 'border-foreground'
                      : 'border-transparent hover:border-muted-foreground/30'
                  )}
                >
                  <span
                    className={cn(
                      'text-sm',
                      isActive ? 'font-semibold text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {tab.label}
                  </span>
                  <span
                    className={cn(
                      'text-xs px-2 py-0.5 rounded-full',
                      isActive
                        ? 'bg-muted text-foreground font-medium'
                        : 'bg-muted text-muted-foreground'
                    )}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'email' && <EmailTab />}
        {activeTab === 'slack' && <SlackTab />}
        {activeTab === 'clippings' && <ClippingsTab />}
      </div>
    </div>
  )
}

// ─── Email Tab ────────────────────────────────────────────────────────────────

function EmailTab() {
  const allItems = getAllInboxItemsSorted()
  const [selected, setSelected] = useState<InboxItem>(allItems[0])
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  const filtered = allItems.filter((item) => {
    const matchesSearch =
      search === '' ||
      item.subject.toLowerCase().includes(search.toLowerCase()) ||
      item.fromName.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'all' || (filter === 'unread' && item.unread)
    return matchesSearch && matchesFilter
  })

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Search and filter bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b bg-background shrink-0">
        <div className="relative flex-1 max-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
          <Input
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-7 text-xs bg-muted border-0 focus-visible:ring-1"
          />
        </div>
        <div className="flex gap-1">
          {(['all', 'unread'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                'px-2.5 py-1 rounded text-xs font-medium transition-colors capitalize',
                filter === f
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <button className="ml-auto p-1 rounded hover:bg-muted transition-colors text-muted-foreground">
          <RefreshCw className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left pane - list */}
        <div className="w-80 shrink-0 flex flex-col border-r bg-background">
          <div className="flex-1 overflow-y-auto">
            {filtered.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelected(item)}
                className={cn(
                  'w-full text-left px-4 py-3 border-b border-border/50 transition-colors',
                  selected?.id === item.id ? 'bg-muted' : 'hover:bg-muted/50'
                )}
              >
                <div className="flex items-start justify-between gap-2 mb-0.5">
                  <span
                    className={cn(
                      'text-xs truncate',
                      item.unread ? 'font-semibold text-foreground' : 'font-medium text-muted-foreground'
                    )}
                  >
                    {item.fromName}
                  </span>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {formatDistanceToNow(item.timestamp)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 mb-1">
                  {item.unread && <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />}
                  <p
                    className={cn(
                      'text-xs truncate',
                      item.unread ? 'font-medium text-foreground' : 'text-muted-foreground'
                    )}
                  >
                    {item.subject}
                  </p>
                </div>
                <p className="text-[11px] text-muted-foreground truncate leading-relaxed">{item.preview}</p>
              </button>
            ))}

            {filtered.length === 0 && (
              <div className="py-12 text-center text-xs text-muted-foreground">No messages found</div>
            )}
          </div>
        </div>

        {/* Right pane - thread */}
        {selected ? (
          <EmailThreadPane item={selected} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground">
            Select a message to read
          </div>
        )}
      </div>
    </div>
  )
}

function formatFullDate(date: Date) {
  return date.toLocaleDateString('en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function EmailThreadPane({ item }: { item: InboxItem }) {
  const { addTodo, isTodoAdded } = useTodo()
  const isAdded = isTodoAdded(item.id)
  const colleagueName = getColleagueName(item.colleagueId)

  const handleAddTodo = () => {
    if (isAdded) return
    addTodo({
      colleagueId: item.colleagueId,
      title: item.subject,
      description: item.preview,
      source: 'inbox',
      sourceId: item.id,
      status: 'todo',
      metadata: { from: item.from, timestamp: item.timestamp },
    })
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-background">
      {/* Thread header */}
      <div className="px-6 py-4 border-b shrink-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h2 className="text-base font-semibold text-foreground leading-snug mb-1 text-balance">
              {item.subject}
            </h2>
            <Badge variant="secondary" className="text-xs font-normal">
              {colleagueName}
            </Badge>
          </div>
          <Button
            size="sm"
            variant={isAdded ? 'secondary' : 'outline'}
            onClick={handleAddTodo}
            disabled={isAdded}
            className="shrink-0 text-xs"
          >
            {isAdded ? (
              <>
                <Check className="h-3.5 w-3.5 mr-1.5" />
                Added to To-do
              </>
            ) : (
              <>
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add to To-do
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {item.thread.map((msg) => (
          <EmailMessageBubble key={msg.id} msg={msg} />
        ))}
      </div>
    </div>
  )
}

function EmailMessageBubble({ msg }: { msg: InboxItem['thread'][number] }) {
  const [expanded, setExpanded] = useState(true)

  return (
    <div className="rounded-xl border border-border/60 bg-card overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 hover:bg-muted/30 transition-colors"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-7 w-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-semibold shrink-0">
            {msg.fromName.charAt(0)}
          </div>
          <div className="text-left min-w-0">
            <span className="text-xs font-semibold text-foreground">{msg.fromName}</span>
            <span className="text-xs text-muted-foreground ml-2">{msg.from}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[11px] text-muted-foreground">{formatFullDate(msg.timestamp)}</span>
          <ChevronDown
            className={cn('h-3.5 w-3.5 text-muted-foreground transition-transform', !expanded && '-rotate-90')}
          />
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 pt-0">
          <div className="pl-10">
            <p className="text-sm text-foreground leading-relaxed whitespace-pre-line">{msg.body}</p>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Slack Tab ────────────────────────────────────────────────────────────────

type Reaction = { emoji: string; count: number }

type SlackMessage = {
  id: string
  author: string
  initials: string
  avatarColor: string
  time: string
  body: string
  reactions?: Reaction[]
}

type Channel = {
  id: string
  name: string
  unread?: boolean
  preview?: string
}

type DirectMessage = {
  id: string
  name: string
  initials: string
  avatarColor: string
  online?: boolean
  preview?: string
}

type Thread = {
  id: string
  channel: string
  isDm?: boolean
  badge?: string
  messageCount: number
  date: string
  messages: SlackMessage[]
}

const channels: Channel[] = [
  { id: 'sarah-chen-team', name: 'sarah-chen-team', unread: true, preview: 'Wednesday 2pm works for Sara...' },
  { id: 'travel-coordination', name: 'travel-coordination', preview: 'My partner is on the same flight...' },
]

const directMessages: DirectMessage[] = [
  { id: 'david-park', name: 'David Park', initials: 'DP', avatarColor: 'bg-purple-500', online: true, preview: "She's asking about video confe..." },
  { id: 'maria-lopez', name: 'Maria Lopez', initials: 'ML', avatarColor: 'bg-blue-500', preview: 'Yes please! And can you share ...' },
  { id: 'it-bot', name: 'IT Bot', initials: 'IB', avatarColor: 'bg-slate-500', preview: 'Reminder: Your VPN certificate ...' },
]

const slackThreads: Thread[] = [
  {
    id: 'sarah-chen-team',
    channel: '#sarah-chen-team',
    badge: 'Sarah Chen',
    messageCount: 5,
    date: 'Wednesday, February 25',
    messages: [
      { id: 'm1', author: 'David Park', initials: 'DP', avatarColor: 'bg-purple-500', time: '3:00 AM', body: "Team — Q1 planning deck needs to be finalized by Friday. @alex.morgan can you block Sarah's calendar for review time?" },
      { id: 'm2', author: 'Alex Morgan', initials: 'AM', avatarColor: 'bg-blue-600', time: '3:05 AM', body: "On it. I'll block Thursday afternoon and Friday morning for her.", reactions: [{ emoji: '👍', count: 2 }] },
      { id: 'm3', author: 'Nina Patel', initials: 'NP', avatarColor: 'bg-violet-500', time: '3:30 AM', body: 'Can we also add a 30-min sync with the analytics team? They have the market sizing data we need.', reactions: [{ emoji: '👍', count: 2 }] },
      { id: 'm4', author: 'David Park', initials: 'DP', avatarColor: 'bg-purple-500', time: '4:15 AM', body: '@alex.morgan can you find a slot for that sync? Ideally Wednesday or Thursday.' },
      { id: 'm5', author: 'Alex Morgan', initials: 'AM', avatarColor: 'bg-blue-600', time: '4:20 AM', body: 'Wednesday 2pm works for Sarah and the analytics team. Sending invite now.', reactions: [{ emoji: '✅', count: 3 }] },
    ],
  },
  {
    id: 'travel-coordination',
    channel: '#travel-coordination',
    messageCount: 4,
    date: 'Tuesday, February 24',
    messages: [
      { id: 't1', author: 'James Liu', initials: 'JL', avatarColor: 'bg-emerald-600', time: '9:12 AM', body: 'Heads up — the 7am flight to NYC on Thursday is showing delays on the airline app. Might be worth checking alternatives.' },
      { id: 't2', author: 'Alex Morgan', initials: 'AM', avatarColor: 'bg-blue-600', time: '9:18 AM', body: "Thanks James. I'll monitor it and rebook if needed. Sarah has a client dinner at 7pm so we need her there by 5 at the latest.", reactions: [{ emoji: '👍', count: 1 }] },
      { id: 't3', author: 'Priya Nair', initials: 'PN', avatarColor: 'bg-pink-500', time: '10:05 AM', body: "My partner is on the same flight! He said the gate change is confirmed — now departing from Terminal B, Gate 22. Alex, I've updated the travel sheet.", reactions: [{ emoji: '🙏', count: 2 }] },
      { id: 't4', author: 'Alex Morgan', initials: 'AM', avatarColor: 'bg-blue-600', time: '10:10 AM', body: "Got it, updating Sarah's calendar notes now. Will send her a heads up before she leaves for the airport.", reactions: [{ emoji: '✅', count: 2 }] },
    ],
  },
  {
    id: 'david-park',
    channel: 'David Park',
    isDm: true,
    messageCount: 6,
    date: 'Thursday, February 20',
    messages: [
      { id: 'd1', author: 'David Park', initials: 'DP', avatarColor: 'bg-purple-500', time: '11:00 AM', body: "Hey Alex — Sarah's interviewing for the VP role at Meridian and wants to keep it quiet. Can you make sure her calendar looks normal next week?" },
      { id: 'd2', author: 'Alex Morgan', initials: 'AM', avatarColor: 'bg-blue-600', time: '11:03 AM', body: "Understood. I'll mark the blocks as 'Focus time' and decline conflicting meetings discreetly.", reactions: [{ emoji: '👍', count: 1 }] },
      { id: 'd3', author: 'David Park', initials: 'DP', avatarColor: 'bg-purple-500', time: '11:05 AM', body: "Perfect. Also — she's asking about video conferencing setup for the panel interview. Can you sort that out with IT?" },
      { id: 'd4', author: 'Alex Morgan', initials: 'AM', avatarColor: 'bg-blue-600', time: '11:08 AM', body: "On it. I'll get the Zoom room set up and test it 30 minutes before the call. Anything else she needs?" },
      { id: 'd5', author: 'David Park', initials: 'DP', avatarColor: 'bg-purple-500', time: '11:12 AM', body: "Just prep a one-pager on Meridian's org structure — she wants background on who'll be in the panel.", reactions: [{ emoji: '👍', count: 1 }] },
      { id: 'd6', author: 'Alex Morgan', initials: 'AM', avatarColor: 'bg-blue-600', time: '11:15 AM', body: "Will do. I'll have it in her prep folder by EOD.", reactions: [{ emoji: '✅', count: 1 }] },
    ],
  },
  {
    id: 'maria-lopez',
    channel: 'Maria Lopez',
    isDm: true,
    messageCount: 4,
    date: 'Wednesday, February 25',
    messages: [
      { id: 'ml1', author: 'Maria Lopez', initials: 'ML', avatarColor: 'bg-blue-500', time: '2:00 PM', body: "Hi Alex — I'm pulling together the board materials for next week. Do you have the latest version of the strategy slide deck Sarah presented in January?" },
      { id: 'ml2', author: 'Alex Morgan', initials: 'AM', avatarColor: 'bg-blue-600', time: '2:04 PM', body: "Yes, I'll share it now. Just a note — slide 14 has an updated revenue projection that Sarah revised last week.", reactions: [{ emoji: '👍', count: 1 }] },
      { id: 'ml3', author: 'Maria Lopez', initials: 'ML', avatarColor: 'bg-blue-500', time: '2:07 PM', body: "Yes please! And can you share the Q4 board minutes too? I want to cross-reference the commitments." },
      { id: 'ml4', author: 'Alex Morgan', initials: 'AM', avatarColor: 'bg-blue-600', time: '2:09 PM', body: "Sent both to your inbox. Let me know if you need anything else before the board meeting.", reactions: [{ emoji: '🙏', count: 1 }] },
    ],
  },
  {
    id: 'it-bot',
    channel: 'IT Bot',
    isDm: true,
    messageCount: 3,
    date: 'Monday, February 23',
    messages: [
      { id: 'ib1', author: 'IT Bot', initials: 'IB', avatarColor: 'bg-slate-500', time: '8:00 AM', body: '🔔 Reminder: Your VPN certificate expires in 7 days. Please renew it via the IT portal to avoid disruption to remote access.' },
      { id: 'ib2', author: 'IT Bot', initials: 'IB', avatarColor: 'bg-slate-500', time: '9:00 AM', body: '🔒 Security notice: A new sign-in to your account was detected from Chicago, IL. If this was you, no action needed. If not, please contact IT Security immediately.' },
      { id: 'ib3', author: 'IT Bot', initials: 'IB', avatarColor: 'bg-slate-500', time: '10:00 AM', body: '✅ Your software update for Zoom (v6.2.1) has been installed successfully. Restart your machine at your earliest convenience to complete the update.' },
    ],
  },
]

function SlackTab() {
  const [activeId, setActiveId] = useState<string>('sarah-chen-team')
  const [search, setSearch] = useState('')

  const thread = slackThreads.find((t) => t.id === activeId) ?? slackThreads[0]
  const isDm = thread.isDm ?? false

  return (
    <div className="flex h-full overflow-hidden bg-background">
      {/* Slack left sidebar */}
      <div className="w-64 shrink-0 flex flex-col border-r bg-[#3f0e40] text-white overflow-y-auto">
        {/* Workspace header */}
        <div className="px-4 py-3 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white leading-tight">McKinsey &amp; Co</h2>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-green-400 shrink-0" />
                <span className="text-xs text-white/70">Alex Morgan</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="px-3 py-2 border-b border-white/10">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/50 pointer-events-none" />
            <input
              type="text"
              placeholder="Search messages..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/10 text-xs text-white placeholder:text-white/50 rounded pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-white/30"
            />
          </div>
        </div>

        {/* Channels */}
        <div className="px-3 py-3">
          <button className="flex items-center gap-1 text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5 hover:text-white transition-colors w-full">
            <ChevronDown className="h-3 w-3" />
            Channels
          </button>
          <div className="space-y-0.5">
            {channels.map((ch) => (
              <button
                key={ch.id}
                onClick={() => setActiveId(ch.id)}
                className={cn(
                  'w-full text-left px-2 py-1 rounded text-sm flex flex-col transition-colors',
                  activeId === ch.id ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                )}
              >
                <span className="flex items-center gap-1.5">
                  <Hash className="h-3.5 w-3.5 shrink-0" />
                  <span className={cn('truncate', ch.unread && activeId !== ch.id && 'font-semibold text-white')}>
                    {ch.name}
                  </span>
                </span>
                {ch.preview && <span className="text-[11px] text-white/40 truncate pl-5 mt-0.5">{ch.preview}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Direct Messages */}
        <div className="px-3 py-2">
          <button className="flex items-center gap-1 text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5 hover:text-white transition-colors w-full">
            <ChevronDown className="h-3 w-3" />
            Direct Messages
          </button>
          <div className="space-y-0.5">
            {directMessages.map((dm) => (
              <button
                key={dm.id}
                onClick={() => setActiveId(dm.id)}
                className={cn(
                  'w-full text-left px-2 py-1 rounded text-sm flex flex-col transition-colors',
                  activeId === dm.id ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10 hover:text-white'
                )}
              >
                <span className="flex items-center gap-2">
                  <span
                    className={cn(
                      'h-5 w-5 rounded-sm text-[10px] font-bold flex items-center justify-center shrink-0',
                      dm.avatarColor
                    )}
                  >
                    {dm.initials}
                  </span>
                  <span className="flex items-center gap-1.5 truncate">
                    <span className="truncate">{dm.name}</span>
                    {dm.online && <span className="h-1.5 w-1.5 rounded-full bg-green-400 shrink-0" />}
                  </span>
                </span>
                {dm.preview && <span className="text-[11px] text-white/40 truncate pl-7 mt-0.5">{dm.preview}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Threads */}
        <div className="px-3 py-2">
          <button className="flex items-center gap-1 text-xs font-semibold text-white/70 uppercase tracking-wider mb-1.5 hover:text-white transition-colors w-full">
            <ChevronDown className="h-3 w-3" />
            Threads
          </button>
          <button className="w-full text-left px-2 py-1 rounded text-sm text-white/70 hover:bg-white/10 hover:text-white transition-colors flex flex-col">
            <span className="flex items-center gap-2">
              <MessageSquare className="h-3.5 w-3.5 shrink-0" />
              <span className="truncate">#meridian-engagement → Thread</span>
            </span>
            <span className="text-[11px] text-white/40 truncate pl-6 mt-0.5">Great. Also remind me to call Dr...</span>
          </button>
        </div>
      </div>

      {/* Main message area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Channel header */}
        <div className="px-6 py-3 border-b flex items-center justify-between shrink-0 bg-background">
          <div className="flex items-center gap-2">
            {isDm ? <User className="h-4 w-4 text-muted-foreground" /> : <Hash className="h-4 w-4 text-muted-foreground" />}
            <h1 className="text-sm font-semibold text-foreground">{thread.channel.replace('#', '')}</h1>
            {thread.badge && (
              <span className="bg-muted text-muted-foreground text-xs font-medium px-2 py-0.5 rounded">{thread.badge}</span>
            )}
          </div>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
            <Plus className="h-3.5 w-3.5" />
            Compose
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <p className="text-xs text-muted-foreground mb-4">{thread.messageCount} messages</p>

          {/* Date separator */}
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground bg-background px-2">{thread.date}</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="space-y-4">
            {thread.messages.map((msg) => (
              <SlackMessageRow key={msg.id} msg={msg} />
            ))}
          </div>
        </div>

        {/* Compose box */}
        <div className="px-6 py-3 border-t shrink-0 bg-background">
          <div className="rounded-lg border bg-card px-4 py-2.5 flex items-center gap-2">
            <input
              type="text"
              placeholder={`Message ${thread.channel}`}
              className="flex-1 text-sm bg-transparent focus:outline-none text-foreground placeholder:text-muted-foreground"
            />
            <div className="flex items-center gap-1 text-muted-foreground">
              <button className="p-1 rounded hover:bg-muted transition-colors text-lg leading-none">😊</button>
              <button className="p-1.5 rounded hover:bg-muted transition-colors">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="22" y1="2" x2="11" y2="13" />
                  <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function SlackMessageRow({ msg }: { msg: SlackMessage }) {
  return (
    <div className="flex items-start gap-3 group">
      <div
        className={cn(
          'h-8 w-8 rounded-md flex items-center justify-center text-xs font-bold text-white shrink-0 mt-0.5',
          msg.avatarColor
        )}
      >
        {msg.initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-sm font-semibold text-foreground">{msg.author}</span>
          <span className="text-[11px] text-muted-foreground">{msg.time}</span>
        </div>
        <p className="text-sm text-foreground leading-relaxed">{msg.body}</p>
        {msg.reactions && msg.reactions.length > 0 && (
          <div className="flex gap-1.5 mt-1.5">
            {msg.reactions.map((r, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1 bg-muted hover:bg-muted/80 border border-border rounded-full px-2 py-0.5 text-xs cursor-pointer transition-colors"
              >
                <span>{r.emoji}</span>
                <span className="text-muted-foreground font-medium">{r.count}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Clippings Tab ────────────────────────────────────────────────────────────

type ScreenshotType = 'slack' | 'outlook' | 'uploaded'

type Clipping = {
  id: string
  filename: string
  uploadedAt: string
  source: string
  tags: string[]
  screenshotType: ScreenshotType
  imageSrc?: string
  transcript: string
}

const MOCK_CLIPPINGS: Clipping[] = [
  {
    id: 'c1',
    filename: 'acme-board-update.png',
    uploadedAt: 'Today, 09:14 AM',
    source: 'Slack · #acme-corp',
    tags: ['Acme Corp', 'Board', 'Sarah Chen'],
    screenshotType: 'slack',
    transcript: `Board Update — Acme Corp Transformation\n\nChannel: #acme-corp\nPosted by: Tom Bradley\nDate: April 19, 2026 · 09:08 AM\n\n"Following yesterday's steering committee, the board has approved Phase 2 of the transformation roadmap. Key milestones:\n\n• Cost optimisation target raised to $120M (up from $95M)\n• Digital infrastructure workstream to begin Q3\n• External advisor review scheduled for May 12\n• Next all-hands: April 28 @ 10:00 AM EST\n\nPlease ensure all workstream leads have submitted their updated plans by EOD Friday."\n\nReactions: 👍 ×4  ✅ ×3  🎯 ×2\n\nSarah Chen replied [09:11 AM]: "Thanks Tom — Alex, can you block May 12 and prep the pre-read pack?"\n\nAI Note: Tom referenced the May 12 advisor review — consider blocking Sarah's calendar and coordinating pre-reading materials.`,
  },
  {
    id: 'c2',
    filename: 'q2-offsite-logistics.png',
    uploadedAt: 'Yesterday, 3:47 PM',
    source: 'Outlook · Inbox',
    tags: ['Offsite', 'Calendar', 'James Whitfield'],
    screenshotType: 'outlook',
    transcript: `Q2 Leadership Offsite — Logistics Confirmed\n\nFrom: Events Team <events@mckinsey.com>\nTo: James Whitfield <j.whitfield@mckinsey.com>; Alex Morgan <a.morgan@mckinsey.com>\nDate: April 18, 2026 · 3:41 PM\nSubject: [CONFIRMED] Q2 Leadership Offsite — May 6–7, Miami\n\nHi team,\n\nPlease find the confirmed logistics for the Q2 Leadership Offsite below:\n\n  Date: May 6–7, 2026\n  Venue: The Biltmore, Coral Gables, FL\n  Check-in: May 6 @ 2:00 PM\n  Dinner: May 6 @ 7:30 PM (required attendance)\n  Sessions: May 7 @ 8:30 AM – 5:00 PM\n\nFlight recommendations have been shared separately. Ground transport will be arranged from MIA.\n\nPlease confirm dietary requirements by April 25.\n\nBest,\nEvents & Logistics Team\nMcKinsey & Company\n\nAI Note: James has a conflict on May 6 AM — flight booking needed before April 22 to get preferred seats.`,
  },
  {
    id: 'c3',
    filename: 'contract-renewal-thread.png',
    uploadedAt: 'Apr 17, 11:02 AM',
    source: 'Slack · #legal-ops',
    tags: ['Contract', 'Legal', 'Urgent'],
    screenshotType: 'slack',
    transcript: `Contract Renewal — Vendor MSA Discussion\n\nChannel: #legal-ops\nParticipants: Rachel Kim (Legal), David Osei (Procurement), Alex Morgan\nDate: April 17, 2026\n\nRachel Kim [10:44 AM]:\n"The MSA with DataBridge expires May 31. We need sign-off from the partner before the 30-day notice window closes. Current terms are attached."\n\nDavid Osei [10:51 AM]:\n"Procurement is ready. We're proposing a 15% reduction on the SaaS tier — DataBridge has indicated they'll accept. Just need partner approval."\n\nAlex Morgan [11:02 AM]:\n"Got it — I'll flag this to Sarah and add it to her review queue. Can you send the redlined version to me directly?"\n\nAI Note: Deadline is May 1 for the 30-day notice. This should be added as a high-urgency to-do for Sarah Chen.`,
  },
  {
    id: 'c4',
    filename: 'james-travel-approval.png',
    uploadedAt: 'Apr 16, 08:30 AM',
    source: 'Outlook · Sent',
    tags: ['Travel', 'James Whitfield', 'Approval'],
    screenshotType: 'outlook',
    transcript: `Travel Approval Request — Tokyo Client Visit\n\nFrom: Alex Morgan <a.morgan@mckinsey.com>\nTo: Travel Desk <travel@mckinsey.com>\nCC: James Whitfield <j.whitfield@mckinsey.com>\nDate: April 16, 2026 · 8:24 AM\nSubject: Travel Approval — JW Tokyo May 19–22\n\nHi Travel Desk,\n\nPlease process the following travel for Partner James Whitfield:\n\n  Trip: Tokyo Client Visit — Nomura Holdings\n  Departure: May 19, 2026 (LHR → NRT, Business)\n  Return: May 22, 2026 (NRT → LHR, Business)\n  Hotel: The Peninsula Tokyo (May 19–22)\n  Ground: Nippon Limousine both ways\n\nPurpose: Relationship management and Q2 business review with Nomura leadership. Pre-approved under client engagement budget.\n\nPlease confirm once booked. James prefers window seats.\n\nThanks,\nAlex Morgan\nExecutive Assistant to James Whitfield\n\nAI Note: Visa check required — UK passport, Japan entry. No visa needed for <90 days.`,
  },
  {
    id: 'c5',
    filename: 'sarah-chen-dm-prep.png',
    uploadedAt: 'Apr 15, 5:19 PM',
    source: 'Slack · DM · Sarah Chen',
    tags: ['Sarah Chen', 'Prep', 'Meeting'],
    screenshotType: 'slack',
    transcript: `Direct Message — Sarah Chen & Alex Morgan\n\nDate: April 15, 2026\n\nSarah Chen [5:02 PM]:\n"Alex — quick heads up, the Nomura call tomorrow moved to 8 AM. Can you update the invite and resend to the right people? Also need the Q1 deck prepped and sent to Kenji by 7 AM."\n\nAlex Morgan [5:09 PM]:\n"On it — updating the calendar invite now. Will send the revised deck to Kenji Yamamoto (k.yamamoto@nomura.com) by 7 AM. Anything to add to the agenda?"\n\nSarah Chen [5:14 PM]:\n"Add a 10-min slot for the JV discussion — I'll handle that part. Also flag James in case he wants to join."\n\nAlex Morgan [5:19 PM]:\n"Done ✓ — invite updated, James flagged, deck in progress. I'll send you a preview by 10 PM."\n\nSarah Chen [5:20 PM]:\n"Perfect, thanks 🙏"\n\nAI Note: Deck for Nomura Q1 review should be ready for Sarah's sign-off tonight. Kenji Yamamoto added to contact watchlist.`,
  },
]

function ClippingsTab() {
  const [clippings, setClippings] = useState<Clipping[]>(MOCK_CLIPPINGS)
  const [selected, setSelected] = useState<Clipping>(MOCK_CLIPPINGS[0])
  const [isDraggingOver, setIsDraggingOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return
      const reader = new FileReader()
      reader.onload = (e) => {
        const newClipping: Clipping = {
          id: `c-${Date.now()}-${Math.random()}`,
          filename: file.name,
          uploadedAt: 'Just now',
          source: 'Uploaded manually',
          tags: [],
          screenshotType: 'uploaded',
          imageSrc: e.target?.result as string,
          transcript: 'AI is processing this screenshot…\n\nTranscript will appear here shortly once the image has been analysed.',
        }
        setClippings((prev) => [newClipping, ...prev])
        setSelected(newClipping)
      }
      reader.readAsDataURL(file)
    })
  }

  return (
    <div className="flex h-full overflow-hidden">
      {/* Left: clippings list */}
      <aside
        className="w-72 shrink-0 border-r flex flex-col overflow-hidden bg-background"
        onDragOver={(e) => { e.preventDefault(); setIsDraggingOver(true) }}
        onDragLeave={() => setIsDraggingOver(false)}
        onDrop={(e) => { e.preventDefault(); setIsDraggingOver(false); handleFiles(e.dataTransfer.files) }}
      >
        <div className="p-3 border-b flex items-center justify-between">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-2 bg-primary text-primary-foreground text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Upload className="h-3.5 w-3.5" />
            Upload
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
        </div>

        <div
          className={cn(
            'mx-3 mt-2 mb-2 rounded-lg border-2 border-dashed flex items-center justify-center gap-2 py-2.5 text-xs text-muted-foreground transition-colors cursor-pointer',
            isDraggingOver ? 'border-primary bg-primary/5 text-primary' : 'border-border hover:border-muted-foreground/40'
          )}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-3.5 w-3.5" />
          Drop or click to upload
        </div>

        <div className="flex-1 overflow-y-auto">
          {clippings.map((clip) => (
            <button
              key={clip.id}
              onClick={() => setSelected(clip)}
              className={cn(
                'w-full text-left px-3 py-3 border-b transition-colors flex gap-3',
                selected.id === clip.id
                  ? 'bg-primary/5 border-l-2 border-l-primary'
                  : 'hover:bg-muted/50 border-l-2 border-l-transparent'
              )}
            >
              <div className="h-14 w-20 shrink-0 rounded-md border bg-muted overflow-hidden flex items-center justify-center">
                <ClippingThumbnail clip={clip} />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">{clip.filename}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5 truncate">{clip.source}</p>
                <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                  {clip.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-[10px] bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">
                      {tag}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] text-muted-foreground/60 mt-1 flex items-center gap-1">
                  <Clock className="h-2.5 w-2.5" />
                  {clip.uploadedAt}
                </p>
              </div>
            </button>
          ))}
        </div>
      </aside>

      {/* Right: detail view */}
      <div className="flex-1 overflow-y-auto bg-background">
        {selected && (
          <div className="max-w-3xl mx-auto px-8 py-6 space-y-6">
            {/* Screenshot */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4 text-muted-foreground" />
                  <h2 className="text-sm font-semibold text-foreground">Screenshot</h2>
                  <span className="text-xs text-muted-foreground">· {selected.source}</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {selected.tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-full">
                      <Tag className="h-2.5 w-2.5" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <ClippingScreenshotPreview clip={selected} />
            </section>

            {/* Transcript */}
            <section>
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h2 className="text-sm font-semibold text-foreground">Transcript</h2>
              </div>
              <div className="rounded-xl border bg-card p-5">
                <pre className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed">
                  {selected.transcript}
                </pre>
              </div>
            </section>

            <div className="pb-4" />
          </div>
        )}
      </div>
    </div>
  )
}

function ClippingThumbnail({ clip }: { clip: Clipping }) {
  if (clip.imageSrc) {
    return <img src={clip.imageSrc} alt={clip.filename} className="h-full w-full object-cover" />
  }
  if (clip.screenshotType === 'slack') {
    return (
      <div className="h-full w-full bg-[#3f0e40] flex flex-col">
        <div className="flex-1 bg-white dark:bg-zinc-800 p-1 space-y-1">
          {[70, 85, 55].map((w, i) => (
            <div key={i} className="flex gap-1 items-start">
              <div className="h-3 w-3 rounded bg-zinc-300 shrink-0 mt-0.5" />
              <div className="flex-1 space-y-0.5">
                <div className="h-1.5 rounded bg-zinc-200" style={{ width: `${w}%` }} />
                <div className="h-1 rounded bg-zinc-100" style={{ width: `${w - 15}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="h-3 bg-[#3f0e40]" />
      </div>
    )
  }
  if (clip.screenshotType === 'outlook') {
    return (
      <div className="h-full w-full flex flex-col">
        <div className="h-2.5 bg-[#0078d4]" />
        <div className="flex-1 bg-white dark:bg-zinc-800 p-1 space-y-1">
          <div className="h-1.5 rounded bg-zinc-300 w-4/5" />
          <div className="h-1 rounded bg-zinc-200 w-3/5" />
          <div className="h-1 rounded bg-zinc-100 w-full mt-1" />
          <div className="h-1 rounded bg-zinc-100 w-full" />
          <div className="h-1 rounded bg-zinc-100 w-2/3" />
        </div>
      </div>
    )
  }
  return <ImageIcon className="h-5 w-5 text-muted-foreground/50" />
}

function ClippingScreenshotPreview({ clip }: { clip: Clipping }) {
  if (clip.imageSrc) {
    return <img src={clip.imageSrc} alt={clip.filename} className="max-w-full object-contain rounded-xl border" />
  }
  if (clip.screenshotType === 'slack') return <SlackScreenshotMock clip={clip} />
  if (clip.screenshotType === 'outlook') return <OutlookScreenshotMock clip={clip} />
  return (
    <div className="rounded-xl border bg-muted flex flex-col items-center justify-center gap-3 py-16 text-muted-foreground">
      <ImageIcon className="h-10 w-10 opacity-30" />
      <p className="text-sm">{clip.filename}</p>
    </div>
  )
}

function SlackScreenshotMock({ clip }: { clip: Clipping }) {
  return (
    <div className="rounded-xl border overflow-hidden bg-white dark:bg-zinc-900 text-sm font-sans shadow-sm">
      <div className="bg-[#3f0e40] px-4 py-2.5 flex items-center gap-2">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
          <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
          <div className="h-3 w-3 rounded-full bg-[#28c840]" />
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-[#5a195a] rounded px-10 py-0.5 text-[11px] text-white/60 flex items-center gap-1.5">
            <Search className="h-2.5 w-2.5" />
            McKinsey &amp; Company
          </div>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground">{clip.source}</p>
        <p className="text-sm mt-2 text-foreground">{clip.transcript.slice(0, 200)}...</p>
      </div>
    </div>
  )
}

function OutlookScreenshotMock({ clip }: { clip: Clipping }) {
  return (
    <div className="rounded-xl border overflow-hidden bg-white dark:bg-zinc-900 font-sans shadow-sm">
      <div className="bg-[#0078d4] px-4 py-2 flex items-center gap-3">
        <div className="flex gap-1.5">
          <div className="h-3 w-3 rounded-full bg-white/30" />
          <div className="h-3 w-3 rounded-full bg-white/30" />
          <div className="h-3 w-3 rounded-full bg-white/30" />
        </div>
        <div className="flex-1 text-center">
          <span className="text-white text-xs font-semibold">Microsoft Outlook</span>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground">{clip.source}</p>
        <p className="text-sm mt-2 text-foreground">{clip.transcript.slice(0, 200)}...</p>
      </div>
    </div>
  )
}
