// FIX 1: The dispatch for 'getUserDetails' in useEffect is now a single object { id, role }.
// FIX 2: The dispatch for 'getSubjectList' in useEffect is now a single object { id, address }.
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText, User, CheckCircle, Percent } from "lucide-react";
import { calculateOverallAttendancePercentage } from "@/lib/attendanceCalculator";
import CustomPieChart from "@/components/charts/CustomPieChart";
import { getUserDetails } from "@/redux/userRelated/userHandle";
import { getSubjectList } from "@/redux/sclassRelated/sclassHandle";
import SeeNotice from "@/components/SeeNotice";
import { RootState } from "@/redux/store";

const StudentHomePage = () => {
  const dispatch = useDispatch();
  const { userDetails, currentUser, loading } = useSelector((state: RootState) => state.user);
  const { subjectsList } = useSelector((state: RootState) => state.sclass);
  const [subjectAttendance, setSubjectAttendance] = useState<any[]>([]);

  const classID = currentUser?.sclassName?._id;

  useEffect(() => {
    if (currentUser?._id) {
      // FIX 1: Updated to pass a single object
      dispatch(getUserDetails({ id: currentUser._id, role: "Student" }) as any);
    }
    if (classID) {
      // FIX 2: Updated to pass a single object
      dispatch(getSubjectList({ id: classID, address: "ClassSubjects" }) as any);
    }
  }, [dispatch, currentUser?._id, classID]);

  const numberOfSubjects = subjectsList?.length || 0;

  useEffect(() => {
    if (userDetails?.attendance) {
      setSubjectAttendance(userDetails.attendance);
    }
  }, [userDetails]);

  const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
  const chartData = [
    { name: "Present", value: overallAttendancePercentage },
    { name: "Absent", value: 100 - overallAttendancePercentage },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Attendance</CardTitle>
            <Percent className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallAttendancePercentage.toFixed(0)}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {overallAttendancePercentage >= 75 ? "Looking Good!" : "Need to improve"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{numberOfSubjects}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Enrolled this semester
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Assignments</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground mt-1">
              (Placeholder)
            </p>
          </CardContent>
        </Card>

        <Card className="md:col-span-2 lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm font-medium">Attendance Overview</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            {subjectAttendance && subjectAttendance.length > 0 ? (
              <CustomPieChart data={chartData} />
            ) : (
              <p className="text-muted-foreground text-center py-8">
                No attendance data available
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SeeNotice />
        </div>
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Quick Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium text-foreground">{currentUser?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-secondary/10">
                <CheckCircle className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class</p>
                <p className="font-medium text-foreground">{currentUser?.sclassName?.sclassName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <User className="w-5 h-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Roll No.</p>
                <p className="font-medium text-foreground">{currentUser?.rollNum}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentHomePage;