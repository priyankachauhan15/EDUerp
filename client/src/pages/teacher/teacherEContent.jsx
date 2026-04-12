import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TeacherLayout from "../../components/TeacherLayout";
import "./Econtent.css";

function TeacherEContent() {
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [file, setFile] = useState(null);
  const [data, setData] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const getAuthConfig = (isMultipart = false) => {
    const token = localStorage.getItem("token");
    const teacher = localStorage.getItem("teacher");

    if (!token || !teacher) {
      localStorage.removeItem("token");
      localStorage.removeItem("teacher");
      navigate("/teacher/login");
      throw new Error("No valid teacher session found");
    }

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    if (isMultipart) {
      headers["Content-Type"] = "multipart/form-data";
    }

    return { headers };
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const config = getAuthConfig();
      const res = await axios.get("https://eduerp-y7bk.onrender.com/api/econtent", config);

      setData(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch e-content error:", err);

      if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("teacher");
        navigate("/teacher/login");
      } else if (err.message !== "No valid teacher session found") {
        setError(err.response?.data?.message || "Failed to fetch files");
      }

      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpload = async () => {
    if (!title.trim() || !department || !file) {
      alert("Fill all fields");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("department", department);
    formData.append("file", file);

    try {
      setError("");

      const config = getAuthConfig(true);

      await axios.post(
        "https://eduerp-y7bk.onrender.com/api/econtent/upload",
        formData,
        config
      );

      alert("Uploaded Successfully");

      setTitle("");
      setDepartment("");
      setFile(null);

      fetchData();
    } catch (err) {
      console.error("Upload error:", err);

      if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("teacher");
        navigate("/teacher/login");
      } else {
        alert(err.response?.data?.message || "Upload failed");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const config = getAuthConfig();

      await axios.delete(`https://eduerp-y7bk.onrender.com/api/econtent/${id}`, config);
      fetchData();
    } catch (err) {
      console.error("Delete error:", err);

      if (err.response?.status === 401) {
        setError("Unauthorized. Please login again.");
        localStorage.removeItem("token");
        localStorage.removeItem("teacher");
        navigate("/teacher/login");
      } else {
        alert(err.response?.data?.message || "Delete failed");
      }
    }
  };

  return (
    <TeacherLayout>
      <div className="econtent-container">
        <div className="econtent-card">
          <h2>Upload E-Content</h2>

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

          <input
            type="text"
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
          />

          <button onClick={handleUpload}>Upload File</button>

          <hr />

          <h3>Uploaded Files</h3>

          {loading ? (
            <p>Loading files...</p>
          ) : data.length > 0 ? (
            data.map((item) => (
              <div key={item._id} className="file-item">
                <p>
                  {item.title} ({item.department})
                </p>

                <a
                  href={`https://eduerp-y7bk.onrender.com/uploads/${item.file}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  View
                </a>

                <button onClick={() => handleDelete(item._id)}>Delete</button>
              </div>
            ))
          ) : (
            <p>No files uploaded</p>
          )}
        </div>
      </div>
    </TeacherLayout>
  );
}

export default TeacherEContent;