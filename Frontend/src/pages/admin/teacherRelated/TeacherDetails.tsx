import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getTeacherDetails } from '@/redux/teacherRelated/teacherHandle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const TeacherDetails = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { loading, teacherDetails, error } = useSelector((state: any) => state.teacher);

  const teacherID = params.id;

  useEffect(() => {
    dispatch(getTeacherDetails(teacherID) as any);
  }, [dispatch, teacherID]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isSubjectNamePresent = teacherDetails?.teachSubject?.subName;

  const handleAddSubject = () => {
    navigate(`/Admin/teachers/choosesubject/${teacherDetails?.teachSclass?._id}/${teacherDetails?._id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Teacher Details</h1>
          <p className="text-muted-foreground mt-1">{teacherDetails?.name}</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/Admin/teachers')}>
          Back to Teachers
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Teacher Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Teacher Name</p>
              <p className="text-lg font-medium">{teacherDetails?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Class Name</p>
              <p className="text-lg font-medium">{teacherDetails?.teachSclass?.sclassName}</p>
            </div>
            {isSubjectNamePresent ? (
              <>
                <div>
                  <p className="text-sm text-muted-foreground">Subject Name</p>
                  <p className="text-lg font-medium">{teacherDetails?.teachSubject?.subName}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Subject Sessions</p>
                  <p className="text-lg font-medium">{teacherDetails?.teachSubject?.sessions}</p>
                </div>
              </>
            ) : (
              <div className="col-span-2">
                <Button onClick={handleAddSubject} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add Subject
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherDetails;
