import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [empCode, setEmpCode] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};

    if (!empCode.trim()) {
      newErrors.empCode = "Employee Code is required";
    } else if (empCode.length < 4) {
      newErrors.empCode = "Employee Code must be at least 4 characters";
    }

    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 5) {
      newErrors.password = "Password must be at least 5 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    try {
     const res = await axios.post(
  "https://eduerp-y7bk.onrender.com/api/teacher/login",
  { empCode, password }
);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem(
        "teacher",
        JSON.stringify(res.data.teacher || res.data.user)
      );

      navigate("/teacher/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Teacher Login</h2>

        <input
          placeholder="Employee Code"
          value={empCode}
          onChange={(e) => setEmpCode(e.target.value)}
        />
        {errors.empCode && <p className="error">{errors.empCode}</p>}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <button onClick={handleLogin}>Login</button>

        <p className="register-text">
          New Teacher? <Link to="/teacher/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;