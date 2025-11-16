import { 
  Home, 
  Users, 
  BookOpen, 
  GraduationCap, 
  UserCircle, 
  Bell, 
  MessageSquare, 
  LogOut 
} from 'lucide-react';
import { NavLink } from '@/components/NavLink';
import { useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Dashboard', url: '/Admin/dashboard', icon: Home },
  { title: 'Classes', url: '/Admin/classes', icon: BookOpen },
  { title: 'Subjects', url: '/Admin/subjects', icon: GraduationCap },
  { title: 'Teachers', url: '/Admin/teachers', icon: Users },
  { title: 'Students', url: '/Admin/students', icon: UserCircle },
  { title: 'Notices', url: '/Admin/notices', icon: Bell },
  { title: 'Complains', url: '/Admin/complains', icon: MessageSquare },
];

export function AdminSidebar() {
  const { open } = useSidebar();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <Sidebar className={open ? 'w-64' : 'w-16'} collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={!open ? 'sr-only' : ''}>
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={item.url}
                        className="flex items-center gap-3 hover:bg-sidebar-accent transition-colors"
                        activeClassName="bg-sidebar-accent text-primary font-medium"
                      >
                        <Icon className="h-5 w-5" />
                        {open && <span>{item.title}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
              
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/logout"
                    className="flex items-center gap-3 hover:bg-destructive/10 text-destructive transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    {open && <span>Logout</span>}
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
