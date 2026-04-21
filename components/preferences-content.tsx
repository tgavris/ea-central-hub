'use client'

import { useState } from 'react'
import {
  Mail,
  Calendar,
  Plane,
  FileText,
  Bell,
  User,
  Edit,
  Check,
  ChevronRight,
  Zap,
  Globe,
  MessageSquare,
  Video,
  Info,
} from 'lucide-react'
import { cn } from '@/lib/utils'

type RuleStatus = 'active' | 'paused' | 'pending'

type Rule = {
  id: string
  title: string
  description: string
  trigger: string
  status: RuleStatus
  category: 'email' | 'calendar' | 'travel' | 'document'
  partnerId?: string
}

const rules: Rule[] = [
  {
    id: 'r-email-1',
    title: 'Client correspondence rule',
    description: 'Draft suggested replies for emails from key clients within 4 hours. Flag if no draft exists after 2 hours.',
    trigger: 'Incoming email from contact tagged as "Client"',
    status: 'active',
    category: 'email',
  },
  {
    id: 'r-email-2',
    title: 'Board communication rule',
    description: 'Escalate all board-level correspondence immediately. Suggest formal reply templates.',
    trigger: 'Email from or to board member contacts',
    status: 'active',
    category: 'email',
  },
  {
    id: 'r-cal-1',
    title: 'External meeting reschedule',
    description: "Suggest reschedule when two external meetings overlap on a partner's calendar. Prioritise client meetings.",
    trigger: 'Calendar conflict detected with at least one external attendee',
    status: 'active',
    category: 'calendar',
  },
  {
    id: 'r-travel-1',
    title: 'Travel document rule',
    description: 'Alert when passport expiry is within 6 months and travel is booked. Suggest renewal.',
    trigger: 'Passport expiry date within 180 days AND upcoming international travel',
    status: 'active',
    category: 'travel',
  },
]

const STATUS_CONFIG: Record<RuleStatus, { label: string; className: string; dotClass: string }> = {
  active: {
    label: 'Active',
    className: 'bg-muted text-foreground border-border',
    dotClass: 'bg-green-500',
  },
  paused: {
    label: 'Paused',
    className: 'bg-muted text-muted-foreground border-border',
    dotClass: 'bg-amber-400',
  },
  pending: {
    label: 'Pending',
    className: 'bg-muted text-muted-foreground border-border',
    dotClass: 'bg-muted-foreground/40',
  },
}

const CATEGORY_CONFIG = {
  email: { label: 'Email rules', icon: Mail, color: 'text-blue-500' },
  calendar: { label: 'Calendar rules', icon: Calendar, color: 'text-violet-500' },
  travel: { label: 'Travel rules', icon: Plane, color: 'text-emerald-500' },
  document: { label: 'Document rules', icon: FileText, color: 'text-orange-500' },
}

