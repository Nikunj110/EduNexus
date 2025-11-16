// FIX: The dispatch for 'getSubjectDetails' in useEffect now correctly passes only the 'subjectID', as required by our new 'sclassHandle.ts'.
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getClassStudents, getSubjectDetails } from '@/redux/sclassRelated/sclassHandle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, FileText, Clock } from 'lucide-react';
import SeeNotice from '@/components/SeeNotice';
import { RootState } from '@/redux/store';
import { Skeleton } from '@/components/ui/skeleton';

const TeacherHomePage = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.user);
  const { subjectDetails, sclassStudents, loading } = useSelector((state: RootState) => state.sclass);

  const classID = currentUser.teachSclass?._id;
  const subjectID = currentUser.teachSubject?._id;

  useEffect(() => {
    if (subjectID) {
      // FIX: Removed the second argument 'Subject'
      dispatch(getSubjectDetails(subjectID) as any);
    }
    if (classID) {
      dispatch(getClassStudents(classID) as any);
    }
  }, [dispatch, subjectID, classID]);

  const numberOfStudents = sclassStudents?.length || 0;
  const numberOfSessions = subjectDetails?.sessions || 0;

  const stats = [
    {
      title: 'Class Students',
      value: numberOfStudents,
      icon: Users,
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      title: 'Total Sessions',
      value: numberOfSessions,
      icon: BookOpen,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Attendance Taken',
      value: 0, // Placeholder
      icon: FileText,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Total Hours',
      value: 0, // Placeholder
      icon: Clock,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
  ];
  
  if (loading) {
     return (
       <div className="space-y-6 animate-in fade-in duration-500">
         <Skeleton className="h-9 w-48" />
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
           {[...Array(4)].map((_, i) => (
             <Card key={i} className="border-border/50">
               <CardContent className="p-6">
                 <Skeleton className="h-16 w-full" />
               </CardContent>
             </Card>
           ))}
         </div>
         <Skeleton className="h-64 w-full" />
       </div>
     );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Teacher Dashboard</h1>
        <p className="text-muted-foreground mt-1">Overview of your teaching activities</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">{stat.title}</p>
                  <p className="text-3xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <SeeNotice />
    </div>
  );
};

export default TeacherHomePage;