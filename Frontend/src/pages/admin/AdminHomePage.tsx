import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, GraduationCap, DollarSign, TrendingUp, Clock } from 'lucide-react';

const AdminHomePage = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.user);

  // Placeholder data - replace with actual Redux calls
  const stats = [
    { title: 'Total Students', value: 150, icon: Users, bgColor: 'bg-primary/10', iconColor: 'text-primary', trend: '+12%' },
    { title: 'Total Classes', value: 12, icon: BookOpen, bgColor: 'bg-secondary/10', iconColor: 'text-secondary', trend: '+2' },
    { title: 'Total Teachers', value: 24, icon: GraduationCap, bgColor: 'bg-accent/10', iconColor: 'text-accent', trend: '+5' },
    { title: 'Total Revenue', value: '$45,231', icon: DollarSign, bgColor: 'bg-primary/10', iconColor: 'text-primary', trend: '+8%' },
  ];

  const recentActivities = [
    { action: 'New student enrolled', time: '2 minutes ago', type: 'success' },
    { action: 'Attendance marked for Class 10A', time: '15 minutes ago', type: 'info' },
    { action: 'New notice published', time: '1 hour ago', type: 'warning' },
    { action: 'Teacher assigned to subject', time: '2 hours ago', type: 'success' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Welcome Section */}
      <div className="bg-gradient-primary rounded-2xl p-8 text-primary-foreground">
        <h2 className="text-3xl font-bold mb-2">
          Welcome back, {currentUser?.name}!
        </h2>
        <p className="text-primary-foreground/80 text-lg">
          Here's what's happening with your school today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card 
              key={index} 
              className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`w-12 h-12 rounded-xl ${stat.bgColor} flex items-center justify-center`}>
                    <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                  <span className="text-sm font-medium text-secondary flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    {stat.trend}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-1">
                  {stat.value}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {stat.title}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-primary" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div 
                  key={index} 
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-secondary' :
                    activity.type === 'warning' ? 'bg-accent' :
                    'bg-primary'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {activity.action}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Add Student', icon: Users, href: '/Admin/students/add' },
                { label: 'Add Class', icon: BookOpen, href: '/Admin/classes/add' },
                { label: 'Add Teacher', icon: GraduationCap, href: '/Admin/teachers/add' },
                { label: 'New Notice', icon: Clock, href: '/Admin/notices/add' },
              ].map((action, index) => {
                const Icon = action.icon;
                return (
                  <button
                    key={index}
                    className="p-4 rounded-lg border border-border hover:bg-primary/5 hover:border-primary/50 transition-all group"
                  >
                    <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors mb-2" />
                    <p className="text-sm font-medium text-foreground">
                      {action.label}
                    </p>
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notices Section */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Latest Notices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No notices to display</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminHomePage;
