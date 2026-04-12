import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TeacherLayout from "../../components/TeacherLayout";
import "./Attendance.css";

function TeacherAttendance() {
  const [students, setStudents] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [department, setDepartment] = useState("");
  const [subject, setSubject] = useState("");
  const [isLocked, setIsLocked] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const today = new Date().toISOString().split("T")[0];

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.removeItem("teacher");
      navigate("/teacher/login");
      throw new Error("No token found");
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const checkTimeLock = () => {
    const now = new Date();
    const hour = now.getHours();
    setIsLocked(hour >= 18);
  };

  const fetchStudents = async () => {
    if (!department) return;

    try {
      setError("");
      const config = getAuthConfig();

      const res = await axios.get(
        `http://localhost:5000/api/students?department=${department}`,
        config
      );

      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch students error:", err);

      if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("teacher");
        navigate("/teacher/login");
      } else {
        setError(err.response?.data?.message || "Failed to load students");
      }

      setStudents([]);
    }
  };

  const fetchSubjects = async () => {
    if (!department) return;

    try {
      setError("");
      const config = getAuthConfig();

      const res = await axios.get(
        `http://localhost:5000/api/subjects?department=${department}`,
        config
      );

      setSubjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch subjects error:", err);

      if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("teacher");
        navigate("/teacher/login");
      } else {
        setError(err.response?.data?.message || "Failed to load subjects");
      }

      setSubjects([]);
    }
  };

  const checkExistingAttendance = async () => {
    if (!department || !subject) return;

    try {
      setError("");
      const config = getAuthConfig();

      const res = await axios.get(
        `http://localhost:5000/api/attendance?department=${department}&subject=${subject}`,
        config
      );

      const todayData = Array.isArray(res.data)
        ? res.data.filter((a) => a.date === today)
        : [];

      if (todayData.length > 0) {
        const existing = {};
        todayData.forEach((a) => {
          existing[a.studentId] = a.status;
        });
        setAttendance(existing);
      } else {
        setAttendance({});
      }

      checkTimeLock();
    } catch (err) {
      console.error("Check attendance error:", err);

      if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("teacher");
        navigate("/teacher/login");
      } else {
        setError(err.response?.data?.message || "Failed to check attendance");
      }
    }
  };

  useEffect(() => {
    if (department) {
      fetchStudents();
      fetchSubjects();
      setSubject("");
      setAttendance({});
    }
  }, [department]);

  useEffect(() => {
    if (department && subject) {
      checkExistingAttendance();
    }
  }, [department, subject]);

  const handleChange = (id, status) => {
    if (isLocked) return;
    setAttendance((prev) => ({
      ...prev,
      [id]: status,
    }));
  };

  const handleSubmit = async () => {
    if (!department) {
      alert("Select department");
      return;
    }

    if (!subject) {
      alert("Select subject");
      return;
    }

    if (isLocked) {
      alert("Attendance locked after 6 PM");
      return;
    }

    if (students.length === 0) {
      alert("No students found");
      return;
    }

    const records = students.map((s) => ({
      studentId: s._id,
      name: s.name,
      department,
      subject,
      date: today,
      status: attendance[s._id] || "Absent",
    }));

    try {
      setError("");
      const config = getAuthConfig();

      await axios.post(
        "http://localhost:5000/api/attendance/mark",
        { records },
        config
      );

      alert("Attendance Saved / Updated");
    } catch (err) {
      console.error("Submit attendance error:", err);

      if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("teacher");
        navigate("/teacher/login");
      } else {
        alert(err.response?.data?.message || "Error while saving attendance");
      }
    }
  };

  return (
    <TeacherLayout>
      <div className="attendance-page">
        <div className="attendance-card">
          <div className="attendance-header">
            <h2>Mark Attendance</h2>
            <p>Date: {today}</p>
          </div>

          {isLocked && (
            <p className="lock-message">🔒 Attendance locked after 6 PM</p>
          )}

          {error && <p className="error-message">{error}</p>}

          <div className="attendance-controls">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">Select Department</option>
              <option value="BCA">BCA</option>
              <option value="BBA">BBA</option>
              <option value="MCA">MCA</option>
            </select>

            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={!department}
            >
              <option value="">Select Subject</option>
              {subjects.map((s) => (
                <option key={s._id} value={s.name}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="student-list">
            {students.length > 0 ? (
              students.map((s) => (
                <div className="student-row" key={s._id}>
                  <div className="student-name">{s.name}</div>

                  <div className="attendance-buttons">
                    <button
                      className={
                        attendance[s._id] === "Present"
                          ? "btn present active-present"
                          : "btn present"
                      }
                      disabled={isLocked}
                      onClick={() => handleChange(s._id, "Present")}
                    >
                      Present
                    </button>

                    <button
                      className={
                        attendance[s._id] === "Absent"
                          ? "btn absent active-absent"
                          : "btn absent"
                      }
                      disabled={isLocked}
                      onClick={() => handleChange(s._id, "Absent")}
                    >
                      Absent
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-text">No students found</p>
            )}
          </div>

          <button
            className="submit-btn"
            disabled={isLocked || !department || !subject || students.length === 0}
            onClick={handleSubmit}
          >
            Submit Attendance
          </button>
        </div>
      </div>
    </TeacherLayout>
  );
}

export default TeacherAttendance;