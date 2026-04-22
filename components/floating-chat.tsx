'use client'

import { useState } from 'react'
import { X, Send, MessageCircle, Calendar, Clock, Users, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const SUGGESTED_PROMPTS = [
  {
    icon: Calendar,
    label: 'Schedule a 1:1',
    prompt: 'Schedule a 1:1 with Ryan West for tomorrow morning between 9a-12p ET',
  },
  {
    icon: Clock,
    label: 'Find me time',
    prompt: 'Find me half an hour with Sarah Chen tomorrow after 11:30a ET',
  },
  {
    icon: Users,
    label: 'Solve a conflict',
    prompt: 'Help me solve this calendar conflict for the Goldman Sachs meeting',
  },
  {
    icon: Sparkles,
    label: 'Draft an email',
    prompt: 'Draft a follow-up email to John Thompson about the Q1 strategy review',
  },
]

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: "I'm working on that for you. Let me check the calendars and find the best options...",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  const handlePromptClick = (prompt: string) => {
    setInput(prompt)
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          'fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#2251FF] text-white shadow-lg hover:bg-[#2251FF]/90 transition-all hover:scale-105',
          isOpen && 'hidden'
        )}
      >
        <MessageCircle className="h-6 w-6" />
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] max-h-[600px] bg-background rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b bg-[#2251FF] text-white">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20">
                <Sparkles className="h-4 w-4" />
              </div>
              <div>
                <h3 className="text-sm font-semibold">Aurora Assistant</h3>
                <p className="text-[10px] text-white/70">AI-powered EA support</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[300px]">
            {messages.length === 0 ? (
              <div className="space-y-4">
                <div className="text-center py-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#2251FF]/10 mx-auto mb-3">
                    <Sparkles className="h-6 w-6 text-[#2251FF]" />
                  </div>
                  <h4 className="text-sm font-medium text-foreground">How can I help you today?</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    I can help schedule meetings, find time slots, and manage your calendar
                  </p>
                </div>

                {/* Suggested prompts */}
                <div className="space-y-2">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground px-1">
                    Suggested actions
                  </p>
                  <div className="grid gap-2">
                    {SUGGESTED_PROMPTS.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => handlePromptClick(item.prompt)}
                        className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/50 transition-colors text-left group"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted group-hover:bg-[#2251FF]/10 transition-colors">
                          <item.icon className="h-4 w-4 text-muted-foreground group-hover:text-[#2251FF] transition-colors" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-foreground">{item.label}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{item.prompt}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={cn(
                    'flex',
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  )}
                >
                  <div
                    className={cn(
                      'max-w-[85%] rounded-2xl px-4 py-2.5',
                      msg.role === 'user'
                        ? 'bg-[#2251FF] text-white rounded-br-md'
                        : 'bg-muted text-foreground rounded-bl-md'
                    )}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p
                      className={cn(
                        'text-[10px] mt-1',
                        msg.role === 'user' ? 'text-white/60' : 'text-muted-foreground'
                      )}
                    >
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Input area */}
          <div className="p-3 border-t bg-muted/20">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Message Aurora..."
                className="flex-1 bg-background border border-border rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2251FF]/30 focus:border-[#2251FF]"
              />
              <Button
                size="icon"
                onClick={handleSend}
                disabled={!input.trim()}
                className="h-9 w-9 rounded-full bg-[#2251FF] hover:bg-[#2251FF]/90 disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
