import { useSelector } from 'react-redux';
import { Navigate, Route, Routes } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { TeacherSidebar } from '@/components/teacher/TeacherSidebar';
import TeacherHomePage from './TeacherHomePage';
import TeacherProfile from './TeacherProfile';
import TeacherClassDetails from './TeacherClassDetails';
import TeacherViewStudent from './TeacherViewStudent';
import TeacherComplain from './TeacherComplain';
import StudentAttendance from '../admin/studentRelated/StudentAttendance';
import StudentExamMarks from '../admin/studentRelated/StudentExamMarks';
import Logout from '../Logout';

const TeacherDashboard = () => {
  const { currentUser } = useSelector((state: any) => state.user);

  if (!currentUser) {
    return <Navigate to="/Teacherlogin" replace />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <TeacherSidebar />
        <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background px-6">
            <SidebarTrigger />
            <div className="flex-1">
              <h1 className="text-xl font-semibold">School Management System</h1>
              <p className="text-sm text-muted-foreground">Welcome, {currentUser.name}</p>
            </div>
          </header>
          <main className="flex-1 overflow-auto p-6">
            <Routes>
              <Route path="/" element={<TeacherHomePage />} />
              <Route path="/dashboard" element={<TeacherHomePage />} />
              <Route path="/profile" element={<TeacherProfile />} />
              <Route path="/class" element={<TeacherClassDetails />} />
              <Route path="/class/student/:id" element={<TeacherViewStudent />} />
              <Route path="/class/student/attendance/:studentID/:subjectID" element={<StudentAttendance situation="Subject" />} />
              <Route path="/class/student/marks/:studentID/:subjectID" element={<StudentExamMarks situation="Subject" />} />
              <Route path="/complain" element={<TeacherComplain />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="*" element={<Navigate to="/Teacher/dashboard" />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default TeacherDashboard;
