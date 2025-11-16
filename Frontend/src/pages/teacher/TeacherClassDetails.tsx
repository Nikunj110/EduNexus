import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getClassStudents } from '@/redux/sclassRelated/sclassHandle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Eye, MoreVertical, ClipboardCheck, FileText } from 'lucide-react';

const TeacherClassDetails = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sclassStudents, loading, getresponse } = useSelector((state: any) => state.sclass);
  const { currentUser } = useSelector((state: any) => state.user);

  const classID = currentUser?.teachSclass?._id;
  const subjectID = currentUser?.teachSubject?._id;

  useEffect(() => {
    if (classID) {
      dispatch(getClassStudents(classID) as any);
    }
  }, [dispatch, classID]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Class Details</h1>
        <p className="text-muted-foreground mt-1">
          Manage students in {currentUser?.teachSclass?.sclassName}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Students List</CardTitle>
        </CardHeader>
        <CardContent>
          {getresponse || !sclassStudents || sclassStudents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No students found in this class</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Roll Number</TableHead>
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
                            onClick={() => navigate(`/Teacher/class/student/${student._id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button size="sm" variant="outline">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/Teacher/class/student/attendance/${student._id}/${subjectID}`)
                                }
                              >
                                <ClipboardCheck className="h-4 w-4 mr-2" />
                                Take Attendance
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() =>
                                  navigate(`/Teacher/class/student/marks/${student._id}/${subjectID}`)
                                }
                              >
                                <FileText className="h-4 w-4 mr-2" />
                                Provide Marks
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherClassDetails;
