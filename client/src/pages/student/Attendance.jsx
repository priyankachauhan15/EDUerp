import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../components/StudentLayout";
import "./Attendance.css";

function StudentAttendance() {
  const [subjectStats, setSubjectStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchAttendance = async (studentId, token) => {
    if (!studentId) {
      setError("Student ID not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `https://eduerp-y7bk.onrender.com/api/attendance/student/${studentId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Attendance data:", res.data);
      calculatePercentage(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch attendance error:", err);
      console.log("Backend response:", err.response?.data);

      if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("student");
        navigate("/student/login");
      } else {
        setError(err.response?.data?.message || "Failed to load attendance");
      }

      setSubjectStats([]);
    } finally {
      setLoading(false);
    }
  };

  const calculatePercentage = (data) => {
    const map = {};

    data.forEach((a) => {
      if (!map[a.subject]) {
        map[a.subject] = { total: 0, present: 0 };
      }

      map[a.subject].total += 1;

      if (a.status === "Present") {
        map[a.subject].present += 1;
      }
    });

    const result = Object.keys(map).map((subject) => {
      const total = map[subject].total;
      const present = map[subject].present;
      const percent = total > 0 ? ((present / total) * 100).toFixed(1) : "0.0";

      return { subject, percent };
    });

    setSubjectStats(result);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser =
      localStorage.getItem("user") || localStorage.getItem("student");

    if (!token) {
      setLoading(false);
      setError("No token found. Please login again.");
      navigate("/student/login");
      return;
    }

    try {
      if (!storedUser || storedUser === "undefined") {
        setLoading(false);
        setError("User data not found. Please login again.");
        navigate("/student/login");
        return;
      }

      const user = JSON.parse(storedUser);
      console.log("Logged in user:", user);

      const studentId = user.id || user._id;

      if (!studentId) {
        setLoading(false);
        setError("Student ID missing in login data. Please login again.");
        return;
      }

      fetchAttendance(studentId, token);
    } catch (error) {
      console.error("User parse error:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("student");
      setLoading(false);
      setError("Invalid user data. Please login again.");
      navigate("/student/login");
    }
  }, [navigate]);

  return (
    <StudentLayout>
      <div className="attendance-container">
        <h1>My Attendance</h1>

        {loading && <p className="no-data">Loading attendance...</p>}
        {error && <p className="no-data" style={{ color: "red" }}>{error}</p>}

        {!loading && !error && (
          <div className="stats-container">
            {subjectStats.length > 0 ? (
              subjectStats.map((s, i) => (
                <div key={i} className="stat-card">
                  <div className="stat-header">
                    <h3>{s.subject}</h3>
                    <span>{s.percent}%</span>
                  </div>

                  <div className="progress-bar">
                    <div
                      className={`progress-fill ${Number(s.percent) < 75 ? "low" : ""}`}
                      style={{ width: `${s.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-data">No attendance data</p>
            )}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

export default StudentAttendance;