import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, GraduationCap } from 'lucide-react';
import { loginUser } from '@/redux/userRelated/userHandle'; 
import { toast } from 'sonner';

interface LoginPageProps {
  role: string;
}

const LoginPage = ({ role }: LoginPageProps) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { status, currentUser, response, currentRole } = useSelector((state: any) => state.user);

  const [toggle, setToggle] = useState(false);
  const [guestLoader, setGuestLoader] = useState(false);
  const [loader, setLoader] = useState(false);

  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [rollNumberError, setRollNumberError] = useState(false);
  const [studentNameError, setStudentNameError] = useState(false);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    let fields = {};
    let email = (document.getElementById('email') as HTMLInputElement)?.value;
    let password = (document.getElementById('password') as HTMLInputElement)?.value;
    let rollNum = (document.getElementById('rollNumber') as HTMLInputElement)?.value;
    let studentName = (document.getElementById('studentName') as HTMLInputElement)?.value;

    let formValid = true;

    if (role === 'Student') {
      if (!rollNum) {
        setRollNumberError(true);
        formValid = false;
      } else {
        setRollNumberError(false);
      }
      if (!studentName) {
        setStudentNameError(true);
        formValid = false;
      } else {
        setStudentNameError(false);
      }
    } else {
      if (!email) {
        setEmailError(true);
        formValid = false;
      } else {
        setEmailError(false);
      }
    }

    if (!password) {
      setPasswordError(true);
      formValid = false;
    } else {
      setPasswordError(false);
    }

    if (!formValid) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (role === 'Student') {
      fields = { rollNum, studentName, password };
    } else {
      fields = { email, password };
    }

    setLoader(true);
    // This dispatch is already correct, passing a single object
    dispatch(loginUser({ credentials: fields, role }) as any);
  };

  const guestModeHandler = () => {
    setGuestLoader(true);
    let fields = {};
    const password = "zxc";

    if (role === "Admin") {
      const email = "yogendra@12";
      fields = { email, password };
    } else if (role === "Student") {
      const rollNum = "1";
      const studentName = "Dipesh Awasthi";
      fields = { rollNum, studentName, password };
    } else if (role === "Teacher") {
      const email = "tony@12";
      fields = { email, password };
    }
    // This dispatch is also correct
    dispatch(loginUser({ credentials: fields, role }) as any);
  };

  useEffect(() => {
    if (status === 'success' && currentUser) {
      if (currentRole === 'Admin') {
        navigate('/Admin/dashboard');
      } else if (currentRole === 'Student') {
        navigate('/Student/dashboard');
      } else if (currentRole === 'Teacher') {
        navigate('/Teacher/dashboard');
      }
    } else if (status === 'failed') {
      // Our authService already shows a detailed toast
      setLoader(false);
      setGuestLoader(false);
    } else if (status === 'error') {
      // Our authService already shows a detailed toast
      setLoader(false);
      setGuestLoader(false);
    }
  }, [status, currentRole, navigate, currentUser]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary/5 p-4">
      <div className="w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-2 shadow-xl border border-border/50 rounded-lg overflow-hidden">
          {/* Left Side - Image/Branding */}
          <div className="hidden md:flex flex-col items-center justify-center p-8 bg-gradient-hero text-primary-foreground">
            <GraduationCap className="w-24 h-24 mb-6" />
            <h2 className="text-3xl font-bold mb-3">EduFlow Forge</h2>
            <p className="text-center text-primary-foreground/80">
              Your all-in-one solution for modern school management.
            </p>
          </div>
          
          {/* Right Side - Form */}
          <Card className="w-full border-0 shadow-none rounded-none">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">
                {role} Login
              </CardTitle>
              <CardDescription>
                Welcome back! Please enter your details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                {role === 'Student' ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="rollNumber">Roll Number</Label>
                      <Input
                        id="rollNumber"
                        type="text"
                        placeholder="Enter roll number"
                        autoComplete="off"
                        className={rollNumberError ? 'border-destructive' : ''}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentName">Student Name</Label>
                      <Input
                        id="studentName"
                        type="text"
                        placeholder="Enter your name"
                        autoComplete="off"
                        className={studentNameError ? 'border-destructive' : ''}
                      />
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="m@example.com"
                      autoComplete="email"
                      className={emailError ? 'border-destructive' : ''}
                    />
                  </div>
                )}
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={toggle ? 'text' : 'password'}
                      placeholder="Enter password"
                      autoComplete="current-password"
                      className={passwordError ? 'border-destructive' : ''}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                      onClick={() => setToggle(!toggle)}
                    >
                      {toggle ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                      Remember me
                    </Label>
                  </div>
                  <Link to="#" className="text-sm text-primary hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" className="w-full bg-gradient-primary hover:opacity-90" size="lg" disabled={loader}>
                  {loader ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin"></div>
                      Logging in...
                    </div>
                  ) : (
                    'Login'
                  )}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full border-primary/20 hover:bg-primary/5"
                  size="lg"
                  onClick={guestModeHandler}
                  disabled={guestLoader}
                >
                  {guestLoader ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                      Logging in as Guest...
                    </div>
                  ) : (
                    'Login as Guest'
                  )}
                </Button>

                {role === "Admin" && (
                  <p className="text-center text-sm text-muted-foreground">
                    Don't have an account?{' '}
                    <Link to="/Adminregister" className="text-primary font-medium hover:underline">
                      Sign up
                    </Link>
                  </p>
                )}
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;