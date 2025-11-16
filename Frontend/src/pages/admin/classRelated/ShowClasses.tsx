import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, BookOpen, Users, Trash2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAllSclasses } from '@/redux/sclassRelated/sclassHandle';
import { deleteUser } from '@/redux/userRelated/userHandle';

const ShowClasses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { sclassesList, loading } = useSelector((state: any) => state.sclass);
  const { currentUser } = useSelector((state: any) => state.user);

  const adminID = currentUser._id;

  useEffect(() => {
    dispatch(getAllSclasses(adminID, 'Sclass') as any);
  }, [adminID, dispatch]);

  const classes = sclassesList.map((classItem: any) => ({
    id: classItem._id,
    name: classItem.sclassName,
    students: 0, // Will be updated with actual count
    subjects: 0, // Will be updated with actual count
  }));

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Classes</h2>
          <p className="text-muted-foreground mt-1">Manage your school classes</p>
        </div>
        <Button onClick={() => navigate('/Admin/classes/add')} className="gap-2 bg-gradient-primary">
          <Plus className="w-4 h-4" />
          Add Class
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map((classItem) => (
          <Card key={classItem.id} className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive hover:bg-destructive/10">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <CardTitle className="mt-4">{classItem.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
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
              <Button 
                variant="outline" 
                className="w-full gap-2 mt-4" 
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
