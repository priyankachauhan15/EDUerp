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

  // 🔐 Auth config
  const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.clear();
      navigate("/teacher/login");
      throw new Error("No token found");
    }

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  // ⏱️ Lock after 6 PM
  const checkTimeLock = () => {
    const hour = new Date().getHours();
    setIsLocked(hour >= 18);
  };

  // ❌ Handle auth or API errors
  const handleAuthError = (err, msg) => {
    console.error("❌ API Error:", err);

    if (err.response?.status === 401) {
      localStorage.clear();
      navigate("/teacher/login");
    } else {
      setError(err.response?.data?.message || msg);
    }
  };

  // 👨‍🎓 Fetch Students
  const fetchStudents = async () => {
    if (!department) return;

    try {
      setError("");

      const res = await axios.get(
        `https://eduerp-y7bk.onrender.com/api/students?department=${department}`,
        getAuthConfig()
      );

      setStudents(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      handleAuthError(err, "Failed to load students");
    }
  };

  // 📚 Fetch Subjects
  const fetchSubjects = async () => {
    if (!department) return;

    try {
      setError("");

      const res = await axios.get(
        `https://eduerp-y7bk.onrender.com/api/subjects?department=${department}`,
        getAuthConfig()
      );

      setSubjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      handleAuthError(err, "Failed to load subjects");
    }
  };

  // 🔁 Check existing attendance
  const checkExistingAttendance = async () => {
    if (!department || !subject) return;

    try {
      setError("");

      const res = await axios.get(
        `https://eduerp-y7bk.onrender.com/api/attendance?department=${department}&subject=${subject}`,
        getAuthConfig()
      );

      const todayData = Array.isArray(res.data)
        ? res.data.filter((a) => a.date === today)
        : [];

      const existing = {};
      todayData.forEach((a) => {
        existing[a.studentId] = a.status;
      });

      setAttendance(existing);
      checkTimeLock();
    } catch (err) {
      handleAuthError(err, "Failed to check attendance");
    }
  };

  useEffect(() => {
    checkTimeLock();
  }, []);

  useEffect(() => {
    if (department) {
      fetchStudents();
      fetchSubjects();
      setSubject("");
      setAttendance({});
    } else {
      setStudents([]);
      setSubjects([]);
      setAttendance({});
      setSubject("");
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

  // 🚀 Submit attendance
  const handleSubmit = async () => {
    if (!department) return alert("Select department");
    if (!subject) return alert("Select subject");
    if (isLocked) return alert("Attendance locked after 6 PM");
    if (!students.length) return alert("No students found");

    const records = students.map((s) => ({
      studentId: s._id,
      name: s.name,
      department,
      subject,
      date: today,
      status: attendance[s._id] || "Absent",
    }));

    console.log("📤 Sending attendance records:", records);

    try {
      const response = await axios.post(
        "https://eduerp-y7bk.onrender.com/api/attendance/mark",
        { records },
        getAuthConfig()
      );

      console.log("✅ Attendance response:", response.data);
      alert(response.data.message || "Attendance saved successfully");
      checkExistingAttendance();
    } catch (err) {
      console.error("❌ FULL ERROR:", err);

      const backendMsg =
        err.response?.data?.message || "Server error while saving attendance";

      alert(backendMsg);
    }
  };

  return (
    <TeacherLayout>
      <div className="attendance-page">
        <div className="attendance-card">
          <h2>Mark Attendance</h2>

          {error && <p className="error-message">{error}</p>}

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

          <div className="student-list">
            {students.map((s) => (
              <div key={s._id} className="student-row">
                <span>{s.name}</span>

                <button
                  type="button"
                  onClick={() => handleChange(s._id, "Present")}
                  disabled={isLocked}
                >
                  Present
                </button>

                <button
                  type="button"
                  onClick={() => handleChange(s._id, "Absent")}
                  disabled={isLocked}
                >
                  Absent
                </button>

                <strong style={{ marginLeft: "10px" }}>
                  {attendance[s._id] || "Absent"}
                </strong>
              </div>
            ))}
          </div>

          <button type="button" onClick={handleSubmit} disabled={isLocked}>
            Submit
          </button>
        </div>
      </div>
    </TeacherLayout>
  );
}

export default TeacherAttendance;