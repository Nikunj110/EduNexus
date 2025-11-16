// FIX 1: The dispatch for 'getSubjectDetails' in useEffect is now a single 'id' argument.
// FIX 2: The dispatch for 'registerUser' in submitHandler is now a single object { fields, role }.
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getSubjectDetails } from '@/redux/sclassRelated/sclassHandle';
import { registerUser } from '@/redux/userRelated/userHandle';
import { underControl } from '@/redux/userRelated/userSlice';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, GraduationCap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { RootState } from '@/redux/store';
import { toast as sonnerToast } from 'sonner';

const AddTeacher = () => {
  const params = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const subjectID = params.id;
  const { status, response, error, currentUser } = useSelector((state: RootState) => state.user);
  const { subjectDetails } = useSelector((state: RootState) => state.sclass);

  useEffect(() => {
    // FIX 1: Removed the second argument 'Subject'
    dispatch(getSubjectDetails(subjectID) as any);
  }, [dispatch, subjectID]);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loader, setLoader] = useState(false);

  const role = 'Teacher';
  const school = currentUser._id;
  const teachSubject = subjectDetails?._id;
  const teachSclass = subjectDetails?.sclassName?._id;

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();
    setLoader(true);

    if (!name.trim() || !email.trim() || !password.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      setLoader(false);
      return;
    }

    const fields = { name, email, password, role, school, teachSubject, teachSclass };

    // FIX 2: Updated dispatch to pass a single object { fields, role }
    dispatch(registerUser({ fields, role: 'Teacher' }) as any);
  };

  useEffect(() => {
    if (status === 'success') {
      sonnerToast.success(response || 'Teacher added successfully');
      navigate('/Admin/teachers');
      dispatch(underControl());
    } else if (status === 'failed') {
      toast({
        title: "Failed",
        description: response || "Failed to add teacher",
        variant: "destructive",
      });
      setLoader(false);
    } else if (status === 'error') {
      toast({
        title: "Error",
        description: error || "An error occurred",
        variant: "destructive",
      });
      setLoader(false);
    }
  }, [status, response, error, navigate, dispatch, toast]);

  return (
    <div className="flex justify-center items-center min-h-full p-4 animate-in fade-in duration-500">
      <Card className="w-full max-w-lg shadow-lg border-border/50">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 left-4"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="flex flex-col items-center">
            <div className="p-3 bg-primary/10 rounded-full mb-3">
              <GraduationCap className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-center text-2xl">Add New Teacher</CardTitle>
            <CardDescription className="text-center">
              Assigning to: {subjectDetails?.subName} (Class {subjectDetails?.sclassName?.sclassName})
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={submitHandler} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter teacher's name..."
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
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/Admin/teachers')}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loader} className="flex-1 bg-gradient-primary">
                {loader && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Add Teacher
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AddTeacher;