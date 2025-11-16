import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllStudents } from '@/redux/studentRelated/studentHandle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Eye, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ShowStudents = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { studentsList, loading, error } = useSelector((state: any) => state.student);
  const { currentUser } = useSelector((state: any) => state.user);

  useEffect(() => {
    dispatch(getAllStudents(currentUser._id) as any);
  }, [currentUser._id, dispatch]);

  const deleteHandler = (deleteID: string) => {
    toast({
      title: "Delete Disabled",
      description: "Sorry, the delete function has been disabled for now.",
      variant: "destructive"
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Students</h1>
          <p className="text-muted-foreground mt-1">Manage all students in your school</p>
        </div>
        <Button onClick={() => navigate('/Admin/students/chooseclass')} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Student
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
        </CardHeader>
        <CardContent>
          {!studentsList || studentsList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No students found</p>
              <Button onClick={() => navigate('/Admin/students/chooseclass')} variant="outline">
                Add First Student
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Roll Number</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {studentsList.map((student: any) => (
                    <TableRow key={student._id}>
                      <TableCell className="font-medium">{student.name}</TableCell>
                      <TableCell>{student.rollNum}</TableCell>
                      <TableCell>{student.sclassName?.sclassName}</TableCell>
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
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteHandler(student._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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

export default ShowStudents;
