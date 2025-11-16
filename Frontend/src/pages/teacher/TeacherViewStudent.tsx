// FIX: The dispatch for 'getUserDetails' in useEffect is now a single object { id, role }.
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserDetails } from '@/redux/userRelated/userHandle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Plus, ArrowLeft, User, ClipboardList, FileText } from 'lucide-react';
import {
  calculateOverallAttendancePercentage,
  calculateSubjectAttendancePercentage,
  groupAttendanceBySubject,
} from '@/lib/attendanceCalculator';
import CustomPieChart from '@/components/charts/CustomPieChart';
import { RootState } from '@/redux/store';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

const TeacherViewStudent = () => {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const { currentUser, userDetails, loading } = useSelector((state: RootState) => state.user);

  const studentID = params.id;
  const teachSubject = currentUser?.teachSubject?.subName;
  const teachSubjectID = currentUser?.teachSubject?._id;

  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (studentID) {
      // FIX: Updated dispatch to pass a single object
      dispatch(getUserDetails({ id: studentID, role: 'Student' }) as any);
    }
  }, [dispatch, studentID]);

  const toggleCollapsible = (subjectName: string) => {
    setOpenStates((prev) => ({ ...prev, [subjectName]: !prev[subjectName] }));
  };

  if (loading) {
    return (
       <div className="space-y-6 animate-in fade-in duration-500">
         <div className="flex items-center gap-4">
           <Skeleton className="h-10 w-10" />
           <Skeleton className="h-9 w-48" />
         </div>
         <Skeleton className="h-32 w-full" />
         <Skeleton className="h-64 w-full" />
       </div>
    );
  }

  const studentAttendance = userDetails?.attendance || [];
  const subjectAttendance = studentAttendance.filter(
    (att: any) => att.subName.subName === teachSubject
  );
  const subjectAttendancePercentage = calculateSubjectAttendancePercentage(
    subjectAttendance,
    currentUser.teachSubject.sessions
  );
  
  const subjectMarks = userDetails?.examResult?.filter(
    (res: any) => res.subName.subName === teachSubject
  ) || [];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h2 className="text-3xl font-bold text-foreground">{userDetails?.name}</h2>
          <p className="text-muted-foreground">Roll No: {userDetails?.rollNum}</p>
        </div>
      </div>
      
      {/* Attendance Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <ClipboardList className="h-5 w-5" />
            Attendance: {teachSubject}
          </CardTitle>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => navigate(`/Teacher/class/student/attendance/${studentID}/${teachSubjectID}`)}
          >
            <Plus className="h-4 w-4" />
            Mark Attendance
          </Button>
        </CardHeader>
        <CardContent>
          <div className="text-center">
             <div
               className={`text-6xl font-bold ${
                 subjectAttendancePercentage >= 75 ? "text-primary" : "text-destructive"
               }`}
             >
               {subjectAttendancePercentage.toFixed(0)}%
             </div>
             <p className="text-muted-foreground mt-2">
               {subjectAttendancePercentage >= 75
                 ? "Attendance is in good standing."
                 : "Attendance is below the 75% requirement."}
             </p>
          </div>
          {subjectAttendance.length > 0 && (
             <Collapsible className="mt-4">
               <CollapsibleTrigger asChild>
                 <Button variant="link" className="mx-auto flex gap-1">
                   View Detailed History
                   <ChevronDown className="h-4 w-4" />
                 </Button>
               </CollapsibleTrigger>
               <CollapsibleContent>
                 <div className="rounded-md border mt-2 max-h-60 overflow-y-auto">
                   <Table>
                     <TableHeader>
                       <TableRow>
                         <TableHead>Date</TableHead>
                         <TableHead className="text-right">Status</TableHead>
                       </TableRow>
                     </TableHeader>
                     <TableBody>
                       {subjectAttendance.map((record: any, i: number) => (
                         <TableRow key={i}>
                           <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
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
                       ))}
                     </TableBody>
                   </Table>
                 </div>
               </CollapsibleContent>
             </Collapsible>
          )}
        </CardContent>
      </Card>
      
      {/* Marks Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Marks: {teachSubject}
          </CardTitle>
          <Button
            size="sm"
            className="gap-2"
            onClick={() => navigate(`/Teacher/class/student/marks/${studentID}/${teachSubjectID}`)}
          >
            <Plus className="h-4 w-4" />
            Add Marks
          </Button>
        </CardHeader>
        <CardContent>
          {subjectMarks.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead className="text-right">Marks Obtained</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subjectMarks.map((result: any, index: number) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{result.subName.subName}</TableCell>
                      <TableCell className="text-right">{result.marksObtained}</TableCell>
                    </TableRow>
                  ))}
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