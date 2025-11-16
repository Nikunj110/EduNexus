import { Routes, Route, Navigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { StudentSidebar } from "@/components/student/StudentSidebar";
import StudentHomePage from "./StudentHomePage";
import StudentProfile from "./StudentProfile";
import StudentSubjects from "./StudentSubjects";
import ViewStdAttendance from "./ViewStdAttendance";
import StudentComplain from "./StudentComplain";
import Logout from "../Logout";

const StudentDashboard = () => {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full">
        <StudentSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-14 border-b bg-background flex items-center px-4 sticky top-0 z-10">
            <SidebarTrigger />
            <h1 className="ml-4 text-lg font-semibold">Student Dashboard</h1>
          </header>

          <main className="flex-1 overflow-auto bg-muted/30 p-6">
            <Routes>
              <Route path="/" element={<Navigate to="/Student/dashboard" replace />} />
              <Route path="/dashboard" element={<StudentHomePage />} />
              <Route path="/profile" element={<StudentProfile />} />
              <Route path="/subjects" element={<StudentSubjects />} />
              <Route path="/attendance" element={<ViewStdAttendance />} />
              <Route path="/complain" element={<StudentComplain />} />
              <Route path="/logout" element={<Logout />} />
            </Routes>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default StudentDashboard;
