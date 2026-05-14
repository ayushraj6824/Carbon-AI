import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { LogOutIcon } from "lucide-react"
import { useAuth } from '@/context/AuthContext'

export function NavUser() {
  const { user, logout } = useAuth()

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center justify-between px-2 py-1.5">
          <div className="grid text-left text-sm leading-tight">
            <span className="truncate font-medium">{user.name}</span>
            <span className="truncate text-xs text-muted-foreground">{user.email}</span>
          </div>
          <SidebarMenuButton
            size="sm"
            onClick={logout}
            className="w-auto ml-2 text-muted-foreground hover:text-destructive"
            tooltip="Log out"
          >
            <LogOutIcon className="size-4" />
          </SidebarMenuButton>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}