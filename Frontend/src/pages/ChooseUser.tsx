import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, GraduationCap, Users } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/redux/userRelated/userHandle'; // <-- FIX 1: Path alias updated
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
        // FIX 2: Dispatch with a single object argument
        dispatch(loginUser({ credentials: fields, role: user }) as any);
      } else {
        navigate('/Adminlogin');
      }
    } else if (user === "Student") {
      if (visitor === "guest") {
        const rollNum = "1";
        const studentName = "Dipesh Awasthi";
        const fields = { rollNum, studentName, password };
        setLoader(true);
        // FIX 2: Dispatch with a single object argument
        dispatch(loginUser({ credentials: fields, role: user }) as any);
      } else {
        navigate('/Studentlogin');
      }
    } else if (user === "Teacher") {
      if (visitor === "guest") {
        const email = "tony@12";
        const fields = { email, password };
        setLoader(true);
        // FIX 2: Dispatch with a single object argument
        dispatch(loginUser({ credentials: fields, role: user }) as any);
      } else {
        navigate('/Teacherlogin');
      }
    }
  };

  useEffect(() => {
    if (status === 'success' && currentUser) {
      if (currentRole === 'Admin') {
        navigate('/Admin/dashboard');
      } else if (currentRole === 'Student') {
        navigate('/Student/dashboard');
      } else if (currentRole === 'Teacher') {
        navigate('/Teacher/dashboard');
      }
    } else if (status === 'failed') {
      // Our new authService already shows a detailed toast,
      // so we just need to handle the loader state.
      setLoader(false);
    }
  }, [status, currentRole, navigate, currentUser]);

  const userRoles = [
    {
      title: 'Admin',
      id: 'Admin',
      icon: Shield,
      description: 'Manage school, classes, students, and teachers. Full administrative control.',
      bgGradient: 'from-blue-500 to-blue-600',
      iconColor: 'text-blue-100',
    },
    {
      title: 'Student',
      id: 'Student',
      icon: GraduationCap,
      description: 'Access your subjects, attendance, marks, and submit complaints.',
      bgGradient: 'from-green-500 to-green-600',
      iconColor: 'text-green-100',
    },
    {
      title: 'Teacher',
      id: 'Teacher',
      icon: Users,
      description: 'Manage your class, take attendance, provide marks, and view student progress.',
      bgGradient: 'from-purple-500 to-purple-600',
      iconColor: 'text-purple-100',
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="w-full max-w-5xl text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 animate-in fade-in slide-in-from-top duration-500">
          Welcome to <span className="text-primary">EduFlow Forge</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mb-12 animate-in fade-in slide-in-from-top duration-500 delay-100">
          Please select your role to continue
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {userRoles.map((role, index) => {
            const Icon = role.icon;
            return (
              <Card
                key={role.id}
                className="cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 group bg-card border-border/50 animate-in fade-in slide-in-from-bottom"
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


