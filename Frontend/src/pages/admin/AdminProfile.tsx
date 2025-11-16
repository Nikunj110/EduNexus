import { useSelector } from 'react-redux';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Mail, School, User, Edit } from 'lucide-react';

const AdminProfile = () => {
  const { currentUser } = useSelector((state: any) => state.user);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold text-foreground">Profile</h2>
        <Button variant="outline" className="gap-2">
          <Edit className="w-4 h-4" />
          Edit Profile
        </Button>
      </div>

      <Card className="border-border/50">
        <CardHeader className="bg-gradient-primary text-primary-foreground">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center">
              <User className="w-10 h-10" />
            </div>
            <div>
              <CardTitle className="text-2xl">{currentUser?.name}</CardTitle>
              <p className="text-primary-foreground/80">Administrator</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Full Name</p>
                <p className="font-medium text-foreground">{currentUser?.name}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
              <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0">
                <Mail className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email Address</p>
                <p className="font-medium text-foreground">{currentUser?.email}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50 md:col-span-2">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                <School className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">School Name</p>
                <p className="font-medium text-foreground">{currentUser?.schoolName}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/50">
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
            <div>
              <p className="font-medium text-foreground">Change Password</p>
              <p className="text-sm text-muted-foreground">Update your password regularly for security</p>
            </div>
            <Button variant="outline">Change</Button>
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors">
            <div>
              <p className="font-medium text-foreground">Notification Settings</p>
              <p className="text-sm text-muted-foreground">Manage your notification preferences</p>
            </div>
            <Button variant="outline">Configure</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminProfile;
