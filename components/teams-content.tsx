'use client'

import { useState } from 'react'
import { ChevronDown, ExternalLink, Calendar, Copy, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Engagement {
  id: string
  name: string
  code: string
}

interface LeadershipMember {
  id: string
  name: string
  ea: string
  title: string
  location: string
  sharecalId: string
}

interface AssociateMember {
  id: string
  name: string
  title: string
  location: string
  email: string
}

const engagements: Engagement[] = [
  { id: '1', name: 'Growth Transformation', code: '123456AB' },
  { id: '2', name: 'Digital Strategy', code: '789012CD' },
  { id: '3', name: 'Operations Excellence', code: '345678EF' },
]

const leadershipData: LeadershipMember[] = [
  { id: '1', name: 'Sarah Chen', ea: 'Alex Morgan', title: 'Senior Partner', location: 'London', sharecalId: 'sarah.chen' },
  { id: '2', name: 'James Whitfield', ea: 'Alex Morgan', title: 'Partner', location: 'New York', sharecalId: 'james.whitfield' },
  { id: '3', name: 'Michael Torres', ea: 'Rachel Kim', title: 'Associate Partner', location: 'Chicago', sharecalId: 'michael.torres' },
]

const associatesData: AssociateMember[] = [
  { id: '1', name: 'Emily Richardson', title: 'Engagement Manager', location: 'London', email: 'emily.richardson@mckinsey.com' },
  { id: '2', name: 'David Park', title: 'Senior Associate', location: 'London', email: 'david.park@mckinsey.com' },
  { id: '3', name: 'Maria Lopez', title: 'Associate', location: 'New York', email: 'maria.lopez@mckinsey.com' },
  { id: '4', name: 'John Smith', title: 'Business Analyst', location: 'Chicago', email: 'john.smith@mckinsey.com' },
  { id: '5', name: 'Lisa Wang', title: 'Business Analyst', location: 'London', email: 'lisa.wang@mckinsey.com' },
]

export function TeamsContent() {
  const [selectedEngagement, setSelectedEngagement] = useState(engagements[0])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null)

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text)
    setCopiedEmail(id)
    setTimeout(() => setCopiedEmail(null), 2000)
  }

  const copyAllEmails = () => {
    const allEmails = associatesData.map(a => a.email).join('; ')
    navigator.clipboard.writeText(allEmails)
    setCopiedEmail('all')
    setTimeout(() => setCopiedEmail(null), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header with engagement selector */}
      <div className="flex items-center justify-between">
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 px-4 py-2.5 border border-border rounded-lg bg-background hover:bg-muted/50 transition-colors min-w-[280px]"
          >
            <span className="text-sm font-medium text-foreground">
              {selectedEngagement.name} ({selectedEngagement.code})
            </span>
            <ChevronDown className={cn('h-4 w-4 text-muted-foreground ml-auto transition-transform', dropdownOpen && 'rotate-180')} />
          </button>
          {dropdownOpen && (
            <div className="absolute top-full left-0 mt-1 w-full bg-background border border-border rounded-lg shadow-lg z-10">
              {engagements.map((eng) => (
                <button
                  key={eng.id}
                  onClick={() => {
                    setSelectedEngagement(eng)
                    setDropdownOpen(false)
                  }}
                  className={cn(
                    'w-full text-left px-4 py-2.5 text-sm hover:bg-muted transition-colors first:rounded-t-lg last:rounded-b-lg',
                    selectedEngagement.id === eng.id && 'bg-muted font-medium'
                  )}
                >
                  {eng.name} ({eng.code})
                </button>
              ))}
            </div>
          )}
        </div>
        <a
          href="#"
          className="text-sm text-primary hover:underline flex items-center gap-1"
        >
          Open in Engage
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Info for Team Assistant(s) */}
      <div className="pt-2">
        <h2 className="text-lg font-semibold text-foreground">Info for Team Assistant(s)</h2>
      </div>

      {/* Leadership Section */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="bg-muted/30 px-4 py-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Leadership</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <RefreshCw className="h-3 w-3" />
              from Engage
            </span>
            <Button size="sm" className="h-8 text-xs bg-[#2251FF] hover:bg-[#2251FF]/90">
              Add as group in Sharecal
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/10">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">Partner Name</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">EA</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">Title</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">LOC</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">Sharecal</th>
              </tr>
            </thead>
            <tbody>
              {leadershipData.map((member) => (
                <tr key={member.id} className="border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-sm text-foreground font-medium">{member.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{member.ea}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{member.title}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{member.location}</td>
                  <td className="px-4 py-3">
                    <a
                      href={`#sharecal/${member.sharecalId}`}
                      className="text-sm text-primary hover:underline flex items-center gap-1"
                    >
                      <Calendar className="h-3.5 w-3.5" />
                      Open calendar
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Associates / CST Section */}
      <div className="border border-border rounded-lg overflow-hidden">
        <div className="bg-muted/30 px-4 py-3 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-foreground">Client Service Team (CST)</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <RefreshCw className="h-3 w-3" />
              from iStaffing
            </span>
            <Button
              size="sm"
              className="h-8 text-xs bg-[#2251FF] hover:bg-[#2251FF]/90"
              onClick={copyAllEmails}
            >
              {copiedEmail === 'all' ? 'Copied!' : 'Copy emails'}
            </Button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/10">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">Name</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">Title</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">LOC</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5">Email</th>
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {associatesData.map((member) => (
                <tr key={member.id} className="border-b border-border last:border-b-0 hover:bg-muted/20 transition-colors">
                  <td className="px-4 py-3 text-sm text-foreground font-medium">{member.name}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{member.title}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{member.location}</td>
                  <td className="px-4 py-3 text-sm text-primary">{member.email}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => copyToClipboard(member.email, member.id)}
                      className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
                    >
                      <Copy className="h-3.5 w-3.5" />
                      {copiedEmail === member.id ? 'Copied!' : 'Copy'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
