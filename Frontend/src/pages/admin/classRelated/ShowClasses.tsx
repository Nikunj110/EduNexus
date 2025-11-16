// FIX: The dispatch call for 'getAllSclasses' in useEffect now correctly passes only the 'adminID', as required by our new 'sclassHandle.ts'.
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, BookOpen, Users, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllSclasses } from '@/redux/sclassRelated/sclassHandle';
import { deleteUser } from '@/redux/userRelated/userHandle';
import { RootState } from '@/redux/store';
import { Skeleton } from '@/components/ui/skeleton';

const ShowClasses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sclassesList, loading } = useSelector((state: RootState) => state.sclass);
  const { currentUser } = useSelector((state: RootState) => state.user);

  const adminID = currentUser._id;

  useEffect(() => {
    // FIX: Removed the second argument 'Sclass'
    dispatch(getAllSclasses(adminID) as any);
  }, [adminID, dispatch]);

  const classes = sclassesList.map((classItem: any) => ({
    id: classItem._id,
    name: classItem.sclassName,
    // Note: These student/subject counts are placeholders.
    // For "industrial-level", this data should come from the backend.
    students: 0, 
    subjects: 0, 
  }));

  if (loading) {
    return (
      <div className="space-y-6 animate-in fade-in duration-500">
        <div className="flex items-center justify-between">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="border-border/50">
              <CardHeader>
                <Skeleton className="h-6 w-3/4" />
              </CardHeader>
              <CardContent className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-10 w-full mt-4" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Classes</h2>
          <p className="text-muted-foreground">Manage all classes in your school</p>
        </div>
        <Button onClick={() => navigate('/Admin/classes/add')} className="gap-2 bg-gradient-primary">
          <Plus className="w-4 h-4" />
          Add Class
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <Card key={classItem.id} className="border-border/50 flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xl font-semibold text-foreground">
                {classItem.name}
              </CardTitle>
              <div className="p-2 bg-primary/10 rounded-lg">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-between">
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Students
                  </span>
                  <span className="font-medium text-foreground">{classItem.students}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <BookOpen className="w-4 h-4" />
                    Subjects
                  </span>
                  <span className="font-medium text-foreground">{classItem.subjects}</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="w-full gap-2 mt-auto" 
                onClick={() => navigate(`/Admin/classes/class/${classItem.id}`)}
              >
                <Eye className="w-4 h-4" />
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {classes.length === 0 && (
        <Card className="border-border/50">
          <CardContent className="text-center py-12">
            <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">No Classes Yet</h3>
            <p className="text-muted-foreground mb-6">Get started by adding your first class</p>
            <Button onClick={() => navigate('/Admin/classes/add')} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Class
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ShowClasses;