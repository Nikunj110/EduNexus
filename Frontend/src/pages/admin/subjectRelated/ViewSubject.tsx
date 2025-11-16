import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getClassStudents, getSubjectDetails } from '@/redux/sclassRelated/sclassHandle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Eye, ClipboardList, FileText } from 'lucide-react';

const ViewSubject = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { subloading, subjectDetails, sclassStudents, getresponse } = useSelector((state: any) => state.sclass);
  const { classID, subjectID } = params;
  const [selectedView, setSelectedView] = useState('attendance');

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, 'Subject') as any);
    dispatch(getClassStudents(classID) as any);
  }, [dispatch, subjectID, classID]);

  if (subloading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const numberOfStudents = sclassStudents?.length || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subject Details</h1>
          <p className="text-muted-foreground mt-1">{subjectDetails?.subName}</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/Admin/subjects')}>
          Back to Subjects
        </Button>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Subject Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Subject Name</p>
                  <p className="text-lg font-medium">{subjectDetails?.subName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Subject Code</p>
                  <p className="text-lg font-medium">{subjectDetails?.subCode}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Sessions</p>
                  <p className="text-lg font-medium">{subjectDetails?.sessions}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Number of Students</p>
                  <p className="text-lg font-medium">{numberOfStudents}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Class Name</p>
                  <p className="text-lg font-medium">{subjectDetails?.sclassName?.sclassName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Teacher</p>
                  {subjectDetails?.teacher ? (
                    <p className="text-lg font-medium">{subjectDetails.teacher.name}</p>
                  ) : (
                    <Button
                      size="sm"
                      className="mt-2"
                      onClick={() => navigate(`/Admin/teachers/addteacher/${subjectDetails?._id}`)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Teacher
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          {getresponse ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-muted-foreground mb-4">No students found in this class</p>
                <Button onClick={() => navigate(`/Admin/class/addstudents/${classID}`)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Students
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              <div className="flex gap-2 mb-4">
                <Button
                  variant={selectedView === 'attendance' ? 'default' : 'outline'}
                  onClick={() => setSelectedView('attendance')}
                  className="gap-2"
                >
                  <ClipboardList className="h-4 w-4" />
                  Attendance
                </Button>
                <Button
                  variant={selectedView === 'marks' ? 'default' : 'outline'}
                  onClick={() => setSelectedView('marks')}
                  className="gap-2"
                >
                  <FileText className="h-4 w-4" />
                  Marks
                </Button>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Students List</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Roll No.</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {sclassStudents.map((student: any) => (
                          <TableRow key={student._id}>
                            <TableCell className="font-medium">{student.rollNum}</TableCell>
                            <TableCell>{student.name}</TableCell>
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
                                    onClick={() => navigate(`/Admin/subject/student/attendance/${student._id}/${subjectID}`)}
                                  >
                                    Take Attendance
                                  </Button>
                                ) : (
                                  <Button
                                    size="sm"
                                    onClick={() => navigate(`/Admin/subject/student/marks/${student._id}/${subjectID}`)}
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
