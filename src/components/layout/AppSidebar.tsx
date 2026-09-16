'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FilePlus2, FileText, LayoutDashboard, Package, Users } from 'lucide-react'
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
  useSidebar
} from '@/components/ui/sidebar'
import { routes } from '@/constants/routes'

const navItems = [
  { href: routes.dashboard, title: 'Dashboard', icon: LayoutDashboard },
  { href: routes.quotations, title: 'Cotizaciones', icon: FileText },
  { href: routes.quotationsNew, title: 'Nueva cotización', icon: FilePlus2 },
  { href: routes.customersNew, title: 'Clientes', icon: Users },
  { href: routes.productsNew, title: 'Productos', icon: Package }
]

function isNavActive(pathname: string, href: string) {
  if (href === routes.quotations) {
    return (
      pathname === href ||
      (pathname.startsWith(`${href}/`) && pathname !== routes.quotationsNew)
    )
  }

  return pathname === href
}

export function AppSidebar() {
  const pathname = usePathname()
  const { state } = useSidebar()

  return (
    <Sidebar collapsible="icon" variant="floating">
      <SidebarHeader className="px-3 py-4">
        <Link href={routes.dashboard} className="flex items-center gap-2">
          <Image
            src="/logo-pemofer.png"
            alt="Pemofer"
            width={state === 'expanded' ? 168 : 40}
            height={state === 'expanded' ? 70 : 40}
            className="rounded-sm object-contain"
          />
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Comercial</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isNavActive(pathname, item.href)}
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="px-3 pb-3 text-xs text-sidebar-foreground/70">
        {state === 'expanded' ? 'Pemofer Cotiza · piloto' : 'PC'}
      </SidebarFooter>
    </Sidebar>
  )
}
