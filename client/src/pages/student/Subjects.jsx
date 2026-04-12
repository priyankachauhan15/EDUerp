import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../components/StudentLayout";
import "./Subjects.css";

function StudentSubjects() {
  const [subjects, setSubjects] = useState([]);
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchSubjects = async (dept, token) => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `http://localhost:5000/api/subjects?department=${dept}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Subjects:", res.data);
      setSubjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch subjects error:", err);

      if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("student");
        navigate("/student/login");
      } else {
        setError(err.response?.data?.message || "Failed to load subjects");
      }

      setSubjects([]);
    } finally {
      setLoading(false);
    }
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
      console.log("User:", user);

      if (!user?.department) {
        setLoading(false);
        setError("Department not found. Please login again.");
        navigate("/student/login");
        return;
      }

      setDepartment(user.department);
      fetchSubjects(user.department, token);
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
      <div style={{ padding: "20px" }}>
        <h1>My Subjects</h1>
        <h3>Department: {department || "Not Available"}</h3>

        {loading && <p>Loading subjects...</p>}

        {error && (
          <p style={{ color: "red", fontWeight: "bold" }}>
            {error}
          </p>
        )}

        {!loading && !error && (
          <div className="subject-container">
            {subjects.length > 0 ? (
              subjects.map((sub) => (
                <div className="subject-card" key={sub._id}>
                  <h2>{sub.name}</h2>
                  <p>{sub.department}</p>
                </div>
              ))
            ) : (
              <p>No subjects found</p>
            )}
          </div>
        )}
      </div>
    </StudentLayout>
  );
}

export default StudentSubjects;