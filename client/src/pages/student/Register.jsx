import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    fatherName: "",
    mobileNumber: "",
    email: "",
    fatherNumber: "",
    department: "",
    address: "",
    birthDate: "",
    city: "",
    state: "",
    country: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "https://eduerp-y7bk.onrender.com/api/auth/register",
        form
      );

      console.log("full response", res.data);

      const enrollment =
        res.data?.enrollment ||
        res.data?.user?.enrollment ||
        res.data?.newUser?.enrollment;

      const grNumber =
        res.data?.grNumber ||
        res.data?.user?.grNumber ||
        res.data?.newUser?.grNumber;

      if (enrollment && grNumber) {
        alert(
          "Registration Successful\n\n" +
          "Enrollment Number: " + enrollment +
          "\nGR Number: " + grNumber
        );
      } else {
        alert(
          "Registration successful, but Enrollment Number / GR Number was not returned by backend."
        );
      }

      navigate("/student/login");
    } catch (err) {
      console.error("Register error:", err);
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  return (
    <div className="register-container">
      <h2>Student Registration</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          name="fatherName"
          placeholder="Father Name"
          value={form.fatherName}
          onChange={handleChange}
          required
        />

        <input
          name="mobileNumber"
          placeholder="Mobile Number"
          value={form.mobileNumber}
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

        <input
          name="fatherNumber"
          placeholder="Father Number"
          value={form.fatherNumber}
          onChange={handleChange}
          required
        />

        <select
          name="department"
          value={form.department}
          onChange={handleChange}
          required
        >
          <option value="">Select department</option>
          <option value="BCA">BCA</option>
          <option value="BBA">BBA</option>
          <option value="MCA">MCA</option>
          <option value="DIPLOMA">DIPLOMA</option>
          <option value="COMPUTER ENGINEER">COMPUTER ENGINEER</option>
          <option value="MECHANICAL">MECHANICAL</option>
          <option value="CHEMICAL">CHEMICAL</option>
          <option value="CIVIL">CIVIL</option>
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
          name="birthDate"
          value={form.birthDate}
          onChange={handleChange}
          required
        />

        <input
          name="city"
          placeholder="City"
          value={form.city}
          onChange={handleChange}
          required
        />

        <input
          name="state"
          placeholder="State"
          value={form.state}
          onChange={handleChange}
          required
        />

        <input
          name="country"
          placeholder="Country"
          value={form.country}
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
    </div>
  );
}

export default Register;