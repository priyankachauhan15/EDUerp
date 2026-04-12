import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TeacherLayout from "../../components/TeacherLayout";
import "./Subject.css";

function TeacherSubject() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

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

  const fetchSubjects = async () => {
    if (!department) {
      setSubjects([]);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const config = getAuthConfig();

      const res = await axios.get(
        `https://eduerp-y7bk.onrender.com/api/subjects?department=${department}`,
        config
      );

      setSubjects(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch subjects error:", err);

      if (err.response) {
        if (err.response.status === 401) {
          setError("Unauthorized. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("teacher");
          navigate("/teacher/login");
        } else {
          setError(err.response.data?.message || "Failed to fetch subjects");
        }
      } else if (err.message !== "No token found") {
        setError("Server not responding");
      }

      setSubjects([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, [department]);

  const handleAdd = async () => {
    if (!name.trim() || !department) {
      alert("Please select department and enter subject");
      return;
    }

    try {
      setError("");
      const config = getAuthConfig();

      await axios.post(
        "https://eduerp-y7bk.onrender.com/api/subjects/add",
        {
          name: name.trim(),
          department,
        },
        config
      );

      setName("");
      fetchSubjects();
    } catch (err) {
      console.error("Add subject error:", err);

      if (err.response) {
        if (err.response.status === 401) {
          alert("Unauthorized. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("teacher");
          navigate("/teacher/login");
        } else {
          alert(err.response.data?.message || "Failed to add subject");
        }
      } else if (err.message !== "No token found") {
        alert("Server not responding");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const config = getAuthConfig();

      await axios.delete(`https://eduerp-y7bk.onrender.com/api/subjects/${id}`, config);
      fetchSubjects();
    } catch (err) {
      console.error("Delete subject error:", err);

      if (err.response) {
        if (err.response.status === 401) {
          alert("Unauthorized. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("teacher");
          navigate("/teacher/login");
        } else {
          alert(err.response.data?.message || "Failed to delete subject");
        }
      } else if (err.message !== "No token found") {
        alert("Server not responding");
      }
    }
  };

  return (
    <TeacherLayout>
      <div className="subject-page">
        <div className="subject-card">
          <h2 className="subject-title">Manage Subjects</h2>

          <div className="subject-form">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              <option value="">Select Department</option>
              <option value="BCA">BCA</option>
              <option value="BBA">BBA</option>
              <option value="MCA">MCA</option>
            </select>

            <input
              type="text"
              placeholder="Subject Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <button
              className="add-btn"
              onClick={handleAdd}
              disabled={!name.trim() || !department}
            >
              Add Subject
            </button>
          </div>

          {error && <p className="error-message">{error}</p>}

          <hr className="subject-divider" />

          {loading ? (
            <p className="loading-text">Loading subjects...</p>
          ) : (
            <ul className="subject-list">
              {subjects.length > 0 ? (
                subjects.map((s) => (
                  <li key={s._id} className="subject-item">
                    <div>
                      <span className="subject-name">{s.name}</span>
                      <span className="subject-meta"> ({s.department})</span>
                    </div>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(s._id)}
                    >
                      Delete
                    </button>
                  </li>
                ))
              ) : (
                <p className="empty-text">No subjects found</p>
              )}
            </ul>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
}

export default TeacherSubject;