import { useNavigate } from "react-router-dom";
import TeacherLayout from "../../components/TeacherLayout";
import "./Dashboard.css";

function Dashboard() {

  const navigate = useNavigate();

  return (

    <TeacherLayout>

      <h1>Teacher Dashboard</h1>

      <div className="cards">

        {/* Students */}
        <div
          className="card"
          onClick={() => navigate("/teacher/students")}
          style={{ cursor: "pointer" }}
        >
          <h3>Students</h3>
          <h3>List</h3>
          <p>View all students</p>
        </div>

        {/* Subjects */}
        <div
          className="card"
          onClick={() => navigate("/teacher/subject")}
          style={{ cursor: "pointer" }}
        >
          <h3>Subjects</h3>
          <p>Manage subjects</p>
        </div>

        {/* Attendance */}
        <div
          className="card"
          onClick={() => navigate("/teacher/attendance")}
          style={{ cursor: "pointer" }}
        >
          <h3>Upload</h3>
          <h3>Attendance</h3>
          <p>Mark student attendance</p>
        </div>

        {/* Study Material */}
        <div
          className="card"
          onClick={() => navigate("/teacher/econtent")}
          style={{ cursor: "pointer" }}
        >
          <h3>Upload</h3>
          <h3>Study Materials</h3>
          <p>Add notes & PDFs</p>
        </div>

      </div>

    </TeacherLayout>
  );
}

export default Dashboard;