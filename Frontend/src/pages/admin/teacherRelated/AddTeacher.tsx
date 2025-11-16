import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getSubjectDetails } from '@/redux/sclassRelated/sclassHandle';
import { registerUser } from '@/redux/userRelated/userHandle';
import { underControl } from '@/redux/userRelated/userSlice';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AddTeacher = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const subjectID = params.id;
  const { status, response, error } = useSelector((state: any) => state.user);
  const { subjectDetails } = useSelector((state: any) => state.sclass);

  useEffect(() => {
    dispatch(getSubjectDetails(subjectID, 'Subject') as any);
  }, [dispatch, subjectID]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false);

  const role = 'Teacher';
  const school = subjectDetails?.school;
  const teachSubject = subjectDetails?._id;
  const teachSclass = subjectDetails?.sclassName?._id;

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    setLoader(true);
    const fields = { name, email, password, role, school, teachSubject, teachSclass };
    dispatch(registerUser(fields, role) as any);
  };

  useEffect(() => {
    if (status === 'added') {
      toast({
        title: "Success",
        description: "Teacher added successfully"
      });
      dispatch(underControl());
      navigate('/Admin/teachers');
    } else if (status === 'failed') {
      toast({
        title: "Error",
        description: response,
        variant: "destructive"
      });
      setLoader(false);
    } else if (status === 'error') {
      toast({
        title: "Error",
        description: "Network Error",
        variant: "destructive"
      });
      setLoader(false);
    }
  }, [status, navigate, error, response, dispatch, toast]);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Add Teacher</h1>
        <p className="text-muted-foreground mt-1">Assign a new teacher to a subject</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Teacher Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler} className="space-y-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <div className="p-3 bg-muted rounded-md">
                <p className="font-medium">{subjectDetails?.subName}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Class</Label>
              <div className="p-3 bg-muted rounded-md">
                <p className="font-medium">{subjectDetails?.sclassName?.sclassName}</p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Teacher Name</Label>
              <Input
                id="name"
                placeholder="Enter teacher name..."
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email..."
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={loader} className="flex-1">
                {loader && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Teacher
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/Admin/teachers')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTeacher;
