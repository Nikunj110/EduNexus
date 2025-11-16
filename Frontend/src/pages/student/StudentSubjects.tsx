// FIX: The dispatch for 'getUserDetails' in useEffect is now a single object { id, role }.
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSubjectList } from "@/redux/sclassRelated/sclassHandle";
import { getUserDetails } from "@/redux/userRelated/userHandle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CustomBarChart from "@/components/charts/CustomBarChart";
import { RootState } from "@/redux/store";
import { BarChart3, TableIcon } from "lucide-react";

const StudentSubjects = () => {
  const dispatch = useDispatch();
  const { subjectsList, sclassDetails } = useSelector((state: RootState) => state.sclass);
  const { userDetails, currentUser, loading } = useSelector((state: RootState) => state.user);
  const [subjectMarks, setSubjectMarks] = useState<any[]>([]);

  useEffect(() => {
    if (currentUser?._id) {
      // FIX: Updated dispatch to pass a single object
      dispatch(getUserDetails({ id: currentUser._id, role: "Student" }) as any);
    }
  }, [dispatch, currentUser?._id]);

  useEffect(() => {
    if (userDetails) {
      setSubjectMarks(userDetails.examResult || []);
    }
  }, [userDetails]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Subjects & Marks</h2>
        <p className="text-muted-foreground">View your academic performance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam Results</CardTitle>
        </CardHeader>
        <CardContent>
          {!subjectMarks || subjectMarks.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No exam marks have been recorded yet.
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
                        <TableHead className="text-right">Marks Obtained</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {subjectMarks.map((result: any, index: number) => {
                        if (!result.subName || result.marksObtained === undefined) return null;
                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">
                              {result.subName.subName}
                            </TableCell>
                            <TableCell className="text-right">
                              {result.marksObtained}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="chart" className="mt-6">
                <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentSubjects;