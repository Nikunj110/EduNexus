import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { updateStudentFields } from '@/redux/studentRelated/studentHandle';
import { underStudentControl } from '@/redux/studentRelated/studentSlice';

interface StudentExamMarksProps {
  situation?: string;
}

const StudentExamMarks = ({ situation }: StudentExamMarksProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { statestatus, response, error } = useSelector((state: any) => state.student);

  const [marks, setMarks] = useState('');

  const studentID = params.studentID;
  const subjectID = params.subjectID;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!marks || isNaN(Number(marks))) {
      toast({
        title: 'Error',
        description: 'Please enter valid marks',
        variant: 'destructive',
      });
      return;
    }

    const fields = {
      subName: subjectID,
      marksObtained: Number(marks),
    };

    dispatch(updateStudentFields(studentID!, fields, 'UpdateExamResult') as any);
  };

  useEffect(() => {
    if (statestatus === 'added') {
      toast({
        title: 'Success',
        description: 'Marks added successfully',
      });
      navigate(-1);
      dispatch(underStudentControl());
    } else if (response) {
      toast({
        title: 'Error',
        description: response,
        variant: 'destructive',
      });
    } else if (error) {
      toast({
        title: 'Error',
        description: 'Network Error',
        variant: 'destructive',
      });
    }
  }, [statestatus, response, error, navigate, toast, dispatch]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add Exam Marks</h1>
          <p className="text-muted-foreground mt-1">Record student exam performance</p>
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          Back
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam Marks Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="marks">Marks Obtained</Label>
              <Input
                id="marks"
                type="number"
                placeholder="Enter marks"
                value={marks}
                onChange={(e) => setMarks(e.target.value)}
                min="0"
                max="100"
              />
              <p className="text-sm text-muted-foreground">Enter marks out of 100</p>
            </div>

            <div className="flex gap-2">
              <Button type="submit">Submit Marks</Button>
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentExamMarks;
