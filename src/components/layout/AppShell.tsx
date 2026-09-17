'use client'

import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/layout/AppSidebar'
import { cn } from '@/lib/utils'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <main
        className={cn(
          'ml-auto flex h-svh w-full flex-col overflow-hidden',
          'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
          'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]'
        )}
      >
        <div className="h-full overflow-y-auto px-4 py-4">{children}</div>
      </main>
    </SidebarProvider>
  )
}
