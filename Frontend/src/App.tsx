import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Homepage from "./pages/Homepage";
import ChooseUser from "./pages/ChooseUser";
import LoginPage from "./pages/LoginPage";
import Logout from "./pages/Logout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminRegisterPage from "./pages/AdminRegisterPage";
import StudentDashboard from "./pages/student/StudentDashboard";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";

const queryClient = new QueryClient();

const App = () => (
  <Provider store={store}>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/choose" element={<ChooseUser />} />
            <Route path="/chooseasguest" element={<ChooseUser visitor="guest" />} />
            <Route path="/Adminlogin" element={<LoginPage role="Admin" />} />
            <Route path="/Adminregister" element={<AdminRegisterPage />} />
            <Route path="/Studentlogin" element={<LoginPage role="Student" />} />
            <Route path="/Teacherlogin" element={<LoginPage role="Teacher" />} />
            <Route path="/logout" element={<Logout />} />
            <Route path="/Admin/*" element={<AdminDashboard />} />
            <Route path="/Student/*" element={<StudentDashboard />} />
            <Route path="/Teacher/*" element={<TeacherDashboard />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </Provider>
);

export default App;
