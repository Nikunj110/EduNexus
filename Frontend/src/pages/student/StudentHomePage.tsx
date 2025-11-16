import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, FileText } from "lucide-react";
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
      dispatch(getUserDetails(currentUser._id, "Student") as any);
    }
    if (classID) {
      dispatch(getSubjectList(classID, "ClassSubjects") as any);
    }
  }, [dispatch, currentUser?._id, classID]);

  const numberOfSubjects = subjectsList?.length || 0;

  useEffect(() => {
    if (userDetails) {
      setSubjectAttendance(userDetails.attendance || []);
    }
  }, [userDetails]);

  const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
  const overallAbsentPercentage = 100 - overallAttendancePercentage;

  const chartData = [
    { name: "Present", value: overallAttendancePercentage },
    { name: "Absent", value: overallAbsentPercentage },
  ];

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Welcome back!</h2>
        <p className="text-muted-foreground">
          Here's an overview of your academic progress
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
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
              Across all subjects
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

      <SeeNotice />
    </div>
  );
};

export default StudentHomePage;
