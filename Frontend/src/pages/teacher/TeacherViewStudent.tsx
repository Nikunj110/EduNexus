import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserDetails } from '@/redux/userRelated/userHandle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Plus } from 'lucide-react';
import { calculateOverallAttendancePercentage, calculateSubjectAttendancePercentage, groupAttendanceBySubject } from '@/lib/attendanceCalculator';
import CustomPieChart from '@/components/charts/CustomPieChart';

const TeacherViewStudent = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { currentUser, userDetails, loading } = useSelector((state: any) => state.user);

  const studentID = params.id;
  const teachSubject = currentUser?.teachSubject?.subName;
  const teachSubjectID = currentUser?.teachSubject?._id;

  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (studentID) {
      dispatch(getUserDetails(studentID, 'Student') as any);
    }
  }, [dispatch, studentID]);

  const handleOpen = (subId: string) => {
    setOpenStates((prev) => ({ ...prev, [subId]: !prev[subId] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const subjectAttendance = userDetails?.attendance || [];
  const subjectMarks = userDetails?.examResult || [];
  const sclassName = userDetails?.sclassName?.sclassName || '';
  const studentSchool = userDetails?.school?.schoolName || '';

  const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
  const overallAbsentPercentage = 100 - overallAttendancePercentage;

  const chartData = [
    { name: 'Present', value: overallAttendancePercentage },
    { name: 'Absent', value: overallAbsentPercentage },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Student Details</h1>
          <p className="text-muted-foreground mt-1">{userDetails?.name}</p>
        </div>
        <Button variant="outline" onClick={() => navigate('/Teacher/class')}>
          Back to Class
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-lg font-medium">{userDetails?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Roll Number</p>
              <p className="text-lg font-medium">{userDetails?.rollNum}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Class</p>
              <p className="text-lg font-medium">{sclassName}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">School</p>
              <p className="text-lg font-medium">{studentSchool}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Attendance</CardTitle>
          <Button
            onClick={() => navigate(`/Teacher/class/student/attendance/${studentID}/${teachSubjectID}`)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Attendance
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {subjectAttendance && subjectAttendance.length > 0 ? (
            <>
              {Object.entries(groupAttendanceBySubject(subjectAttendance)).map(
                ([subName, data]: [string, any]) => {
                  if (subName === teachSubject) {
                    const { present, sessions, allData, subId } = data;
                    const percentage = calculateSubjectAttendancePercentage(present, sessions);

                    return (
                      <Collapsible
                        key={subId}
                        open={openStates[subId]}
                        onOpenChange={() => handleOpen(subId)}
                      >
                        <div className="rounded-md border">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Subject</TableHead>
                                <TableHead>Present</TableHead>
                                <TableHead>Total Sessions</TableHead>
                                <TableHead>Percentage</TableHead>
                                <TableHead className="text-right">Details</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              <TableRow>
                                <TableCell className="font-medium">{subName}</TableCell>
                                <TableCell>{present}</TableCell>
                                <TableCell>{sessions}</TableCell>
                                <TableCell>{percentage}%</TableCell>
                                <TableCell className="text-right">
                                  <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      {openStates[subId] ? (
                                        <ChevronUp className="h-4 w-4" />
                                      ) : (
                                        <ChevronDown className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </CollapsibleTrigger>
                                </TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                          <CollapsibleContent>
                            <div className="p-4 border-t">
                              <h4 className="font-semibold mb-3">Attendance Details</h4>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead className="text-right">Status</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {allData.map((record: any, index: number) => {
                                    const date = new Date(record.date);
                                    const dateString =
                                      date.toString() !== 'Invalid Date'
                                        ? date.toISOString().substring(0, 10)
                                        : 'Invalid Date';
                                    return (
                                      <TableRow key={index}>
                                        <TableCell>{dateString}</TableCell>
                                        <TableCell className="text-right">
                                          <span
                                            className={
                                              record.status === 'Present'
                                                ? 'text-secondary font-medium'
                                                : 'text-destructive font-medium'
                                            }
                                          >
                                            {record.status}
                                          </span>
                                        </TableCell>
                                      </TableRow>
                                    );
                                  })}
                                </TableBody>
                              </Table>
                            </div>
                          </CollapsibleContent>
                        </div>
                      </Collapsible>
                    );
                  }
                  return null;
                }
              )}
              <div className="pt-4">
                <p className="text-sm text-muted-foreground mb-2">Overall Attendance</p>
                <p className="text-2xl font-bold mb-4">{overallAttendancePercentage.toFixed(2)}%</p>
                <CustomPieChart data={chartData} />
              </div>
            </>
          ) : (
            <p className="text-muted-foreground text-center py-8">No attendance records found</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Subject Marks</CardTitle>
          <Button
            onClick={() => navigate(`/Teacher/class/student/marks/${studentID}/${teachSubjectID}`)}
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Marks
          </Button>
        </CardHeader>
        <CardContent>
          {subjectMarks && subjectMarks.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-right">Marks Obtained</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjectMarks.map((result: any, index: number) => {
                    if (result.subName?.subName === teachSubject) {
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{result.subName.subName}</TableCell>
                          <TableCell className="text-right">{result.marksObtained}</TableCell>
                        </TableRow>
                      );
                    }
                    return null;
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No marks recorded yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TeacherViewStudent;
