// FIX: The dispatch for 'getUserDetails' in useEffect is now a single object { id, role }.
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
      // FIX: Updated dispatch to pass a single object
      dispatch(getUserDetails({ id: currentUser._id, role: "Student" }) as any);
    }
  }, [dispatch, currentUser?._id]);

  useEffect(() => {
    if (userDetails?.attendance) {
      setSubjectAttendance(userDetails.attendance);
    }
  }, [userDetails]);

  const overallAttendancePercentage = calculateOverallAttendancePercentage(subjectAttendance);
  const subjectData = groupAttendanceBySubject(subjectAttendance);

  const toggleCollapsible = (subjectName: string) => {
    setOpenStates((prev) => ({ ...prev, [subjectName]: !prev[subjectName] }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Overall Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={`text-6xl font-bold ${
                overallAttendancePercentage >= 75 ? "text-primary" : "text-destructive"
              }`}
            >
              {overallAttendancePercentage.toFixed(0)}%
            </div>
            <p className="text-muted-foreground mt-2">
              {overallAttendancePercentage >= 75
                ? "Your attendance is in good standing."
                : "Your attendance is below the 75% requirement."}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Attendance Details</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              View your attendance percentage by subject in the table or chart below.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance By Subject</CardTitle>
        </CardHeader>
        <CardContent>
          {!subjectData || subjectData.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No attendance data has been recorded yet.
            </p>
          ) : (
            <Tabs defaultValue="table" className="w-full">
              <TabsList className="grid w-full grid-cols-2 max-w-sm mx-auto">
                <TabsTrigger value="table" className="gap-2">
                  <TableIcon className="h-4 w-4" />
                  Table View
                </TabsTrigger>
                <TabsTrigger value="chart" className="gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Chart View
                </TabsTrigger>
              </TabsList>

              <TabsContent value="table" className="mt-6">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Subject</TableHead>
                        <TableHead className="text-center">Present</TableHead>
                        <TableHead className="text-center">Total</TableHead>
                        <TableHead className="text-center">Percentage</TableHead>
                        <TableHead className="text-right">History</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subjectData.map((data, index) => {
                        const isOpen = openStates[data.subject] || false;
                        return (
                          <Collapsible asChild key={index} onOpenChange={() => toggleCollapsible(data.subject)}>
                            <>
                              <TableRow>
                                <TableCell className="font-medium">{data.subject}</TableCell>
                                <TableCell className="text-center">{data.present}</TableCell>
                                <TableCell className="text-center">{data.total}</TableCell>
                                <TableCell
                                  className={`text-center font-medium ${
                                    data.attendancePercentage >= 75 ? "text-primary" : "text-destructive"
                                  }`}
                                >
                                  {data.attendancePercentage.toFixed(0)}%
                                </TableCell>
                                <TableCell className="text-right">
                                  <CollapsibleTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                      {isOpen ? (
                                        <ChevronUp className="h-4 w-4" />
                                      ) : (
                                        <ChevronDown className="h-4 w-4" />
                                      )}
                                      <span className="sr-only">Toggle details</span>
                                    </Button>
                                  </CollapsibleTrigger>
                                </TableCell>
                              </TableRow>
                              <CollapsibleContent asChild>
                                <TableRow>
                                  <TableCell colSpan={5} className="p-0">
                                    <div className="p-4 bg-muted/50">
                                      <h4 className="font-medium mb-2">
                                        Attendance History for {data.subject}
                                      </h4>
                                      <Table>
                                        <TableHeader>
                                          <TableRow>
                                            <TableHead>Date</TableHead>
                                            <TableHead className="text-right">Status</TableHead>
                                          </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                          {data.records.map((record, i) => {
                                            const date = new Date(record.date);
                                            const dateString =
                                              date.toString() !== "Invalid Date"
                                                ? date.toLocaleDateString()
                                                : "Invalid Date";
                                            return (
                                              <TableRow key={i}>
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
                                  </TableCell>
                                </TableRow>
                              </CollapsibleContent>
                            </>
                          </Collapsible>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="chart" className="mt-6">
                <CustomBarChart chartData={subjectData} dataKey="attendancePercentage" />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewStdAttendance;