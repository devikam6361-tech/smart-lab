import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";

import HodDashboard from "../pages/hod/Dashboard";
import ClerkDashboard from "../pages/clerk/Dashboard";
import TeacherDashboard from "../pages/teacher/Dashboard";

import TeacherAttendance from "../pages/teacher/Attendance";
import TeacherSessions from "../pages/teacher/Sessions";
import SessionDetails from "../pages/teacher/SessionDetails";

import ReportsDashboard from "../pages/reports/Dashboard";

import TeacherManagement from "../pages/hod/TeacherManagement";
import Labs from "../pages/hod/Labs";
import HodClerks from "../pages/hod/Clerks";

import StudentManagement from "../pages/clerk/StudentManagement";
import StudentDetails from "../pages/clerk/StudentDetails";
import StudentLabAssignmentPage from "../pages/clerk/StudentLabAssignment";
import LabAttendancePage from "../pages/clerk/LabAttendance";

import StudentProfile from "../pages/student/StudentProfile";

import Students from "../pages/teacher/Students";
import TeacherStudentDetails from "../pages/teacher/StudentDetails";

import Projects from "../pages/teacher/Projects";
import Assignments from "../pages/teacher/Assignments";

import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth();

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppRoutes = () => {
  return (
    <Routes>

      {/* LOGIN */}
      <Route
        path="/"
        element={<Login />}
      />

      {/* HOD */}
      <Route
        path="/hod"
        element={
          <ProtectedRoute>
            <HodDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hod/teachers"
        element={
          <ProtectedRoute>
            <TeacherManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hod/labs"
        element={
          <ProtectedRoute>
            <Labs />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hod/clerks"
        element={
          <ProtectedRoute>
            <HodClerks />
          </ProtectedRoute>
        }
      />

      <Route
        path="/hod/reports"
        element={
          <ProtectedRoute>
            <ReportsDashboard />
          </ProtectedRoute>
        }
      />

      {/* CLERK */}
      <Route
        path="/clerk"
        element={
          <ProtectedRoute>
            <ClerkDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/clerk/students"
        element={
          <ProtectedRoute>
            <StudentManagement />
          </ProtectedRoute>
        }
      />

      <Route
        path="/clerk/student/:id"
        element={
          <ProtectedRoute>
            <StudentDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/clerk/student-labs"
        element={
          <ProtectedRoute>
            <StudentLabAssignmentPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/clerk/lab-attendance"
        element={
          <ProtectedRoute>
            <LabAttendancePage />
          </ProtectedRoute>
        }
      />

      {/* TEACHER */}
      <Route
        path="/teacher"
        element={
          <ProtectedRoute>
            <TeacherDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/attendance"
        element={
          <ProtectedRoute>
            <TeacherAttendance />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/sessions"
        element={
          <ProtectedRoute>
            <TeacherSessions />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/session/:id"
        element={
          <ProtectedRoute>
            <SessionDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/students"
        element={
          <ProtectedRoute>
            <Students />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/student/:id"
        element={
          <ProtectedRoute>
            <TeacherStudentDetails />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/projects"
        element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        }
      />

      <Route
        path="/teacher/assignments"
        element={
          <ProtectedRoute>
            <Assignments />
          </ProtectedRoute>
        }
      />

      {/* STUDENT */}
      <Route
        path="/student/:id"
        element={
          <ProtectedRoute>
            <StudentProfile />
          </ProtectedRoute>
        }
      />

    </Routes>
  );
};

export default AppRoutes;