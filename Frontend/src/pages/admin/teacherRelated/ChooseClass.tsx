// FIX: The dispatch call for 'getAllSclasses' in useEffect now correctly passes only the 'adminID', as required by our new 'sclassHandle.ts'.
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllSclasses } from '@/redux/sclassRelated/sclassHandle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowLeft, BookOpen } from 'lucide-react';
import { RootState } from '@/redux/store';
import { Skeleton } from '@/components/ui/skeleton';

interface ChooseClassProps {
  situation?: string;
}

const ChooseClass = ({ situation }: ChooseClassProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sclassesList, loading, getresponse } = useSelector((state: RootState) => state.sclass);
  const { currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // FIX: Removed the second argument 'Sclass'
    dispatch(getAllSclasses(currentUser._id) as any);
  }, [currentUser._id, dispatch]);

  const navigateHandler = (classID: string) => {
    if (situation === 'Teacher') {
      // This route seems to be part of a multi-step flow.
      // We'll assume '/Admin/teachers/choosesubject/' is the next step.
      navigate(`/Admin/teachers/choosesubject/${classID}`);
    } else if (situation === 'Subject') {
      navigate(`/Admin/addsubject/${classID}`);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <Skeleton className="h-9 w-48" />
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
    <div className="space-y-6 max-w-2xl mx-auto animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-foreground">
            {situation === 'Teacher' ? 'Assign Teacher' : 'Add Subject'}
          </h2>
          <p className="text-muted-foreground">Step 1: Choose a Class</p>
        </div>
      </div>
      
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Available Classes</CardTitle>
        </CardHeader>
        <CardContent>
          {!sclassesList || sclassesList.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="w-16 h-16 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No Classes Found</h3>
              <p className="mb-6">You must add a class before you can assign teachers or subjects.</p>
              <Button onClick={() => navigate('/Admin/classes/add')} variant="outline">
                Add Class First
              </Button>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class Name</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sclassesList.map((sclass: any) => (
                    <TableRow key={sclass._id}>
                      <TableCell className="font-medium">{sclass.sclassName}</TableCell>
                      <TableCell className="text-right">
                        <Button
                          size="sm"
                          onClick={() => navigateHandler(sclass._id)}
                          className="bg-gradient-primary"
                        >
                          Choose
                        </Button>
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

export default ChooseClass;