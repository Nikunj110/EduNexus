import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getClassStudents, getSubjectDetails } from '@/redux/sclassRelated/sclassHandle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Eye, ClipboardList, FileText, ArrowLeft, Users, BookOpen, Clock } from 'lucide-react';
import { RootState } from '@/redux/store';
import { Skeleton } from '@/components/ui/skeleton';

const ViewSubject = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { subloading, subjectDetails, sclassStudents } = useSelector((state: RootState) => state.sclass);
  
  const { classID, subjectID } = params;
  const [selectedView, setSelectedView] = useState('attendance');

  useEffect(() => {
    // FIX: Removed the second argument 'Subject'
    dispatch(getSubjectDetails(subjectID) as any);
    dispatch(getClassStudents(classID) as any);
  }, [dispatch, subjectID, classID]);

  if (subloading) {
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
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-foreground">{subjectDetails?.subName}</h2>
          <p className="text-muted-foreground">{subjectDetails?.sclassName?.sclassName}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subject Code</CardTitle>
            <BookOpen className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjectDetails?.subCode}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sclassStudents?.length || 0}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Clock className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjectDetails?.sessions}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="attendance" onValueChange={setSelectedView} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="attendance" className="gap-2">
            <ClipboardList className="w-4 h-4" /> Attendance
          </TabsTrigger>
          <TabsTrigger value="marks" className="gap-2">
            <FileText className="w-4 h-4" /> Marks
          </TabsTrigger>
        </TabsList>

        <TabsContent value={selectedView} className="mt-4">
          {!sclassStudents || sclassStudents.length === 0 ? (
            <Card className="border-border/50">
              <CardContent className="text-center py-12 text-muted-foreground">
                <Users className="w-16 h-16 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-foreground mb-2">No Students in Class</h3>
                <p>Add students to this class to manage attendance and marks.</p>
              </CardContent>
            </Card>
          ) : (
            <>
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>Manage {selectedView === 'attendance' ? 'Attendance' : 'Marks'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student Name</TableHead>
                          <TableHead>Roll No.</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sclassStudents.map((student: any) => (
                          <TableRow key={student._id}>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>{student.rollNum}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => navigate(`/Admin/students/student/${student._id}`)}
                                >
                                  <Eye className="h-4 w-4 mr-1" />
                                  View
                                </Button>
                                {selectedView === 'attendance' ? (
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => navigate(`/Admin/students/student/attendance/${student._id}/${subjectID}`)}
                                  >
                                    Take Attendance
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    variant="default"
                                    onClick={() => navigate(`/Admin/students/student/marks/${student._id}/${subjectID}`)}
                                  >
                                    Provide Marks
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ViewSubject;