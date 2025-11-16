import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetails } from "@/redux/userRelated/userHandle";
import {
  calculateOverallAttendancePercentage,
  calculateSubjectAttendancePercentage,
  groupAttendanceBySubject,
} from "@/lib/attendanceCalculator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, BarChart3, TableIcon } from "lucide-react";
import CustomBarChart from "@/components/charts/CustomBarChart";
import { RootState } from "@/redux/store";
import { Badge } from "@/components/ui/badge";

const ViewStdAttendance = () => {
  const dispatch = useDispatch();
  const { userDetails, currentUser, loading } = useSelector((state: RootState) => state.user);
  const [subjectAttendance, setSubjectAttendance] = useState<any[]>([]);
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (currentUser?._id) {
      dispatch(getUserDetails(currentUser._id, "Student") as any);
    }
  }, [dispatch, currentUser?._id]);

  useEffect(() => {
    if (userDetails) {
      setSubjectAttendance(userDetails.attendance || []);
    }
  }, [userDetails]);

  const handleOpen = (subId: string) => {
    setOpenStates((prev) => ({ ...prev, [subId]: !prev[subId] }));
  };

  const attendanceBySubject = groupAttendanceBySubject(subjectAttendance);
  const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);

  const subjectData = Object.entries(attendanceBySubject).map(([subName, data]: [string, any]) => {
    const subjectAttendancePercentage = calculateSubjectAttendancePercentage(data.present, data.sessions);
    return {
      subject: subName,
      attendancePercentage: subjectAttendancePercentage,
      totalClasses: data.sessions,
      attendedClasses: data.present,
    };
  });

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!subjectAttendance || subjectAttendance.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
          <p className="text-muted-foreground">Track your attendance records</p>
        </div>
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">
              Currently you have no attendance details
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Attendance</h2>
          <p className="text-muted-foreground">Track your attendance records</p>
        </div>
        <Badge variant="outline" className="text-lg px-4 py-2">
          Overall: {overallAttendancePercentage.toFixed(2)}%
        </Badge>
      </div>

      <Card>
        <CardContent className="pt-6">
          <Tabs defaultValue="table" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
              <TabsTrigger value="table" className="flex items-center gap-2">
                <TableIcon className="h-4 w-4" />
                Table View
              </TabsTrigger>
              <TabsTrigger value="chart" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Chart View
              </TabsTrigger>
            </TabsList>

            <TabsContent value="table" className="mt-6 space-y-4">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-center">Present</TableHead>
                    <TableHead className="text-center">Total Sessions</TableHead>
                    <TableHead className="text-center">Percentage</TableHead>
                    <TableHead className="text-center">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {Object.entries(attendanceBySubject).map(([subName, data]: [string, any]) => {
                    const percentage = calculateSubjectAttendancePercentage(data.present, data.sessions);
                    return (
                      <TableRow key={data.subId}>
                        <TableCell className="font-medium">{subName}</TableCell>
                        <TableCell className="text-center">{data.present}</TableCell>
                        <TableCell className="text-center">{data.sessions}</TableCell>
                        <TableCell className="text-center">
                          <Badge variant={percentage >= 75 ? "default" : "destructive"}>
                            {percentage}%
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Collapsible open={openStates[data.subId]}>
                            <CollapsibleTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleOpen(data.subId)}
                              >
                                {openStates[data.subId] ? (
                                  <ChevronUp className="h-4 w-4 mr-1" />
                                ) : (
                                  <ChevronDown className="h-4 w-4 mr-1" />
                                )}
                                Details
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                                <h4 className="font-medium mb-3">Attendance Details</h4>
                                <Table>
                                  <TableHeader>
                                    <TableRow>
                                      <TableHead>Date</TableHead>
                                      <TableHead className="text-right">Status</TableHead>
                                    </TableRow>
                                  </TableHeader>
                                  <TableBody>
                                    {data.allData.map((record: any, idx: number) => {
                                      const date = new Date(record.date);
                                      const dateString =
                                        date.toString() !== "Invalid Date"
                                          ? date.toISOString().substring(0, 10)
                                          : "Invalid Date";
                                      return (
                                        <TableRow key={idx}>
                                          <TableCell>{dateString}</TableCell>
                                          <TableCell className="text-right">
                                            <Badge
                                              variant={
                                                record.status === "Present"
                                                  ? "default"
                                                  : "destructive"
                                              }
                                            >
                                              {record.status}
                                            </Badge>
                                          </TableCell>
                                        </TableRow>
                                      );
                                    })}
                                  </TableBody>
                                </Table>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TabsContent>

            <TabsContent value="chart" className="mt-6">
              <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewStdAttendance;
