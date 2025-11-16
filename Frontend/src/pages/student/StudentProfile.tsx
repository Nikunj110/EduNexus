import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { RootState } from "@/redux/store";

const StudentProfile = () => {
  const { currentUser } = useSelector((state: RootState) => state.user);

  const sclassName = currentUser?.sclassName;
  const studentSchool = currentUser?.school;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Student Profile</h2>
        <p className="text-muted-foreground">View your personal information</p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarFallback className="text-4xl">
                {currentUser?.name?.charAt(0) || "S"}
              </AvatarFallback>
            </Avatar>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold">{currentUser?.name}</h3>
              <div className="flex gap-2 justify-center">
                <Badge variant="secondary">Roll No: {currentUser?.rollNum}</Badge>
                <Badge variant="outline">{sclassName?.sclassName}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {studentSchool?.schoolName}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
              <p className="text-base">January 1, 2000</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Gender</p>
              <p className="text-base">Male</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Email</p>
              <p className="text-base">john.doe@example.com</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Phone</p>
              <p className="text-base">(123) 456-7890</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Address</p>
              <p className="text-base">123 Main Street, City, Country</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Emergency Contact</p>
              <p className="text-base">(987) 654-3210</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProfile;
