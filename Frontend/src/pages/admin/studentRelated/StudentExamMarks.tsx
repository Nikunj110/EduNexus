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
import { RootState } from '@/redux/store';
import { Loader2, ArrowLeft } from 'lucide-react';
import { toast as sonnerToast } from 'sonner';

interface StudentExamMarksProps {
  situation?: string;
}

const StudentExamMarks = ({ situation }: StudentExamMarksProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { statestatus, response, error } = useSelector((state: RootState) => state.student);

  const [marks, setMarks] = useState('');
  const [loader, setLoader] = useState(false);

  const studentID = params.studentID;
  const subjectID = params.subjectID;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);

    if (!marks || isNaN(Number(marks)) || Number(marks) < 0 || Number(marks) > 100) {
      toast({
        title: 'Error',
        description: 'Please enter valid marks between 0 and 100',
        variant: 'destructive',
      });
      setLoader(false);
      return;
    }

    const fields = { subName: subjectID, marksObtained: marks };

    // FIX: Updated dispatch to pass a single object
    dispatch(updateStudentFields({
      id: studentID,
      fields,
      address: 'StudentExamMarks'
    }) as any);
  };

  useEffect(() => {
    if (statestatus === 'success') {
      sonnerToast.success(response || 'Marks added successfully');
      navigate(-1);
      dispatch(underStudentControl());
    } else if (statestatus === 'failed') {
      toast({
        title: "Failed",
        description: response || "Failed to add marks",
        variant: "destructive"
      });
      setLoader(false);
    } else if (statestatus === 'error') {
      toast({
        title: "Error",
        description: error || "An error occurred",
        variant: "destructive"
      });
      setLoader(false);
    }
  }, [statestatus, response, error, navigate, dispatch, toast]);

  return (
    <div className="flex justify-center items-center min-h-full p-4 animate-in fade-in duration-500">
      <Card className="w-full max-w-md shadow-lg border-border/50">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <CardTitle className="text-center text-2xl pt-8">Add Exam Marks</CardTitle>
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
                className="h-12"
              />
              <p className="text-sm text-muted-foreground">Enter marks out of 100</p>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loader} className="flex-1 bg-gradient-primary">
                {loader && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Submit Marks
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentExamMarks;