import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StudentLayout from "../../components/StudentLayout";
import "./Profile.css";

function Profile() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser =
      localStorage.getItem("user") || localStorage.getItem("student");

    try {
      if (!storedUser || storedUser === "undefined") {
        setUser(null);
        return;
      }

      const parsedUser = JSON.parse(storedUser);
      console.log("User Data:", parsedUser);
      setUser(parsedUser);
    } catch (error) {
      console.error("Profile parse error:", error);
      localStorage.removeItem("user");
      localStorage.removeItem("student");
      setUser(null);
    }
  }, []);

  if (!user) {
    return (
      <StudentLayout>
        <h2 style={{ padding: "20px" }}>No Profile Data Found</h2>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="profile-page">
        <h1>My Profile</h1>

        <div className="profile-card">
          <div className="profile-grid">
            <p><b>Name:</b> {user.name || "-"}</p>
            <p><b>Father Name:</b> {user.fatherName || "-"}</p>

            <p><b>Mobile Number:</b> {user.mobileNumber || user.mobile || "-"}</p>
            <p><b>Father Number:</b> {user.fatherNumber || user.fatherMobile || "-"}</p>

            <p><b>Email:</b> {user.email || "-"}</p>
            <p><b>GR Number:</b> {user.grNumber || "-"}</p>

            <p><b>Enrollment Number:</b> {user.enrollment || "-"}</p>
            <p><b>Department:</b> {user.department || "-"}</p>

            <p><b>Birth Date:</b> {user.birthDate || user.dob || "-"}</p>
            <p><b>City:</b> {user.city || "-"}</p>

            <p><b>State:</b> {user.state || "-"}</p>
            <p><b>Country:</b> {user.country || "-"}</p>

            <p><b>Address:</b> {user.address || "-"}</p>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
}

export default Profile;