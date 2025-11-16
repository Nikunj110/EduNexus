import { Home, Users, MessageSquare, UserCircle, LogOut } from 'lucide-react';
import { useSelector } from 'react-redux';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { NavLink } from '@/components/NavLink';

export function TeacherSidebar() {
  const { currentUser } = useSelector((state: any) => state.user);
  const sclassName = currentUser?.teachSclass?.sclassName || '';

  const mainItems = [
    { title: 'Home', url: '/Teacher/dashboard', icon: Home },
    { title: `Class ${sclassName}`, url: '/Teacher/class', icon: Users },
    { title: 'Complain', url: '/Teacher/complain', icon: MessageSquare },
  ];

  const userItems = [
    { title: 'Profile', url: '/Teacher/profile', icon: UserCircle },
    { title: 'Logout', url: '/logout', icon: LogOut },
  ];

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} activeClassName="bg-muted text-primary font-medium">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>User</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {userItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} activeClassName="bg-muted text-primary font-medium">
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
