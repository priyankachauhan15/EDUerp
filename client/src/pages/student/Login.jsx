import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [enrollment, setEnrollment] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (enrollment.length !== 11 || isNaN(enrollment)) {
      alert("Enrollment must be 11 digits");
      return;
    }

    if (!password.trim()) {
      alert("Password is required");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          enrollment,
          password,
        }
      );

      localStorage.removeItem("teacher");
      localStorage.removeItem("student");

      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user || res.data.student)
      );

      navigate("/student/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="login-container">
      <h2>Student Login</h2>

      <input
        type="text"
        placeholder="Enrollment Number"
        value={enrollment}
        onChange={(e) => setEnrollment(e.target.value)}
        maxLength={11}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>
        Login
      </button>

      <p className="register-text">
        New Student? <Link to="/student/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;