import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import StudentProtectedRoute from "./components/studentProtectedRoute";
import TeacherProtectedRoute from "./components/teacherProtectedRoute";
import RoleLogin from "./pages/RoleLogin/RoleLogin";

/* ================= TEACHER ================= */
import TeacherAttendance from "./pages/teacher/Attendance";
import TeacherDashboard from "./pages/teacher/Dashboard";
import TeacherLogin from "./pages/teacher/Login";
import TeacherRegister from "./pages/teacher/Register";
import TeacherStudents from "./pages/teacher/StudentList";
import TeacherSubject from "./pages/teacher/Subject";
import SubjectList from "./pages/teacher/subjectList";
import TeacherEContent from "./pages/teacher/teacherEContent";

/* ================= STUDENT ================= */
import StudentAttendance from "./pages/student/Attendance";
import StudentDashboard from "./pages/student/Dashboard";
import StudentLogin from "./pages/student/Login";
import StudentProfile from "./pages/student/Profile";
import StudentRegister from "./pages/student/Register";
import StudentEContent from "./pages/student/studentEContent";
import StudentSubjects from "./pages/student/Subjects";

function App() {
  return (
    <Router>
      <Routes>
        {/* ROLE SELECTION */}
        <Route path="/" element={<RoleLogin />} />

        {/* ================= TEACHER PUBLIC ================= */}
        <Route path="/teacher/login" element={<TeacherLogin />} />
        <Route path="/teacher/register" element={<TeacherRegister />} />

        {/* ================= TEACHER PROTECTED ================= */}
        <Route
          path="/teacher/dashboard"
          element={
            <TeacherProtectedRoute>
              <TeacherDashboard />
            </TeacherProtectedRoute>
          }
        />
        <Route
          path="/teacher/attendance"
          element={
            <TeacherProtectedRoute>
              <TeacherAttendance />
            </TeacherProtectedRoute>
          }
        />
        <Route
          path="/teacher/subject"
          element={
            <TeacherProtectedRoute>
              <TeacherSubject />
            </TeacherProtectedRoute>
          }
        />
        <Route
          path="/teacher/students"
          element={
            <TeacherProtectedRoute>
              <TeacherStudents />
            </TeacherProtectedRoute>
          }
        />
        <Route
          path="/teacher/econtent"
          element={
            <TeacherProtectedRoute>
              <TeacherEContent />
            </TeacherProtectedRoute>
          }
        />
        <Route
          path="/teacher/subjects/:department"
          element={
            <TeacherProtectedRoute>
              <SubjectList />
            </TeacherProtectedRoute>
          }
        />

        {/* ================= STUDENT PUBLIC ================= */}
        <Route path="/student/login" element={<StudentLogin />} />
        <Route path="/student/register" element={<StudentRegister />} />

        {/* ================= STUDENT PROTECTED ================= */}
        <Route
          path="/student/dashboard"
          element={
            <StudentProtectedRoute>
              <StudentDashboard />
            </StudentProtectedRoute>
          }
        />
        <Route
          path="/student/attendance"
          element={
            <StudentProtectedRoute>
              <StudentAttendance />
            </StudentProtectedRoute>
          }
        />
        <Route
          path="/student/subjects"
          element={
            <StudentProtectedRoute>
              <StudentSubjects />
            </StudentProtectedRoute>
          }
        />
        <Route
          path="/student/econtent"
          element={
            <StudentProtectedRoute>
              <StudentEContent />
            </StudentProtectedRoute>
          }
        />
        <Route
          path="/student/profile"
          element={
            <StudentProtectedRoute>
              <StudentProfile />
            </StudentProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;