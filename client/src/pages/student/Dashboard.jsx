import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../components/StudentLayout";
import "./Dashboard.css";

function Dashboard() {
  const [totalSubjects, setTotalSubjects] = useState(0);
  const [attendancePercent, setAttendancePercent] = useState("0.0");
  const [studyMaterials, setStudyMaterials] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/student/login");
      throw new Error("No token");
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user") || localStorage.getItem("student");

    try {
      if (!storedUser || storedUser === "undefined") {
        navigate("/student/login");
        return;
      }

      const user = JSON.parse(storedUser);

      const studentId = user.id || user._id;
      const department = user.department;

      if (!studentId || !department) {
        navigate("/student/login");
        return;
      }

      fetchDashboard(studentId, department);
    } catch {
      navigate("/student/login");
    }
  }, []);

  const fetchDashboard = async (studentId, department) => {
    try {
      setLoading(true);
      setError("");

      const config = getAuthConfig();

      const [subjectsRes, attendanceRes, econtentRes] = await Promise.all([
        axios.get(
          `https://eduerp-y7bk.onrender.com/api/subjects?department=${department}`,
          config
        ),
        axios.get(
          `https://eduerp-y7bk.onrender.com/api/attendance/student/${studentId}`,
          config
        ),
        axios.get(
          `https://eduerp-y7bk.onrender.com/api/econtent?department=${department}`,
          config
        ),
      ]);

      const subjects = subjectsRes.data || [];
      const attendance = attendanceRes.data || [];
      const econtent = econtentRes.data || [];

      // ✅ Subjects count
      setTotalSubjects(subjects.length);

      // ✅ Study materials count
      setStudyMaterials(econtent.length);

      // ✅ Attendance %
      const total = attendance.length;
      const present = attendance.filter(
        (a) => a.status === "Present"
      ).length;

      const percent =
        total > 0 ? ((present / total) * 100).toFixed(1) : "0.0";

      setAttendancePercent(percent);
    } catch (err) {
      console.error(err);

      if (err.response?.status === 401) {
        localStorage.clear();
        navigate("/student/login");
      } else {
        setError("Failed to load dashboard");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <StudentLayout>
      <div className="dashboard-container">
        <h1>Student Dashboard</h1>

        {loading && <p>Loading...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && (
          <div className="cards">

            {/* Subjects */}
            <div className="card">
              <h3>Total Subjects</h3>
              <p>{totalSubjects}</p>
            </div>

            {/* Attendance */}
            <div className="card">
              <h3>Attendance</h3>
              <p>{attendancePercent}%</p>
            </div>

            {/* Study Material */}
            <div className="card">
              <h3>Study Materials</h3>
              <p>{studyMaterials}</p>
            </div>

          </div>
        )}
      </div>
    </StudentLayout>
  );
}

export default Dashboard;