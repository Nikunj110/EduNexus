import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getSubjectList } from '@/redux/sclassRelated/sclassHandle';
import { deleteUser } from '@/redux/userRelated/userHandle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Eye, BookOpen } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RootState } from '@/redux/store';
import { Skeleton } from '@/components/ui/skeleton';

const ShowSubjects = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { subjectsList, loading, error } = useSelector((state: RootState) => state.sclass);
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // FIX: Updated dispatch to pass a single object { id, address }
    dispatch(getSubjectList({ id: currentUser._id, address: 'AllSubjects' }) as any);
  }, [currentUser._id, dispatch]);

  const deleteHandler = (deleteID: string) => {
    toast({
      title: "Delete Disabled",
      description: "Sorry, the delete function has been disabled for now.",
      variant: "destructive"
    });
    // Example of correct delete dispatch (if enabled):
    // dispatch(deleteUser({ id: deleteID, address: "Subject" }) as any);
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-48" />
        </div>
        <Card className="border-border/50">
          <CardHeader>
            <Skeleton className="h-6 w-1/3" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-40 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Subjects</h2>
          <p className="text-muted-foreground">Manage all subjects in your school</p>
        </div>
        {/* Note: "Add Subject" flow usually starts with choosing a class first */}
        {/* <Button onClick={() => navigate('/Admin/addsubject')} className="gap-2 bg-gradient-primary">
          <Plus className="w-4 h-4" />
          Add Subject
        </Button> */}
      </div>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Subject List</CardTitle>
        </CardHeader>
        <CardContent>
          {subjectsList.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Subjects Yet</h3>
              <p>When you add subjects to classes, they will appear here.</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject Name</TableHead>
                    <TableHead>Sessions</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjectsList.map((subject: any) => (
                    <TableRow key={subject._id}>
                      <TableCell className="font-medium">{subject.subName}</TableCell>
                      <TableCell>{subject.sessions}</TableCell>
                      <TableCell>{subject.sclassName.sclassName}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => navigate(`/Admin/subjects/subject/${subject.sclassName._id}/${subject._id}`)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteHandler(subject._id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}\
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ShowSubjects;