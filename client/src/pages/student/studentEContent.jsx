import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../components/StudentLayout";

function StudentEContent() {
  const [data, setData] = useState([]);
  const [department, setDepartment] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const fetchData = async (dept, token) => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(
        `http://localhost:5000/api/econtent?department=${dept}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch e-content error:", err);

      if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("student");
        navigate("/student/login");
      } else {
        setError(err.response?.data?.message || "Failed to load e-content");
      }

      setData([]);
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

      if (!user?.department) {
        setLoading(false);
        setError("Department not found. Please login again.");
        navigate("/student/login");
        return;
      }

      setDepartment(user.department);
      fetchData(user.department, token);
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
        <h1>E-Content</h1>
        <h3>Department: {department || "Not Available"}</h3>

        {loading && <p>Loading content...</p>}

        {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

        {!loading && !error && data.length > 0 ? (
          data.map((item) => (
            <div
              key={item._id}
              style={{
                marginBottom: "15px",
                padding: "15px",
                border: "1px solid #ddd",
                borderRadius: "8px",
                backgroundColor: "#f9f9f9",
              }}
            >
              <h3>{item.title}</h3>

              <a
                href={`http://localhost:5000/uploads/${item.file}`}
                download
                style={{
                  display: "inline-block",
                  marginTop: "8px",
                  padding: "8px 12px",
                  backgroundColor: "#007bff",
                  color: "#fff",
                  textDecoration: "none",
                  borderRadius: "5px",
                }}
              >
                Download File
              </a>
            </div>
          ))
        ) : !loading && !error ? (
          <p>No content available</p>
        ) : null}
      </div>
    </StudentLayout>
  );
}

export default StudentEContent;