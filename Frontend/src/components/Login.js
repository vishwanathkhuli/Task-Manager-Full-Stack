import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/userReducer";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const dispatch = useDispatch();

  const toRegister = () => {
    navigate("/signup");
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

    const userData = {
      email: email,
      password: password,
    };
    try {
      await dispatch(loginUser(userData)).unwrap();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        navigate('/dashboard');
      }, 2000);
    }
    catch (err) {
      console.log("There is an error with logging in");
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center fonts">
      <div className="card p-4 border-0" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-3 special-font">Log in to your account</h3>
        <div className="mb-5 d-flex justify-content-center align-items-center">
          <span className="text-dark fs-6">Don't have an account? </span>
          <span
            className="text-primary fs-6 cursor-pointer ms-2"
            onClick={toRegister}
          >
            Sign Up
          </span>
        </div>
        {loading && <p className="text-info text-center">Loading...</p>}
        {success && <p className="text-success text-center">Login successful! Redirecting...</p>}
        <form onSubmit={handleSubmit} className="d-flex flex-column">
          <div className="mb-3">
            <label htmlFor="user-email" className="text-dark fs-5 d-flex align-items-center">
              <FaEnvelope className="me-2" />
              Email Address
            </label>
            <input
              id="user-email"
              type="email"
              className="form-control custom-input"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-danger fs-6">{errors.email}</p>}
          </div>
          <div className="mb-3">
            <label htmlFor="user-pass" className="text-dark fs-5 d-flex align-items-center">
              <FaLock className="me-2" />
              Password
            </label>
            <div className="input-group">
              <input
                id="user-pass"
                type={passwordVisible ? "text" : "password"}
                className="form-control custom-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && <p className="text-danger fs-6">{errors.password}</p>}
          </div>
          <button type="submit" className="btn btn-success w-40 mx-auto text-white fs-5 rounded-3 mt-3">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
