import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./pages/HomePage";
import Aboutict from "./pages/Aboutict";
import ContactPage from "./pages/ContactPage";
import AdminLayout from "./components/layout/AdminLayout";
import CoursePage from "./pages/admin_pages/CoursePage";
import Courses from "./pages/Courses";
import SchedulePage from "./pages/admin_pages/SchedulePage";
import InstructorPage from "./pages/admin_pages/InstructorPage";
import StudentPage from "./pages/admin_pages/StudentPage";
import Enrollment from "./pages/admin_pages/EnrollmentPage";
import CourseDetail from "./pages/CourseDetail";
import CourseDetailAdmin from "./pages/admin_pages/CourseDetailAdmin";
import AuthLayout from "./components/layout/AuthLayout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Dashboard from "./pages/admin_pages/Dashboard";
import EmployeePage from "./pages/admin_pages/EmployeePage";
import AdminLoginPage from "./pages/auth/AdminLoginPage";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- 1. USER AUTHENTICATION --- */}
        <Route path="auth" element={<AuthLayout />}>
          <Route index element={<LoginPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        {/* --- 2. ADMIN AUTHENTICATION (Separate from public AuthLayout) --- */}
        <Route path="admin/login" element={<AdminLoginPage />} />

        {/* --- 3. PUBLIC WEBSITE --- */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="aboutict" element={<Aboutict />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="coursePage" element={<Courses />} />
          <Route path="course/:id" element={<CourseDetail />} />
        </Route>

        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="Dashboard" element={<Dashboard />} />
          <Route path="EmployeePage" element={<EmployeePage />} />
          <Route path="courseAdmin" element={<CoursePage />} />
          <Route path="schedulePage" element={<SchedulePage />} />
          <Route path="instructorPage" element={<InstructorPage />} />
          <Route path="studentPage" element={<StudentPage />} />
          <Route path="enrollmentPage" element={<Enrollment />} />
          <Route path="courseDetail" element={<CourseDetailAdmin />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
