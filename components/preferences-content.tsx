'use client'

import { useState } from 'react'
import { ChevronDown, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'

export function PreferencesContent() {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    email: true,
    calendar: true,
    travel: false,
    document: false,
  })
  const [automationRules, setAutomationRules] = useState<Record<string, boolean>>({
    'client-correspondence': true,
    'board-communication': true,
    'media-relations': true,
    'contract-management': false,
    'external-meeting': true,
    'leadership-review': true,
    'client-transformation': true,
    'schedule-gaps': true,
    'travel-document': true,
    'flight-monitoring': true,
    'personal-travel': false,
    'document-workflow': true,
    'personal-calendar': true,
  })
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    'in-app': true,
    'email-digest': true,
    'slack-dms': false,
    'urgent-only': false,
  })

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const automationCategories = [
    {
      id: 'email',
      title: 'Email rules',
      count: 4,
      rules: [
        { id: 'client-correspondence', name: 'Client correspondence rule', status: 'Active', description: 'Draft suggested replies for emails from key clients within 4 hours. Flag if no draft exists after 2 hours.' },
        { id: 'board-communication', name: 'Board communication rule', status: 'Active', description: 'Escalate all board-level correspondence immediately. Suggest formal reply templates.' },
        { id: 'media-relations', name: 'Media relations rule', status: 'Active', description: 'Flag incoming press/journalist requests and suggest holding response. Do not auto-reply.' },
        { id: 'contract-management', name: 'Contract management rule', status: 'Paused', description: 'Alert when contract-related emails are received. Add to to-do with 48-hour deadline.' },
      ],
    },
    {
      id: 'calendar',
      title: 'Calendar rules',
      count: 4,
      rules: [
        { id: 'external-meeting', name: 'External meeting reschedule', status: 'Active', description: 'Suggest reschedule when external meetings overlap on a partner\'s calendar. Prioritize client meetings.' },
        { id: 'leadership-review', name: 'Leadership review blocks', status: 'Active', description: 'Automatically protect 2-hour prep blocks before any board or executive committee meetings.' },
        { id: 'client-transformation', name: 'Client Transformation Program', status: 'Active', description: 'Reserve weekly Wednesday 3pm slot for Acme steering committee. Decline conflicts automatically.' },
        { id: 'schedule-gaps', name: 'Schedule gap alerts', status: 'Active', description: 'Alert when a key contact has not been met in longer than the usual cadence. Propose new slot.' },
      ],
    },
    {
      id: 'travel',
      title: 'Travel rules',
      count: 3,
      rules: [
        { id: 'travel-document', name: 'Travel document rule', status: 'Active', description: 'Alert when passport expiry is within 6 months and travel is booked. Suggested renewals.' },
        { id: 'flight-monitoring', name: 'Flight monitoring', status: 'Active', description: 'Monitor live flight status for all booked travel. Alert if delay exceeds 45 minutes.' },
        { id: 'personal-travel', name: 'Personal travel rule', status: 'Paused', description: 'Manage personal travel bookings and reminders separately from business travel.' },
      ],
    },
    {
      id: 'document',
      title: 'Document rules',
      count: 2,
      rules: [
        { id: 'document-workflow', name: 'Document workflow', status: 'Active', description: 'Alert when documents are nearing sign-off for more than 24 hours. Escalate after 48 hours.' },
        { id: 'personal-calendar', name: 'Personal calendar', status: 'Active', description: 'Keep personal and professional calendar events separate. Flag scheduling conflicts.' },
      ],
    },
  ]

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-xl font-semibold text-foreground mb-1">Preferences</h1>
        <p className="text-sm text-muted-foreground">Configure your EA Central settings and automation rules</p>
      </div>

      {/* EA Profile */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">EA Profile</h2>
        </div>
        
        <div className="bg-muted/30 rounded-lg p-6 border border-border">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
                AM
              </div>
              <div>
                <h3 className="font-semibold text-sm text-foreground">Alex Morgan</h3>
                <p className="text-xs text-muted-foreground">alex.morgan@mckinsey.com</p>
                <p className="text-xs text-muted-foreground">McKinsey & Company • London, GMT+1</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" className="h-8 px-2 text-xs">
              Edit
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Role</p>
              <p className="text-foreground font-medium">Executive Assistant</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Timezone</p>
              <p className="text-foreground font-medium">Europe/London (GMT+0)</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Working hours</p>
              <p className="text-foreground font-medium">Mon-Fri, 8:00 AM - 6:30 PM</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Partners managed</p>
              <div className="flex gap-1">
                <span className="inline-block px-2 py-0.5 rounded bg-muted text-xs text-foreground">Sarah Chen</span>
                <span className="inline-block px-2 py-0.5 rounded bg-muted text-xs text-foreground">James Whitfield</span>
              </div>
            </div>
          </div>

          <p className="text-xs text-muted-foreground mt-4 flex items-start gap-2">
            <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            Partner-specific experience is enabled. Rules and insights are personalized for each partner you manage.
          </p>
        </div>
      </section>

      {/* Automation Rules */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Automation Rules</h2>
        
        <div className="space-y-3">
          {automationCategories.map((category) => {
            const activeCount = category.rules.filter(r => automationRules[r.id]).length
            return (
              <div key={category.id} className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(category.id)}
                  className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <ChevronDown className={cn('h-4 w-4 text-muted-foreground transition-transform', !expandedSections[category.id] && '-rotate-90')} />
                    <h3 className="font-semibold text-sm text-foreground">{category.title}</h3>
                    <span className="text-xs text-muted-foreground">{activeCount} active</span>
                  </div>
                </button>

                {expandedSections[category.id] && (
                  <div className="border-t border-border divide-y divide-border">
                    {category.rules.map((rule) => (
                      <div key={rule.id} className="px-4 py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm text-foreground">{rule.name}</h4>
                              <span className={cn('text-xs px-1.5 py-0.5 rounded font-medium', rule.status === 'Active' ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' : 'bg-muted text-muted-foreground')}>
                                {rule.status}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">{rule.description}</p>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0 ml-3">
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
                              Edit
                            </Button>
                            <Switch checked={automationRules[rule.id]} onCheckedChange={(checked) => setAutomationRules(prev => ({ ...prev, [rule.id]: checked }))} />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <Button variant="ghost" className="mt-4 h-8 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950 px-2">
          + Add rule
        </Button>
      </section>

      {/* Notifications */}
      <section className="mb-8">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Notifications</h2>
        
        <div className="space-y-2.5">
          {[
            { id: 'in-app', name: 'In-app notifications', description: 'Show alerts and insights in the EA Central sidebar' },
            { id: 'email-digest', name: 'Daily email digest', description: 'Receive a summary of pending actions and insights each morning at 8:00 AM' },
            { id: 'slack-dms', name: 'Slack DMAs', description: 'Send urgent alerts directly to your Slack account' },
            { id: 'urgent-only', name: 'Urgent-only mode', description: 'Only surface notifications flagged as urgent or predicted risk' },
          ].map((notif) => (
            <div key={notif.id} className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
              <div>
                <p className="font-medium text-sm text-foreground">{notif.name}</p>
                <p className="text-xs text-muted-foreground">{notif.description}</p>
              </div>
              <Switch checked={notifications[notif.id]} onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, [notif.id]: checked }))} />
            </div>
          ))}
        </div>
      </section>

      {/* Integrations */}
      <section>
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Integrations</h2>
        
        <div className="space-y-2.5">
          {[
            { id: 'outlook', name: 'Microsoft Outlook', description: 'Sync email and calendar. AI reads inbox to surface insights.', status: 'Connected' },
            { id: 'slack', name: 'Slack', description: 'Read channel messages and DMs relevant to your partners. Send alerts.', status: 'Connected' },
            { id: 'zoom', name: 'Zoom', description: 'Automatically create Zoom links for scheduled video meetings.', status: 'Not connected' },
            { id: 'google', name: 'Google Workspace', description: 'Alternative to Microsoft 365. Sync Gmail and Google Calendar.', status: 'Not connected' },
          ].map((integration) => (
            <div key={integration.id} className="flex items-start justify-between p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-sm text-foreground">{integration.name}</h3>
                  <span className={cn('text-xs px-1.5 py-0.5 rounded', integration.status === 'Connected' ? 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300' : 'bg-muted text-muted-foreground')}>
                    {integration.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">{integration.description}</p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 px-3 text-xs ml-3 shrink-0">
                {integration.status === 'Connected' ? 'Disconnect' : 'Connect'}
              </Button>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}

