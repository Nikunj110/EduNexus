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
      dispatch(getUserDetails(currentUser._id, "Student") as any);
    }
  }, [dispatch, currentUser?._id]);

  useEffect(() => {
    if (userDetails) {
      setSubjectMarks(userDetails.examResult || []);
    }
  }, [userDetails]);

  useEffect(() => {
    if (subjectMarks.length === 0 && currentUser?.sclassName?._id) {
      dispatch(getSubjectList(currentUser.sclassName._id, "ClassSubjects") as any);
    }
  }, [subjectMarks, dispatch, currentUser?.sclassName?._id]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  const hasMarks = subjectMarks && Array.isArray(subjectMarks) && subjectMarks.length > 0;

  if (!hasMarks) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Class Details</h2>
          <p className="text-muted-foreground">
            You are currently in Class {sclassDetails?.sclassName}
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Your Subjects</CardTitle>
          </CardHeader>
          <CardContent>
            {subjectsList && subjectsList.length > 0 ? (
              <div className="space-y-2">
                {subjectsList.map((subject: any, index: number) => (
                  <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                    <span className="font-medium">{subject.subName}</span>
                    <span className="text-sm text-muted-foreground">({subject.subCode})</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No subjects assigned yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Subject Marks</h2>
        <p className="text-muted-foreground">View your performance across subjects</p>
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

            <TabsContent value="table" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-right">Marks Obtained</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjectMarks.map((result: any, index: number) => {
                    if (!result.subName || !result.marksObtained) return null;
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
            </TabsContent>

            <TabsContent value="chart" className="mt-6">
              <CustomBarChart chartData={subjectMarks} dataKey="marksObtained" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentSubjects;
