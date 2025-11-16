import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Eye, EyeOff, GraduationCap } from 'lucide-react';
import { loginUser } from '../redux/userRelated/userHandle';
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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (role === "Student") {
      const rollNum = (event.target as any).rollNumber.value;
      const studentName = (event.target as any).studentName.value;
      const password = (event.target as any).password.value;

      if (!rollNum || !studentName || !password) {
        if (!rollNum) setRollNumberError(true);
        if (!studentName) setStudentNameError(true);
        if (!password) setPasswordError(true);
        return;
      }
      const fields = { rollNum, studentName, password };
      setLoader(true);
      dispatch(loginUser(fields, role) as any);
    } else {
      const email = (event.target as any).email.value;
      const password = (event.target as any).password.value;

      if (!email || !password) {
        if (!email) setEmailError(true);
        if (!password) setPasswordError(true);
        return;
      }

      const fields = { email, password };
      setLoader(true);
      dispatch(loginUser(fields, role) as any);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name } = event.target;
    if (name === 'email') setEmailError(false);
    if (name === 'password') setPasswordError(false);
    if (name === 'rollNumber') setRollNumberError(false);
    if (name === 'studentName') setStudentNameError(false);
  };

  const guestModeHandler = () => {
    const password = "zxc";

    if (role === "Admin") {
      const email = "yogendra@12";
      const fields = { email, password };
      setGuestLoader(true);
      dispatch(loginUser(fields, role) as any);
    } else if (role === "Student") {
      const rollNum = "1";
      const studentName = "Dipesh Awasthi";
      const fields = { rollNum, studentName, password };
      setGuestLoader(true);
      dispatch(loginUser(fields, role) as any);
    } else if (role === "Teacher") {
      const email = "tony@12";
      const fields = { email, password };
      setGuestLoader(true);
      dispatch(loginUser(fields, role) as any);
    }
  };

  useEffect(() => {
    if (status === 'success' || currentUser !== null) {
      if (currentRole === 'Admin') {
        navigate('/Admin/dashboard');
      } else if (currentRole === 'Student') {
        navigate('/Student/dashboard');
      } else if (currentRole === 'Teacher') {
        navigate('/Teacher/dashboard');
      }
    } else if (status === 'failed') {
      toast.error(response);
      setLoader(false);
    } else if (status === 'error') {
      toast.error("Network Error");
      setLoader(false);
      setGuestLoader(false);
    }
  }, [status, currentRole, navigate, response, currentUser]);

  if (guestLoader) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-primary/5 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mx-auto"></div>
          <p className="text-foreground text-lg">Please wait...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 py-12 px-4">
      <div className="container mx-auto max-w-5xl">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Branding */}
          <div className="hidden lg:flex flex-col space-y-8 animate-in fade-in slide-in-from-left duration-700">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-3">
                <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-8 h-8 text-primary-foreground" />
                </div>
                <span className="text-2xl font-bold text-foreground">EduManage</span>
              </div>
              
              <h1 className="text-4xl font-bold text-foreground leading-tight">
                Welcome back to your
                <span className="block text-primary mt-2">Education Hub</span>
              </h1>
              
              <p className="text-lg text-muted-foreground">
                Access your dashboard to manage classes, track progress, and collaborate with your educational community.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Real-time Updates</h3>
                  <p className="text-sm text-muted-foreground">Stay connected with live attendance and performance tracking</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                  <div className="w-2 h-2 bg-secondary rounded-full"></div>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Secure Access</h3>
                  <p className="text-sm text-muted-foreground">Your data is protected with enterprise-level security</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <Card className="shadow-xl border-border/50 animate-in fade-in slide-in-from-right duration-700">
            <CardHeader className="space-y-3">
              <CardTitle className="text-3xl font-bold text-center">{role} Login</CardTitle>
              <CardDescription className="text-center text-base">
                Welcome back! Please enter your details
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                {role === "Student" ? (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="rollNumber">Roll Number</Label>
                      <Input
                        id="rollNumber"
                        name="rollNumber"
                        type="number"
                        placeholder="Enter your roll number"
                        className={emailError ? 'border-destructive' : ''}
                        onChange={handleInputChange}
                      />
                      {rollNumberError && (
                        <p className="text-sm text-destructive">Roll number is required</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="studentName">Full Name</Label>
                      <Input
                        id="studentName"
                        name="studentName"
                        placeholder="Enter your full name"
                        className={studentNameError ? 'border-destructive' : ''}
                        onChange={handleInputChange}
                      />
                      {studentNameError && (
                        <p className="text-sm text-destructive">Name is required</p>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      className={emailError ? 'border-destructive' : ''}
                      onChange={handleInputChange}
                    />
                    {emailError && (
                      <p className="text-sm text-destructive">Email is required</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={toggle ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className={passwordError ? 'border-destructive pr-10' : 'pr-10'}
                      onChange={handleInputChange}
                    />
                    <button
                      type="button"
                      onClick={() => setToggle(!toggle)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {toggle ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {passwordError && (
                    <p className="text-sm text-destructive">Password is required</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="remember" />
                    <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
                      Remember me
                    </label>
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
                >
                  Login as Guest
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
