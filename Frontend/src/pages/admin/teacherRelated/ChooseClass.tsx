import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { getAllSclasses } from '@/redux/sclassRelated/sclassHandle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface ChooseClassProps {
  situation?: string;
}

const ChooseClass = ({ situation }: ChooseClassProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sclassesList, loading, getresponse } = useSelector((state: any) => state.sclass);
  const { currentUser } = useSelector((state: any) => state.user);

  useEffect(() => {
    dispatch(getAllSclasses(currentUser._id, 'Sclass') as any);
  }, [currentUser._id, dispatch]);

  const navigateHandler = (classID: string) => {
    if (situation === 'Teacher') {
      navigate(`/Admin/teachers/choosesubject/${classID}`);
    } else if (situation === 'Subject') {
      navigate(`/Admin/addsubject/${classID}`);
    }
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
      <div>
        <h1 className="text-3xl font-bold text-foreground">Choose a Class</h1>
        <p className="text-muted-foreground mt-1">Select a class to continue</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Classes</CardTitle>
        </CardHeader>
        <CardContent>
          {getresponse || !sclassesList || sclassesList.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No classes found</p>
              <Button onClick={() => navigate('/Admin/addclass')} variant="outline">
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
