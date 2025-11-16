import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getClassStudents, getSubjectDetails } from '@/redux/sclassRelated/sclassHandle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, BookOpen, FileText, Clock } from 'lucide-react';
import SeeNotice from '@/components/SeeNotice';

const TeacherHomePage = () => {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.user);
  const { subjectDetails, sclassStudents } = useSelector((state: any) => state.sclass);

  const classID = currentUser.teachSclass?._id;
  const subjectID = currentUser.teachSubject?._id;

  useEffect(() => {
    if (subjectID) {
      dispatch(getSubjectDetails(subjectID, 'Subject') as any);
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
      title: 'Total Lessons',
      value: numberOfSessions,
      icon: BookOpen,
      color: 'text-secondary',
      bgColor: 'bg-secondary/10',
    },
    {
      title: 'Tests Taken',
      value: 24,
      icon: FileText,
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
    {
      title: 'Total Hours',
      value: '30 hrs',
      icon: Clock,
      color: 'text-muted-foreground',
      bgColor: 'bg-muted',
    },
  ];

  return (
    <div className="space-y-6">
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

      <Card>
        <CardHeader>
          <CardTitle>Recent Notices</CardTitle>
        </CardHeader>
        <CardContent>
          <SeeNotice />
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherHomePage;
