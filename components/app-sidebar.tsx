'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { useTheme } from 'next-themes'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  Mail, 
  Users, 
  Settings,
  Boxes,
  Moon,
  Sun,
  BookOpen,
  Lightbulb,
} from 'lucide-react'
import { colleagues } from '@/lib/data/colleagues'
import { getNeedsAttentionCountByColleague, insights, isNeedsAttention } from '@/lib/data/insights'
import { cn } from '@/lib/utils'

const otherNavItems = [
  { label: 'Contacts', href: '/contacts', icon: Users },
  { label: 'Resources', href: '/resources', icon: BookOpen },
]

export function AppSidebar() {
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const totalAttentionCount = insights.filter(isNeedsAttention).length
  
  const isInsightsActive = pathname.startsWith('/insights') || pathname.startsWith('/todo')
  const isInboxActive = pathname.startsWith('/inbox')

  return (
    <Sidebar className="border-r-0">
      <SidebarHeader className="px-4 py-5">
        <Link href="/todo" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-sidebar-accent">
            <Boxes className="h-4 w-4 text-sidebar-primary" />
          </div>
          <span className="text-base font-semibold text-sidebar-primary">EA Central</span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Navigation Section */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* All Insights */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === '/todo'}
                  className={cn(
                    'px-4 py-2 text-sm',
                    pathname === '/todo' && 'bg-sidebar-accent text-sidebar-accent-foreground'
                  )}
                >
                  <Link href="/todo">
                    <Lightbulb className="h-4 w-4" />
                    <span className="flex-1">All Insights</span>
                    <span className="text-xs text-sidebar-muted">{totalAttentionCount}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Inbox — single flat link */}
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={isInboxActive}
                  className={cn(
                    'px-4 py-2 text-sm',
                    isInboxActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
                  )}
                >
                  <Link href="/inbox">
                    <Mail className="h-4 w-4" />
                    <span>Inbox</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Other nav items */}
              {otherNavItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        'px-4 py-2 text-sm',
                        isActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
                      )}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Insights Section */}
        <SidebarGroup>
          <SidebarGroupLabel className="text-[#757575] text-xs font-medium uppercase tracking-wider px-4">
            Focus
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Colleagues */}
              {colleagues.map((colleague) => {
                const count = getNeedsAttentionCountByColleague(colleague.id)
                const isActive = pathname === `/todo/${colleague.id}` || pathname.startsWith(`/todo/${colleague.id}/`)

                return (
                  <SidebarMenuItem key={colleague.id}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      className={cn(
                        'px-4 py-2 text-sm',
                        isActive && 'bg-sidebar-accent text-sidebar-accent-foreground'
                      )}
                    >
                      <Link href={`/todo/${colleague.id}`}>
                        <span className={cn(
                          'flex-1 truncate',
                          isActive && 'font-medium'
                        )}>
                          {colleague.name}
                        </span>
                        <span className="text-xs text-sidebar-muted">{count}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>


      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <Avatar className="h-8 w-8">
            <AvatarFallback className="bg-sidebar-accent text-sidebar-accent-foreground text-xs">
              RW
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Ryan West</p>
          </div>
          <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-1.5 rounded-md hover:bg-sidebar-accent transition-colors"
              title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4 text-sidebar-muted" />
              ) : (
                <Moon className="h-4 w-4 text-sidebar-muted" />
              )}
            </button>
            <Link
              href="/settings"
              className={cn(
                'p-1.5 rounded-md hover:bg-sidebar-accent transition-colors',
                pathname === '/settings' && 'bg-sidebar-accent'
              )}
              title="Settings"
            >
              <Settings className="h-4 w-4 text-sidebar-muted" />
            </Link>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
