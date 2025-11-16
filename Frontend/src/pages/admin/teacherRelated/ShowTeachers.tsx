import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllTeachers } from '@/redux/teacherRelated/teacherHandle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Eye, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ShowTeachers = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { teachersList, loading, error, response } = useSelector((state: any) => state.teacher);
  const { currentUser } = useSelector((state: any) => state.user);

  useEffect(() => {
    dispatch(getAllTeachers(currentUser._id) as any);
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
          <h1 className="text-3xl font-bold text-foreground">Teachers</h1>
          <p className="text-muted-foreground mt-1">Manage all teachers in your school</p>
        </div>
        <Button onClick={() => navigate('/Admin/teachers/chooseclass')} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Teacher
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Teachers</CardTitle>
        </CardHeader>
        <CardContent>
          {response || !teachersList || teachersList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No teachers found</p>
              <Button onClick={() => navigate('/Admin/teachers/chooseclass')} variant="outline">
                Add First Teacher
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Subject</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teachersList.map((teacher: any) => (
                    <TableRow key={teacher._id}>
                      <TableCell className="font-medium">{teacher.name}</TableCell>
                      <TableCell>{teacher.teachSubject?.subName || '-'}</TableCell>
                      <TableCell>{teacher.teachSclass?.sclassName || '-'}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/Admin/teachers/teacher/${teacher._id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteHandler(teacher._id)}
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

export default ShowTeachers;
