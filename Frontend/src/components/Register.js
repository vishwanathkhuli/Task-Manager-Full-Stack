import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../redux/userReducer";
import { useDispatch } from "react-redux";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const toLogin = () => {
    navigate("/signin");
  };

  const validatePassword = (password) => {
    const errors = {};
    if (password.length < 8) {
      errors.password = "Password must be at least 8 characters long.";
    } else if (!/[A-Z]/.test(password)) {
      errors.password = "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(password)) {
      errors.password = "Password must contain at least one lowercase letter.";
    } else if (!/[!@#$%^&*]/.test(password)) {
      errors.password = "Password must contain at least one special character (!@#$%^&*).";
    }
    return errors;
  };

  const validateForm = () => {
    const newErrors = {};
    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }
    const passwordErrors = validatePassword(password);
    if (Object.keys(passwordErrors).length > 0) {
      newErrors.password = passwordErrors.password;
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setSuccess(false);

    const userData = { firstName, lastName, email, password };
    try {
      await dispatch(registerUser(userData)).unwrap();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate("/signin");
      }, 2000);
    } catch (error) {
      console.log("There is an error with the register");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center">
      <div className="card p-4 border-0" style={{ maxWidth: "600px", width: "100%" }}>
        <h3 className="text-center mb-3 special-font">Create your account</h3>
        <div className="mb-5 d-flex justify-content-center align-items-center">
          <span className="text-dark fs-6">Already have an account?</span>
          <span className="text-primary fs-6 cursor-pointer ms-2" onClick={toLogin}>
            Sign In
          </span>
        </div>
        {loading && <p className="text-info text-center">Registering...</p>}
        {success && <p className="text-success text-center">Registration successful! Redirecting...</p>}
        <form onSubmit={handleSubmit} className="d-flex flex-column">

          {/* First Name & Last Name */}
          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <label htmlFor="first-name" className="text-dark fs-5 d-flex align-items-center">
                <FaUser className="me-2" /> First Name
              </label>
              <input
                id="first-name"
                type="text"
                className="form-control"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
              {errors.firstName && <p className="text-danger fs-6">{errors.firstName}</p>}
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="last-name" className="text-dark fs-5 d-flex align-items-center">
                <FaUser className="me-2" /> Last Name
              </label>
              <input
                id="last-name"
                type="text"
                className="form-control"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
              {errors.lastName && <p className="text-danger fs-6">{errors.lastName}</p>}
            </div>
          </div>

          {/* Email & Password */}
          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <label htmlFor="email" className="text-dark fs-5 d-flex align-items-center">
                <FaEnvelope className="me-2" /> Email Address
              </label>
              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && <p className="text-danger fs-6">{errors.email}</p>}
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="password" className="text-dark fs-5 d-flex align-items-center">
                <FaLock className="me-2" /> Password
              </label>
              <div className="input-group">
                <input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  className="form-control"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: "pointer" }}>
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && <p className="text-danger fs-6">{errors.password}</p>}
            </div>
          </div>

          <button type="submit" className="btn btn-success w-40 m-auto fs-5 rounded-3 mt-3">Register</button>
        </form>
      </div>
    </div>
  );
}
