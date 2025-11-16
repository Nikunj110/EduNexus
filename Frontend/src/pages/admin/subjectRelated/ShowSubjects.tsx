import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getSubjectList } from '@/redux/sclassRelated/sclassHandle';
import { deleteUser } from '@/redux/userRelated/userHandle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Plus, Trash2, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const ShowSubjects = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const { subjectsList, loading, error } = useSelector((state: any) => state.sclass);
  const { currentUser } = useSelector((state: any) => state.user);

  useEffect(() => {
    dispatch(getSubjectList(currentUser._id, 'AllSubjects') as any);
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

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-destructive">Error loading subjects: {error}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Subjects</h1>
          <p className="text-muted-foreground mt-1">Manage all subjects in your school</p>
        </div>
        <Button onClick={() => navigate('/Admin/subjects/chooseclass')} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Subject
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          {!subjectsList || subjectsList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No subjects found</p>
              <Button onClick={() => navigate('/Admin/subjects/chooseclass')} variant="outline">
                Add First Subject
              </Button>
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

export default ShowSubjects;