export function PreferencesContent() {
  const [ruleStatuses, setRuleStatuses] = useState<Record<string, RuleStatus>>(
    Object.fromEntries(rules.map((r) => [r.id, r.status]))
  )
  const [notifications, setNotifications] = useState({
    inApp: true,
    emailDigest: true,
    slackDm: false,
    urgentOnly: false,
  })
  const [integrations, setIntegrations] = useState<Record<string, boolean>>({
    outlook: true,
    slack: true,
    zoom: false,
    google: false,
  })

  const toggleRule = (id: string) => {
    setRuleStatuses((prev) => ({
      ...prev,
      [id]: prev[id] === 'active' ? 'paused' : 'active',
    }))
  }

  const categories = ['email', 'calendar', 'travel', 'document'] as const

  return (
    <div className="space-y-8 max-w-4xl">
      {/* EA Profile */}
      <section>
        <SectionHeader letter="A" title="EA Profile" />
        <div className="border rounded-xl overflow-hidden">
          <div className="flex items-start gap-4 p-5 border-b">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-sm font-bold text-white shrink-0">
              AM
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-sm font-semibold text-foreground">Alex Morgan</h3>
                <span className="text-[10px] font-medium bg-muted text-muted-foreground px-1.5 py-0.5 rounded-full">EA</span>
              </div>
              <p className="text-xs text-muted-foreground">alex.morgan@mckinsey.com</p>
              <p className="text-xs text-muted-foreground mt-0.5">McKinsey &amp; Company · London, GMT+1</p>
            </div>
            <button className="flex items-center gap-1.5 text-xs text-muted-foreground border rounded-md px-3 py-1.5 hover:bg-muted transition-colors">
              <Edit className="h-3.5 w-3.5" />
              Edit
            </button>
          </div>

          <div className="divide-y">
            <ProfileRow label="Role" value="Executive Assistant" />
            <ProfileRow label="Timezone" value="Europe/London (GMT+1)" />
            <ProfileRow label="Working hours" value="Mon–Fri, 8:00 AM – 6:30 PM" />
          </div>
        </div>
      </section>

      {/* Automation Rules */}
      <section>
        <SectionHeader letter="B" title="Automation Rules" />
        <div className="space-y-5">
          {categories.map((cat) => {
            const config = CATEGORY_CONFIG[cat]
            const catRules = rules.filter((r) => r.category === cat)
            const Icon = config.icon
            return (
              <div key={cat} className="border rounded-xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3 border-b bg-muted/30">
                  <Icon className={cn('h-4 w-4', config.color)} />
                  <span className="text-sm font-semibold text-foreground">{config.label}</span>
                  <span className="ml-auto text-[11px] text-muted-foreground">
                    {catRules.filter((r) => ruleStatuses[r.id] === 'active').length}/{catRules.length} active
                  </span>
                </div>
                <div className="divide-y">
                  {catRules.map((rule) => {
                    const status = ruleStatuses[rule.id]
                    const sc = STATUS_CONFIG[status]
                    return (
                      <div key={rule.id} className="px-4 py-3.5">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex items-start gap-3 flex-1 min-w-0">
                            <span className={cn('h-2 w-2 rounded-full shrink-0 mt-1.5', sc.dotClass)} />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 flex-wrap mb-0.5">
                                <span className="text-sm font-medium text-foreground">{rule.title}</span>
                                <span className={cn('text-[10px] font-medium px-1.5 py-0.5 rounded-full border', sc.className)}>
                                  {sc.label}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground leading-relaxed">{rule.description}</p>
                              <p className="text-[11px] text-muted-foreground/70 mt-1">
                                <span className="font-medium">Trigger:</span> {rule.trigger}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0 mt-0.5">
                            <button className="text-[11px] text-primary hover:underline">Edit</button>
                            <Toggle
                              enabled={status === 'active'}
                              onChange={() => toggleRule(rule.id)}
                            />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Notifications */}
      <section>
        <SectionHeader letter="C" title="Notifications" />
        <div className="border rounded-xl divide-y overflow-hidden">
          <NotifRow
            icon={<Bell className="h-4 w-4 text-blue-500" />}
            label="In-app notifications"
            description="Show alerts and insights in the EA Central sidebar"
            enabled={notifications.inApp}
            onChange={() => setNotifications((n) => ({ ...n, inApp: !n.inApp }))}
          />
          <NotifRow
            icon={<Mail className="h-4 w-4 text-violet-500" />}
            label="Daily email digest"
            description="Receive a summary of pending actions and insights each morning at 8:00 AM"
            enabled={notifications.emailDigest}
            onChange={() => setNotifications((n) => ({ ...n, emailDigest: !n.emailDigest }))}
          />
          <NotifRow
            icon={<MessageSquare className="h-4 w-4 text-emerald-500" />}
            label="Slack DMs"
            description="Send urgent alerts directly to your Slack account"
            enabled={notifications.slackDm}
            onChange={() => setNotifications((n) => ({ ...n, slackDm: !n.slackDm }))}
          />
          <NotifRow
            icon={<Bell className="h-4 w-4 text-amber-500" />}
            label="Urgent-only mode"
            description="Only surface notifications flagged as urgent or predicted risk"
            enabled={notifications.urgentOnly}
            onChange={() => setNotifications((n) => ({ ...n, urgentOnly: !n.urgentOnly }))}
          />
        </div>
      </section>

      {/* Integrations */}
      <section>
        <SectionHeader letter="D" title="Integrations" />
        <div className="border rounded-xl divide-y overflow-hidden">
          <IntegrationRow
            icon={<div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center"><Mail className="h-4 w-4 text-white" /></div>}
            name="Microsoft Outlook"
            description="Sync email and calendar. AI reads your inbox to surface insights."
            connected={integrations.outlook}
            connectedAs="alex.morgan@mckinsey.com"
            onToggle={() => setIntegrations((i) => ({ ...i, outlook: !i.outlook }))}
          />
          <IntegrationRow
            icon={<div className="h-8 w-8 rounded bg-[#4a154b] flex items-center justify-center"><MessageSquare className="h-4 w-4 text-white" /></div>}
            name="Slack"
            description="Read channel messages and DMs relevant to your partners. Send alerts."
            connected={integrations.slack}
            connectedAs="@alex.morgan · McKinsey & Co workspace"
            onToggle={() => setIntegrations((i) => ({ ...i, slack: !i.slack }))}
          />
        </div>
      </section>
    </div>
  )
}

function SectionHeader({ letter, title }: { letter: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="h-5 w-5 rounded bg-muted text-[11px] font-bold text-muted-foreground flex items-center justify-center shrink-0">
        {letter}
      </span>
      <h2 className="text-sm font-semibold text-foreground">{title}</h2>
    </div>
  )
}

function ProfileRow({
  label,
  value,
  children,
}: {
  label: string
  value?: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex items-center px-5 py-2.5 gap-4">
      <span className="text-xs text-muted-foreground w-36 shrink-0">{label}</span>
      {children ?? <span className="text-xs text-foreground">{value}</span>}
    </div>
  )
}

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      role="switch"
      aria-checked={enabled}
      onClick={onChange}
      className={cn(
        'relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200',
        enabled ? 'bg-primary' : 'bg-muted-foreground/30'
      )}
    >
      <span
        className={cn(
          'pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200',
          enabled ? 'translate-x-4' : 'translate-x-0'
        )}
      />
    </button>
  )
}

function NotifRow({
  icon,
  label,
  description,
  enabled,
  onChange,
}: {
  icon: React.ReactNode
  label: string
  description: string
  enabled: boolean
  onChange: () => void
}) {
  return (
    <div className="flex items-center gap-4 px-4 py-3.5">
      <div className="h-8 w-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{label}</p>
        <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
      </div>
      <Toggle enabled={enabled} onChange={onChange} />
    </div>
  )
}

function IntegrationRow({
  icon,
  name,
  description,
  connected,
  connectedAs,
  onToggle,
}: {
  icon: React.ReactNode
  name: string
  description: string
  connected: boolean
  connectedAs?: string
  onToggle: () => void
}) {
  return (
    <div className="flex items-center gap-4 px-4 py-4">
      <div className="shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <p className="text-sm font-medium text-foreground">{name}</p>
          {connected && (
            <span className="flex items-center gap-1 text-[10px] font-medium text-muted-foreground bg-muted border border-border px-1.5 py-0.5 rounded-full">
              <Check className="h-2.5 w-2.5" />
              Connected
            </span>
          )}
        </div>
        <p className="text-xs text-muted-foreground">{description}</p>
        {connected && connectedAs && (
          <p className="text-[11px] text-muted-foreground/70 mt-0.5">{connectedAs}</p>
        )}
      </div>
      <div className="shrink-0">
        {connected ? (
          <button
            onClick={onToggle}
            className="text-xs text-muted-foreground border rounded-md px-3 py-1.5 hover:bg-muted transition-colors"
          >
            Disconnect
          </button>
        ) : (
          <button
            onClick={onToggle}
            className="flex items-center gap-1 text-xs font-medium text-primary border border-primary/30 rounded-md px-3 py-1.5 hover:bg-primary/5 transition-colors"
          >
            <ChevronRight className="h-3.5 w-3.5" />
            Connect
          </button>
        )}
      </div>
    </div>
  )
}
