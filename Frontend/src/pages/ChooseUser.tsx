import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, GraduationCap, Users } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../redux/userRelated/userHandle';
import { toast } from 'sonner';

interface ChooseUserProps {
  visitor?: string;
}

const ChooseUser = ({ visitor }: ChooseUserProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const password = "zxc";

  const { status, currentUser, currentRole } = useSelector((state: any) => state.user);

  const [loader, setLoader] = useState(false);

  const navigateHandler = (user: string) => {
    if (user === "Admin") {
      if (visitor === "guest") {
        const email = "yogendra@12";
        const fields = { email, password };
        setLoader(true);
        dispatch(loginUser(fields, user) as any);
      } else {
        navigate('/Adminlogin');
      }
    } else if (user === "Student") {
      if (visitor === "guest") {
        const rollNum = "1";
        const studentName = "Dipesh Awasthi";
        const fields = { rollNum, studentName, password };
        setLoader(true);
        dispatch(loginUser(fields, user) as any);
      } else {
        navigate('/Studentlogin');
      }
    } else if (user === "Teacher") {
      if (visitor === "guest") {
        const email = "tony@12";
        const fields = { email, password };
        setLoader(true);
        dispatch(loginUser(fields, user) as any);
      } else {
        navigate('/Teacherlogin');
      }
    }
  };

  useEffect(() => {
    if (status === 'success' || currentUser !== null) {
      if (currentRole === 'Admin') {
        navigate('/Admin/dashboard');
      } else if (currentRole === 'Student') {
        navigate('/Student/dashboard');
      } else if (currentRole === 'Teacher') {
        navigate('/Teacher/dashboard');
      }
    } else if (status === 'error') {
      setLoader(false);
      toast.error("Network Error");
    }
  }, [status, currentRole, navigate, currentUser]);

  const roles = [
    {
      id: 'Admin',
      title: 'Administrator',
      description: 'Login as an administrator to access the dashboard and manage app data.',
      icon: Shield,
      iconColor: 'text-primary',
      bgGradient: 'from-primary/10 to-primary/5'
    },
    {
      id: 'Student',
      title: 'Student',
      description: 'Login as a student to explore course materials and assignments.',
      icon: GraduationCap,
      iconColor: 'text-secondary',
      bgGradient: 'from-secondary/10 to-secondary/5'
    },
    {
      id: 'Teacher',
      title: 'Teacher',
      description: 'Login as a teacher to create courses, assignments, and track student progress.',
      icon: Users,
      iconColor: 'text-accent',
      bgGradient: 'from-accent/10 to-accent/5'
    }
  ];

  if (loader) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-foreground text-lg">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-top duration-700">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Choose Your Role
          </h1>
          <p className="text-muted-foreground text-lg">
            Select how you want to access the system
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role, index) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.id}
                className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group bg-card border-border/50 animate-in fade-in slide-in-from-bottom"
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => navigateHandler(role.id)}
              >
                <CardContent className="p-8 text-center space-y-6">
                  <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${role.bgGradient} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className={`w-10 h-10 ${role.iconColor}`} />
                  </div>
                  
                  <div className="space-y-3">
                    <h2 className="text-2xl font-bold text-card-foreground">
                      {role.title}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      {role.description}
                    </p>
                  </div>

                  <div className="pt-4">
                    <div className="inline-flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                      Continue
                      <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ChooseUser;
