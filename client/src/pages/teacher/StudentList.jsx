import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TeacherLayout from "../../components/TeacherLayout";
import "./StudentList.css";

function StudentList() {
  const [students, setStudents] = useState([]);
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchStudents = async (selectedDepartment) => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found. Please login again.");
        navigate("/teacher/login");
        return;
      }

      const res = await axios.get(
        `http://localhost:5000/api/students?department=${selectedDepartment}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStudents(res.data);
    } catch (err) {
      console.error("Fetch Students Error:", err);

      if (err.response) {
        if (err.response.status === 401) {
          setError("Unauthorized. Please login again.");
          localStorage.removeItem("token");
          localStorage.removeItem("teacher");
          navigate("/teacher/login");
        } else if (err.response.status === 400) {
          setError(err.response.data.message || "Bad request.");
        } else {
          setError(err.response.data.message || "Something went wrong.");
        }
      } else {
        setError("Server not responding.");
      }

      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (department) {
      fetchStudents(department);
    }
  }, [department]);

  return (
    <TeacherLayout>
      <div className="student-list-page">
        <h1>Student List</h1>

        <select
          className="stream-select"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
        >
          <option value="">Select Department</option>
          <option value="BCA">BCA</option>
          <option value="BBA">BBA</option>
          <option value="MCA">MCA</option>
        </select>

        {loading && <p>Loading students...</p>}
        {error && <p className="error-message">{error}</p>}

        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Department</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4">Loading students...</td>
              </tr>
            ) : students.length > 0 ? (
              students.map((s, index) => (
                <tr key={s._id}>
                  <td>{index + 1}</td>
                  <td>{s.name}</td>
                  <td>{s.department}</td>
                  <td>{s.email}</td>
                </tr>
              ))
            ) : department ? (
              <tr>
                <td colSpan="4">No Students Found</td>
              </tr>
            ) : (
              <tr>
                <td colSpan="4">Please select a department</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </TeacherLayout>
  );
}

export default StudentList;