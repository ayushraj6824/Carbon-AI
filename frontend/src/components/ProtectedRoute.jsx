import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { useLocation, Outlet, Link, Navigate } from "react-router-dom"
import { LeafIcon } from "lucide-react"
import { useAuth } from "@/context/AuthContext"
import { ModeToggle } from "./mode-toggle"
 
export default function ProtectedRoute() {
  const { user, token } = useAuth()
  const location = useLocation()
  
  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  const getPageTitle = (path) => {
    switch (path) {
      case "/dashboard": return "Dashboard"
      case "/result": return "Validation Result"
      case "/history": return "Claim History"
      case "/marketplace": return "Marketplace"
      default: return "Dashboard"
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 bg-background/95 backdrop-blur border-b transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex w-full items-center justify-between gap-2 px-4">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />
              <Breadcrumb className="hidden sm:block">
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link to="/" className="flex items-center gap-1">
                        <LeafIcon className="h-4 w-4 text-primary" />
                        <span className="hidden md:inline text-foreground font-medium">Carbon AI</span>
                      </Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{getPageTitle(location.pathname)}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>

              {/* Mobile Title */}
              <div className="sm:hidden flex items-center gap-2">
                <LeafIcon className="h-4 w-4 text-primary" />
                <span className="text-sm font-bold truncate max-w-[120px]">
                  {getPageTitle(location.pathname)}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Optional: Add user avatar or search here if needed */}
              <div className="hidden xs:flex items-center gap-2 text-xs text-muted-foreground">
                <div className="size-2 rounded-full bg-green-500 animate-pulse" />
                AI Online
              </div>
              <ModeToggle/>
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
