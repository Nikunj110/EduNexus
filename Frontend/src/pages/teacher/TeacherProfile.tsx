import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, School, BookOpen, Users } from 'lucide-react';

const TeacherProfile = () => {
  const { currentUser } = useSelector((state: any) => state.user);

  const teachSclass = currentUser?.teachSclass;
  const teachSubject = currentUser?.teachSubject;
  const teachSchool = currentUser?.school;

  const getInitials = (name: string) => {
    return name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Teacher Profile</h1>
        <p className="text-muted-foreground mt-1">View your profile information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarFallback className="text-2xl">
                {getInitials(currentUser?.name || '')}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{currentUser?.name}</h2>
              <p className="text-muted-foreground">Teacher</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email Address</p>
                <p className="font-medium">{currentUser?.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <Users className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class</p>
                <p className="font-medium">{teachSclass?.sclassName || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <BookOpen className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Subject</p>
                <p className="font-medium">{teachSubject?.subName || 'N/A'}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <School className="h-5 w-5 text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">School</p>
                <p className="font-medium">{teachSchool?.schoolName || 'N/A'}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherProfile;
