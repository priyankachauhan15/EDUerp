import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./TeacherLayout.css";

function TeacherLayout({ children }) {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("teacher");
    navigate("/teacher/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      <div className={open ? "sidebar" : "sidebar closed"}>
        <h2 className="logo">EduERP</h2>

        <Link
          to="/teacher/dashboard"
          className={isActive("/teacher/dashboard") ? "active-link" : ""}
        >
          Dashboard
        </Link>

        <Link
          to="/teacher/students"
          className={isActive("/teacher/students") ? "active-link" : ""}
        >
          Students
        </Link>

        <Link
          to="/teacher/subject"
          className={isActive("/teacher/subject") ? "active-link" : ""}
        >
          Subjects
        </Link>

        <Link
          to="/teacher/attendance"
          className={isActive("/teacher/attendance") ? "active-link" : ""}
        >
          Attendance
        </Link>

        <Link
          to="/teacher/econtent"
          className={isActive("/teacher/econtent") ? "active-link" : ""}
        >
          Study Material
        </Link>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <div className="main">
        <div className="navbar">
          <button className="menu-btn" onClick={() => setOpen(!open)}>
            ☰
          </button>

          <h3>Teacher Panel</h3>
        </div>

        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default TeacherLayout;