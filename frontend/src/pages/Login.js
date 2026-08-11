import { useState } from "react"
import axios from "axios"
import {
  Link,
  useNavigate
} from "react-router-dom"

function Login() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  })

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData
      )

      localStorage.setItem(
        "token",
        res.data.token
      )

      localStorage.setItem(
        "user",
        JSON.stringify(res.data.user)
      )

      alert("Login Successful")

      navigate("/home")
    } catch (error) {
      alert("Invalid Credentials")
    }
  }

  return (
    <div className="login-page">
      <div className="overlay">
        <div className="form-container">
          <h1 className="main-title">
            🧪 Arogya 24×7
          </h1>

          <h2>Login</h2>

          <form onSubmit={handleSubmit}>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              onChange={handleChange}
              required
            />

            <button type="submit">
              Login
            </button>
          </form>

          <div className="switch-text">

            <p>Don't have an account?</p>

           <button
              onClick={() => navigate("/register")}
            >
           Create New Account
          </button>

        </div>
        </div>
      </div>
    </div>
  )
}

export default Login