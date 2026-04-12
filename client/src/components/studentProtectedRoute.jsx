import { Navigate } from "react-router-dom";

function StudentProtectedRoute({ children }) {
  const token = localStorage.getItem("token");
  const storedStudent =
    localStorage.getItem("user") || localStorage.getItem("student");

  let student = null;

  try {
    student = storedStudent ? JSON.parse(storedStudent) : null;
  } catch (error) {
    localStorage.removeItem("user");
    localStorage.removeItem("student");
    return <Navigate to="/student/login" replace />;
  }

  if (!token || !student) {
    return <Navigate to="/student/login" replace />;
  }

  return children;
}

export default StudentProtectedRoute;