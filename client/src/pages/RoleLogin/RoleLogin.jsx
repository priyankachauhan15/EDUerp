import { useNavigate } from "react-router-dom"
import "./RoleLogin.css"

function RoleLogin() {
  const navigate = useNavigate()

  const handleLogin = (role) => {
    navigate(`/${role}/login`)
  }

  return (
    <div className="role-container">
      <h1>EduERP Login</h1>

      <div className="role-box">
        <button onClick={() => handleLogin("teacher")}>
          Login as Teacher
        </button>

        <button onClick={() => handleLogin("student")}>
          Login as Student
        </button>
      </div>
    </div>
  )
}

export default RoleLogin