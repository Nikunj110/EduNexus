// FIX: This file is updated to fetch live data from Redux instead of using static placeholders.
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, GraduationCap, Bell, MessageSquare, Clock } from 'lucide-react';
import { getAllStudents } from '@/redux/studentRelated/studentHandle';
import { getAllTeachers } from '@/redux/teacherRelated/teacherHandle';
import { getAllSclasses } from '@/redux/sclassRelated/sclassHandle';
import { getAllNotices } from '@/redux/noticeRelated/noticeHandle';
import { RootState } from '@/redux/store';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { studentsList } = useSelector((state: RootState) => state.student);
  const { teachersList } = useSelector((state: RootState) => state.teacher);
  const { sclassesList } = useSelector((state: RootState) => state.sclass);
  const { noticesList } = useSelector((state: RootState) => state.notice);

  const adminID = currentUser._id;

  useEffect(() => {
    // Fetch all necessary data when the component mounts
    dispatch(getAllStudents(adminID) as any);
    dispatch(getAllTeachers(adminID) as any);
    dispatch(getAllSclasses(adminID) as any);
    dispatch(getAllNotices(adminID) as any); // FIX: Removed second 'Notice' argument
  }, [dispatch, adminID]);

  // Use the live data from Redux
  const stats = [
    {
      title: 'Total Students',
      value: studentsList?.length || 0,
      icon: Users,
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
    },
    {
      title: 'Total Classes',
      value: sclassesList?.length || 0,
      icon: BookOpen,
      bgColor: 'bg-secondary/10',
      iconColor: 'text-secondary',
    },
    {
      title: 'Total Teachers',
      value: teachersList?.length || 0,
      icon: GraduationCap,
      bgColor: 'bg-accent/10',
      iconColor: 'text-accent',
    },
    {
      title: 'Total Notices',
      value: noticesList?.length || 0,
      icon: Bell,
      bgColor: 'bg-primary/10',
      iconColor: 'text-primary',
    },
  ];

  const quickActions = [
    { label: 'Add Student', icon: Users, href: '/Admin/students' },
    { label: 'Add Class', icon: BookOpen, href: '/Admin/classes/add' },
    { label: 'Add Teacher', icon: GraduationCap, href: '/Admin/teachers/chooseclass' },
    { label: 'New Notice', icon: Clock, href: '/Admin/addnotice' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Admin Dashboard</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`w-5 h-5 ${stat.iconColor}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={index}
                    to={action.href}
                    className="p-4 rounded-lg border border-border hover:bg-primary/5 hover:border-primary/50 transition-all group flex items-center gap-4"
                  >
                    <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                    <p className="text-sm font-medium text-foreground">
                      {action.label}
                    </p>
                  </Link>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Notices Section - Now with real data */}
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Latest Notices</CardTitle>
            <Button asChild variant="outline" size="sm">
              <Link to="/Admin/notices">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            {noticesList && noticesList.length > 0 ? (
              <div className="space-y-4">
                {/* Show top 3 recent notices */}
                {noticesList.slice(0, 3).map((notice: any) => (
                  <div key={notice._id} className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-full">
                      <Bell className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground truncate">{notice.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(notice.date).toLocaleDateString()}
                      </p>
                    </div>
                    <Badge variant="secondary">New</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Bell className="w-12 h-12 mx-auto mb-2" />
                <p>No notices to display</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminHomePage;