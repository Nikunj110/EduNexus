import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { updateStudentFields } from '@/redux/studentRelated/studentHandle';
import { underStudentControl } from '@/redux/studentRelated/studentSlice';
import { RootState } from '@/redux/store';
import { toast as sonnerToast } from 'sonner';

interface StudentAttendanceProps {
  situation?: string;
}

const StudentAttendance = ({ situation }: StudentAttendanceProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { statestatus, response, error } = useSelector((state: RootState) => state.student);

  const [status, setStatus] = useState('Present');
  const [date, setDate] = useState<Date>(new Date());
  const [loader, setLoader] = useState(false);

  const studentID = params.studentID;
  const subjectID = params.subjectID;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoader(true);
    
    const fields = { subName: subjectID, status, date };

    // FIX: Updated dispatch to pass a single object
    dispatch(updateStudentFields({ 
      id: studentID, 
      fields, 
      address: 'StudentAttendance' 
    }) as any);
  };

  useEffect(() => {
    if (statestatus === 'success') {
      sonnerToast.success(response || 'Attendance marked successfully');
      navigate(-1);
      dispatch(underStudentControl());
    } else if (statestatus === 'failed') {
      toast({
        title: "Failed",
        description: response || "Failed to mark attendance",
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
          <CardTitle className="text-center text-2xl pt-8">Take Attendance</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label>Select Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, 'PPP') : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={date} onSelect={(d) => d && setDate(d)} initialFocus />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>Attendance Status</Label>
              <RadioGroup value={status} onValueChange={setStatus} className="flex gap-4 pt-2">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Present" id="present" />
                  <Label htmlFor="present" className="cursor-pointer">
                    Present
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Absent" id="absent" />
                  <Label htmlFor="absent" className="cursor-pointer">
                    Absent
                  </Label>
                </div>
              </RadioGroup>
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
                Submit
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentAttendance;