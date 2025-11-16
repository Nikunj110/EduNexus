// FIX: Dispatch calls for 'getClassDetails' and 'getSubjectList' in useEffect are updated to the correct format (single 'id' or single object) for our new 'sclassHandle.ts'.
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, Users, Plus, Eye, Trash2 } from 'lucide-react';
import { getClassDetails, getClassStudents, getSubjectList } from '@/redux/sclassRelated/sclassHandle';
import { RootState } from '@/redux/store';
import { Skeleton } from '@/components/ui/skeleton';

const ClassDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { sclassDetails, sclassStudents, subjectsList, loading } = useSelector((state: RootState) => state.sclass);

  useEffect(() => {
    if (id) {
      // FIX 1: Removed second argument 'Sclass'
      dispatch(getClassDetails(id) as any);
      
      dispatch(getClassStudents(id) as any);
      
      // FIX 2: Updated to pass a single object { id, address }
      dispatch(getSubjectList({ id, address: 'ClassSubjects' }) as any);
    }
  }, [id, dispatch]);

  const classData = {
    name: sclassDetails?.sclassName || 'Loading...',
    students: sclassStudents?.length || 0,
    subjects: subjectsList?.length || 0,
  };

  const students = sclassStudents.map((student: any) => ({
    id: student._id,
    name: student.name,
    rollNum: student.rollNum,
  }));

  const subjects = subjectsList.map((subject: any) => ({
    id: subject._id,
    name: subject.subName,
    code: subject.subCode,
    teacher: subject.teacher?.name || 'Not Assigned',
  }));

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-9 w-48" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
          <Skeleton className="h-24" />
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate('/Admin/classes')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-foreground">{classData.name}</h2>
          <p className="text-muted-foreground">Class Details</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Class Name</CardTitle>
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classData.name}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classData.students}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classData.subjects}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="subjects">Subjects</TabsTrigger>
        </TabsList>

        <TabsContent value="students" className="space-y-4">
          <div className="flex justify-end">
            <Button className="gap-2 bg-gradient-primary">
              <Plus className="w-4 h-4" />
              Add Student
            </Button>
          </div>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Student List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {students.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">{student.name}</p>
                      <p className="text-sm text-muted-foreground">Roll No: {student.rollNum}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" className="gap-1">
                        <Eye className="w-4 h-4" /> View
                      </Button>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="subjects" className="space-y-4">
          <div className="flex justify-end">
            <Button className="gap-2 bg-gradient-primary">
              <Plus className="w-4 h-4" />
              Add Subject
            </Button>
          </div>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Subject List</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {subjects.map((subject) => (
                  <div
                    key={subject.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-foreground">{subject.name}</p>
                      <p className="text-sm text-muted-foreground">Code: {subject.code}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{subject.teacher}</p>
                      <p className="text-xs text-muted-foreground">Teacher</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClassDetails;