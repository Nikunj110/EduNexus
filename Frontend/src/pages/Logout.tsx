import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { authLogout } from '@/redux/userRelated/userSlice';
import { RootState } from '@/redux/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, X } from 'lucide-react';

const Logout = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(authLogout());
    navigate('/');
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 p-4">
      <Card className="w-full max-w-md shadow-lg border-border/50">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-2">
            <LogOut className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-bold">
            {currentUser?.name || 'User'}
          </CardTitle>
          <CardDescription className="text-base">
            Are you sure you want to log out?
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button 
            onClick={handleLogout}
            variant="destructive"
            className="w-full h-11 text-base"
          >
            <LogOut className="mr-2 h-5 w-5" />
            Log Out
          </Button>
          <Button 
            onClick={handleCancel}
            variant="outline"
            className="w-full h-11 text-base"
          >
            <X className="mr-2 h-5 w-5" />
            Cancel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Logout;
