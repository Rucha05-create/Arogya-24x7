import { useState } from "react"
import axios from "axios"
import {
  Link,
  useNavigate
} from "react-router-dom"

function Register() {
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    email: "",
    password: "",
    role: "customer"
  })

  const handleChange = e => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value
    })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    try {
      await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      )

      alert(
        "Registration Successful"
      )

      navigate("/")
    }

    catch (error) {
      alert(
        "Registration Failed"
      )
    }
  }

  return (
    <div className="login-page">

      <div className="overlay">

        <div className="form-container">

          <h1 className="main-title">
            🧪 Arogya 24×7
          </h1>

          <h2>
            Create Account
          </h2>

          <form onSubmit={handleSubmit}>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="number"
              name="age"
              placeholder="Age"
              value={formData.age}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="gender"
              placeholder="Gender"
              value={formData.gender}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >

              <option value="customer">
                Customer
              </option>

              <option value="health_worker">
                Health Worker
              </option>

              <option value="intern">
                Intern
              </option>

              <option value="volunteer">
                Volunteer
              </option>

              <option value="sahash_employee">
                SAHASH Employee
              </option>

              <option value="vendor">
                Vendor Lab
              </option>

            </select>
            <select
              name="role"

              value={
                formData.role
              }

              onChange={
               handleChange
              }

             required>

             <option
               value="customer">

               Customer
             </option>

              <option
               value="health_worker">
                Health Worker
             </option>

              <option
                value="intern">
                Intern
             </option>

              <option
                value="volunteer">
                Volunteer
             </option>

              <option
                value="sahash_employee">
                SAHASH Employee
              </option>

              <option
                value="vendor">
                Vendor Lab
             </option>
           </select>

            <button type="submit">
              Create Account
            </button>

          </form>

          <div className="switch-text">
          <p>
            Already have an account?
         </p>
         <button
           type="button"
           onClick={() => navigate("/login")}
          >
          Login
         </button>
       </div>

        </div>

      </div>

    </div>
  )
}

export default Register