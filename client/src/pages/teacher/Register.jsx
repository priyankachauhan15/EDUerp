import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {

  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    mobile: "",
    email: "",
    department: "",
    qualification: "",
    address: "",
    joinDate: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("FORM DATA:", form); // 🔍 DEBUG

      const res = await axios.post(
        "https://eduerp-y7bk.onrender.com/api/teacher/register",
        form
      );

      console.log("RESPONSE:", res.data); // 🔍 DEBUG

      alert("Employee Code: " + res.data.empCode);

      // 🔥 clear form (optional)
      setForm({
        name: "",
        mobile: "",
        email: "",
        department: "",
        qualification: "",
        address: "",
        joinDate: "",
        password: ""
      });

      navigate("/teacher/login");

    } catch (err) {
      console.log("REGISTER ERROR:", err.response?.data); // 🔍 DEBUG
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="register-container">
      <h2>Teacher Registration</h2>

      <form onSubmit={handleSubmit}>

        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="mobile"
          placeholder="Mobile"
          value={form.mobile}
          onChange={handleChange}
          required
        />

        <input
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <select
          name="department"
          value={form.department}
          onChange={handleChange}
          required
        >
          <option value="">Select Department</option>
          <option>BCA</option>
          <option>BBA</option>
          <option>MCA</option>
          <option>DIPLOMA</option>
        </select>

        <select
          name="qualification"
          value={form.qualification}
          onChange={handleChange}
          required
        >
          <option value="">Select Qualification</option>
          <option>BCA</option>
          <option>MCA</option>
          <option>MBA</option>
        </select>

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="joinDate"
          value={form.joinDate}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <button type="submit">Register</button>
      </form>

      <p>
        Already have account? <Link to="/teacher/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;