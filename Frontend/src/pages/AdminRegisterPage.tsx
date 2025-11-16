import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '@/redux/userRelated/userHandle';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminRegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { status, currentUser, response, error, currentRole } = useSelector((state: any) => state.user);

  const [showPassword, setShowPassword] = useState(false);
  const [loader, setLoader] = useState(false);

  const [formData, setFormData] = useState({
    adminName: '',
    schoolName: '',
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({
    adminName: false,
    schoolName: false,
    email: false,
    password: false,
  });

  const role = 'Admin';

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const newErrors = {
      adminName: !formData.adminName,
      schoolName: !formData.schoolName,
      email: !formData.email,
      password: !formData.password,
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      return;
    }

    const fields = {
      name: formData.adminName,
      email: formData.email,
      password: formData.password,
      role,
      schoolName: formData.schoolName,
    };

    setLoader(true);
    dispatch(registerUser(fields, role) as any);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: false }));
  };

  useEffect(() => {
    if (status === 'added') {
      toast({
        title: "Success",
        description: "Registration successful"
      });
      navigate('/Admin/dashboard');
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
  }, [status, currentRole, navigate, error, response, currentUser, toast]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/20 via-background to-secondary/20 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Admin Registration</CardTitle>
          <CardDescription className="text-center">
            Create a new admin account for your school
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="adminName">Admin Name</Label>
              <Input
                id="adminName"
                name="adminName"
                placeholder="Enter your name"
                value={formData.adminName}
                onChange={(e) => handleInputChange('adminName', e.target.value)}
                className={errors.adminName ? 'border-destructive' : ''}
              />
              {errors.adminName && (
                <p className="text-sm text-destructive">Admin name is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="schoolName">School Name</Label>
              <Input
                id="schoolName"
                name="schoolName"
                placeholder="Enter school name"
                value={formData.schoolName}
                onChange={(e) => handleInputChange('schoolName', e.target.value)}
                className={errors.schoolName ? 'border-destructive' : ''}
              />
              {errors.schoolName && (
                <p className="text-sm text-destructive">School name is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={errors.email ? 'border-destructive' : ''}
              />
              {errors.email && (
                <p className="text-sm text-destructive">Email is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={errors.password ? 'border-destructive' : ''}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">Password is required</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={loader}>
              {loader && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Register
            </Button>

            <div className="text-center text-sm">
              Already have an account?{' '}
              <Link to="/Adminlogin" className="text-primary hover:underline font-medium">
                Log in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRegisterPage;
