import { Navigate } from "react-router-dom";

function TeacherProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const storedTeacher = localStorage.getItem("teacher");

  let teacher = null;

  try {
    teacher = storedTeacher ? JSON.parse(storedTeacher) : null;
  } catch (error) {
    localStorage.removeItem("teacher");
    return <Navigate to="/teacher/login" replace />;
  }

  if (!token || !teacher) {
    return <Navigate to="/teacher/login" replace />;
  }

  return children;
}

export default TeacherProtectedRoute;