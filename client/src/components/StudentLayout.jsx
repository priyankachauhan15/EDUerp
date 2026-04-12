import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./StudentLayout.css";

function StudentLayout({ children }) {
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("student");
    navigate("/student/login");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <div className="layout">
      <div className={open ? "sidebar" : "sidebar closed"}>
        <h2 className="logo">EduERP</h2>

        <Link
          to="/student/dashboard"
          className={isActive("/student/dashboard") ? "active-link" : ""}
        >
          Dashboard
        </Link>

        <Link
          to="/student/attendance"
          className={isActive("/student/attendance") ? "active-link" : ""}
        >
          Attendance
        </Link>

        <Link
          to="/student/econtent"
          className={isActive("/student/econtent") ? "active-link" : ""}
        >
          Study Material
        </Link>

        <Link
          to="/student/subjects"
          className={isActive("/student/subjects") ? "active-link" : ""}
        >
          Subjects
        </Link>

        <Link
          to="/student/profile"
          className={isActive("/student/profile") ? "active-link" : ""}
        >
          Profile
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

          <h3>Student Panel</h3>
        </div>

        <div className="content">{children}</div>
      </div>
    </div>
  );
}

export default StudentLayout;