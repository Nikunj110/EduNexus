import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, BookOpen, Users, Plus } from 'lucide-react';
import { getClassDetails, getClassStudents, getSubjectList } from '@/redux/sclassRelated/sclassHandle';

const ClassDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { sclassDetails, sclassStudents, subjectsList, loading } = useSelector((state: any) => state.sclass);

  useEffect(() => {
    if (id) {
      dispatch(getClassDetails(id, 'Sclass') as any);
      dispatch(getClassStudents(id) as any);
      dispatch(getSubjectList(id, 'ClassSubjects') as any);
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
    rollNo: student.rollNum,
    attendance: '0%', // Will be calculated
  }));

  const subjects = subjectsList.map((subject: any) => ({
    id: subject._id,
    name: subject.subName,
    code: subject.subCode,
    teacher: subject.teacher?.name || 'Unassigned',
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/Admin/classes')}
        className="gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Classes
      </Button>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">{classData.name}</h2>
          <p className="text-muted-foreground mt-1">Class details and management</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{classData.students}</p>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-secondary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{classData.subjects}</p>
                <p className="text-sm text-muted-foreground">Subjects</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">93%</p>
                <p className="text-sm text-muted-foreground">Avg. Attendance</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="students" className="space-y-4">
        <TabsList>
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
                      <p className="text-sm text-muted-foreground">Roll No: {student.rollNo}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{student.attendance}</p>
                      <p className="text-xs text-muted-foreground">Attendance</p>
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
