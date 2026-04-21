'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, Toggle2, Plus, Edit2, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AutomationRule {
  id: string
  name: string
  category: string
  description: string
  trigger: string
  status: 'active' | 'paused'
}

const automationRules: AutomationRule[] = [
  {
    id: 'email-1',
    name: 'Client correspondence rule',
    category: 'Email rules',
    description: 'Draft suggested replies for emails from key clients within 4 hours. Flag if no draft exists after 2 hours.',
    trigger: 'Incoming emails from clients',
    status: 'active'
  },
  {
    id: 'board-1',
    name: 'Board communication rule',
    category: 'Email rules',
    description: 'Escalate all board-related communications immediately. Suggest formal reply templates.',
    trigger: 'Email from board member contacts',
    status: 'active'
  },
  {
    id: 'media-1',
    name: 'Media relations rule',
    category: 'Email rules',
    description: 'Flag incoming press/journalist requests and suggest holding response. Do not auto-reply.',
    trigger: 'Press mentions, interviews, press inquiries',
    status: 'active'
  },
  {
    id: 'contract-1',
    name: 'Contract management rule',
    category: 'Email rules',
    description: 'Alert when contract-related emails are received. Add to do-do list with 48-hour deadline.',
    trigger: 'Email containing keywords: contract, renewal, agreement, sign-off',
    status: 'paused'
  },
  {
    id: 'calendar-1',
    name: 'External meeting reschedule',
    category: 'Calendar rules',
    description: 'Suggest reschedule when external meetings overlap on a partner\'s calendar. Prioritize client meetings.',
    trigger: 'Meeting with competing time blocks',
    status: 'active'
  },
  {
    id: 'calendar-2',
    name: 'Leadership review blocks',
    category: 'Calendar rules',
    description: 'Automatically protect 2-hour prep blocks before any board or executive committee meetings.',
    trigger: 'Meeting with competing board/exec, leadership review',
    status: 'active'
  },
  {
    id: 'travel-1',
    name: 'Travel document rule',
    category: 'Travel rules',
    description: 'Alert when passport expiry is within 6 months and travel is booked. Support renewal.',
    trigger: 'Passport expiry date within 6 months AND upcoming international travel',
    status: 'active'
  },
  {
    id: 'travel-2',
    name: 'Flight monitoring',
    category: 'Travel rules',
    description: 'Monitor live flight status for all booked travel. Alert if delay exceeds 45 minutes.',
    trigger: 'Flight departure within 24 hours',
    status: 'active'
  },
  {
    id: 'travel-3',
    name: 'Personal travel rule',
    category: 'Travel rules',
    description: 'Manage personal travel bookings and reminders separately from business travel.',
    trigger: 'Calendar event tagged Personal with travel keywords',
    status: 'paused'
  },
  {
    id: 'doc-1',
    name: 'Document workflow',
    category: 'Document rules',
    description: 'Alert when documents are expiring soon (60+ hour). Escalate after 48 hours.',
    trigger: 'Document expiry event approaching',
    status: 'active'
  },
  {
    id: 'doc-2',
    name: 'Personal calendar',
    category: 'Document rules',
    description: 'Keep personal and professional calendar events separate. Flag scheduling conflicts.',
    trigger: 'Personal calendar event overlapping with work commitments',
    status: 'active'
  },
]

const categories = ['Email rules', 'Calendar rules', 'Travel rules', 'Document rules']

export function PreferencesContent() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    'Email rules': true,
    'Calendar rules': true,
    'Travel rules': false,
    'Document rules': false,
  })
  const [expandedNotifications, setExpandedNotifications] = useState(true)
  const [expandedIntegrations, setExpandedIntegrations] = useState(true)
  const [activeSection, setActiveSection] = useState('profile')

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }))
  }

  const sectionRules = (category: string) => automationRules.filter(r => r.category === category)

  return (
    <div className="flex gap-6">
      {/* Left sidebar */}
      <div className="w-48 flex flex-col gap-1">
        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-3 py-2">Sections</h3>
        {['EA Profile', 'Automation Rules', 'Notifications', 'Integrations'].map(section => {
          const sectionId = section.toLowerCase().replace(' ', '-')
          return (
            <button
              key={sectionId}
              onClick={() => setActiveSection(sectionId)}
              className={cn(
                'text-sm px-3 py-2 rounded transition-colors text-left',
                activeSection === sectionId
                  ? 'bg-muted text-foreground font-medium'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
              )}
            >
              {section}
            </button>
          )
        })}
      </div>

      {/* Main content */}
      <div className="flex-1">
        {/* EA Profile Section */}
        {activeSection === 'ea-profile' && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">EA Profile</h2>
              <button className="text-xs px-3 py-1.5 rounded border border-border hover:bg-muted transition-colors">
                Edit
              </button>
            </div>

            <div className="bg-muted/30 rounded-lg p-6 space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0">
                  <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg">
                    AM
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">Alex Morgan</h3>
                  <p className="text-sm text-muted-foreground">alex.morgan@mckinsey.com</p>
                  <p className="text-sm text-muted-foreground">McKinsey &amp; Company · London, GMT+1</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6 border-t border-border pt-6">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Role</p>
                  <p className="font-medium">Executive Assistant</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Timezone</p>
                  <p className="font-medium">Europe/London (GMT+0)</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Working Hours</p>
                  <p className="font-medium">Mon-Fri, 8:00 AM - 6:00 PM</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Partners managed</p>
                  <p className="font-medium flex items-center gap-1">
                    <span className="h-6 w-6 rounded bg-blue-100 text-blue-700 text-xs font-bold flex items-center justify-center">SC</span>
                    Sarah Chen
                    <span className="h-6 w-6 rounded bg-green-100 text-green-700 text-xs font-bold flex items-center justify-center">JW</span>
                    James Whitfield
                  </p>
                </div>
              </div>

              <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded border border-border">
                Partner-specific experience is enabled. Rules and insights are personalized for each partner you manage.
              </p>
            </div>
          </div>
        )}

        {/* Automation Rules Section */}
        {activeSection === 'automation-rules' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Automation Rules</h2>

            <div className="space-y-6">
              {categories.map(category => (
                <div key={category}>
                  <button
                    onClick={() => toggleSection(category)}
                    className="flex items-center gap-2 mb-3 text-sm font-semibold text-foreground hover:text-foreground/80 transition-colors"
                  >
                    {expandedSections[category] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                    {category}
                    <span className="ml-auto text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                      {sectionRules(category).filter(r => r.status === 'active').length} active
                    </span>
                  </button>

                  {expandedSections[category] && (
                    <div className="space-y-3 pl-5">
                      {sectionRules(category).map(rule => (
                        <div key={rule.id} className="bg-muted/30 rounded-lg p-3 border border-border/50">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className={cn(
                                  'h-2 w-2 rounded-full shrink-0',
                                  rule.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                                )} />
                                <h4 className="font-medium text-sm">{rule.name}</h4>
                                <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded capitalize">
                                  {rule.status === 'active' ? 'Active' : 'Paused'}
                                </span>
                              </div>
                              <p className="text-xs text-muted-foreground mb-2">{rule.description}</p>
                              <p className="text-xs text-muted-foreground"><strong>Trigger:</strong> {rule.trigger}</p>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button className="text-xs px-2 py-1 rounded hover:bg-muted transition-colors">
                                Edit
                              </button>
                              <button className={cn(
                                'h-5 w-9 rounded-full border transition-colors',
                                rule.status === 'active'
                                  ? 'bg-green-500 border-green-500'
                                  : 'bg-gray-200 border-gray-300'
                              )} />
                            </div>
                          </div>
                        </div>
                      ))}
                      <button className="text-xs text-blue-600 hover:text-blue-700 font-medium mt-2">
                        + Add rule
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Notifications Section */}
        {activeSection === 'notifications' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Notifications</h2>

            <div className="space-y-4">
              {[
                { id: 'in-app', title: 'In-app notifications', description: 'Show alerts and insights in the EA Central sidebar', enabled: true },
                { id: 'daily-digest', title: 'Daily email digest', description: 'Receive a summary of pending actions and insights each morning at 8:00 AM', enabled: true },
                { id: 'slack-dms', title: 'Slack DMAs', description: 'Send urgent alerts directly to your Slack account', enabled: false },
                { id: 'urgent-only', title: 'Urgent-only mode', description: 'Only surface notifications flagged as urgent or predicted risk', enabled: false },
              ].map(notif => (
                <div key={notif.id} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                  <div>
                    <h4 className="font-medium text-sm">{notif.title}</h4>
                    <p className="text-xs text-muted-foreground">{notif.description}</p>
                  </div>
                  <button className={cn(
                    'h-6 w-10 rounded-full border-2 transition-colors shrink-0',
                    notif.enabled
                      ? 'bg-blue-500 border-blue-500'
                      : 'bg-gray-200 border-gray-300'
                  )} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Integrations Section */}
        {activeSection === 'integrations' && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Integrations</h2>

            <div className="space-y-3">
              {[
                { name: 'Microsoft Outlook', description: 'Sync email and calendar. AI needs helps to surface insights.', status: 'Connected', icon: '📧' },
                { name: 'Slack', description: 'Send channel messages and DMs relevant to your priorities. Send alerts.', status: 'Connected', icon: '💬' },
                { name: 'Zoom', description: 'Automatically create Zoom links for scheduled video meetings.', status: 'Connect', icon: '📹' },
                { name: 'Google Workspace', description: 'Sync events to Microsoft 365, Gmail and Google Calendar.', status: 'Connect', icon: '🔗' },
              ].map(integration => (
                <div key={integration.name} className="flex items-center justify-between p-4 bg-muted/30 rounded-lg border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="text-xl">{integration.icon}</div>
                    <div>
                      <h4 className="font-medium text-sm">{integration.name}</h4>
                      <p className="text-xs text-muted-foreground">{integration.description}</p>
                    </div>
                  </div>
                  <button className={cn(
                    'text-xs px-3 py-1.5 rounded font-medium transition-colors',
                    integration.status === 'Connected'
                      ? 'text-muted-foreground hover:bg-muted'
                      : 'text-blue-600 hover:text-blue-700'
                  )}>
                    {integration.status === 'Connected' ? 'Disconnect' : 'Connect'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
