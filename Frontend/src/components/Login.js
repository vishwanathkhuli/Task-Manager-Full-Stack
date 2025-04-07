import { useNavigate } from "react-router-dom";
import { useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/userReducer";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";

export default function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [emailVisible, setEmailVisible] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const toggleVisibility = useCallback((field) => {
    if (field === "password") {
      setPasswordVisible((prev) => !prev);
    } else {
      setEmailVisible((prev) => !prev);
    }
  }, []);

  const validateForm = useCallback(() => {
    const { email, password } = formData;
    const newErrors = {};

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else {
      if (!/[A-Z]/.test(password)) newErrors.password = "Must contain at least one uppercase letter.";
      else if (!/[a-z]/.test(password)) newErrors.password = "Must contain at least one lowercase letter.";
      else if (!/[!@#$%^&*]/.test(password)) newErrors.password = "Must contain at least one special character (!@#$%^&*).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await dispatch(loginUser(formData)).unwrap();
      navigate("/dashboard");
    } catch {
      setErrors((prev) => ({ ...prev, general: "Login failed. Check credentials." }));
    }
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    const redirectURL = process.env.REACT_APP_BACKEND_URL;
    window.location.href = `${redirectURL}/oauth2/authorization/google`;
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center fonts">
      <div className="card p-4 border-0" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-2 special-font">Log in to your account</h3>

        <div className="mb-2 d-flex justify-content-center align-items-center">
          <span className="text-dark fs-6">Don't have an account?</span>
          <span className="text-primary fs-6 cursor-pointer ms-2" onClick={() => navigate("/signup")}>
            Sign Up
          </span>
        </div>

        <div className="m-auto">
          <button
            type="button"
            className="btn btn-light m-1 d-flex align-items-center justify-content-center border"
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="me-2" size={20} />
            Continue with Google
          </button>
        </div>

        <div className="d-flex align-items-center m-2">
          <div className="flex-grow-1 border-top me-2"></div>
          <span className="text-muted fs-6">OR</span>
          <div className="flex-grow-1 border-top ms-2"></div>
        </div>

        <form onSubmit={handleSubmit} className="d-flex flex-column">
          {/* Email Input */}
          <div className="mb-3">
            <label htmlFor="user-email" className="text-dark fs-5 d-flex align-items-center">
              <FaEnvelope className="me-2" />
              Email Address
            </label>
            <div className="input-group">
              <input
                id="user-email"
                name="email"
                type={emailVisible ? "text" : "email"}
                className="form-control custom-input"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            {errors.email && <p className="text-danger fs-6">{errors.email}</p>}
          </div>

          {/* Password Input */}
          <div className="mb-3">
            <label htmlFor="user-pass" className="text-dark fs-5 d-flex align-items-center">
              <FaLock className="me-2" />
              Password
            </label>
            <div className="input-group">
              <input
                id="user-pass"
                name="password"
                type={passwordVisible ? "text" : "password"}
                className="form-control custom-input"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
              />
              <span
                className="input-group-text"
                onClick={() => toggleVisibility("password")}
                style={{ cursor: "pointer" }}
              >
                {passwordVisible ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            {errors.password && <p className="text-danger fs-6">{errors.password}</p>}
          </div>

          {/* Forgot Password */}
          <div className="d-flex align-items-center">
            <span className="text-primary fs-6 ms-1 cursor-pointer" onClick={() => navigate("/reset-password")}>
              Forgot Password?
            </span>
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-success w-40 m-auto text-white fs-6 rounded-3 mt-3">
            Login
          </button>

          {/* General Error */}
          {errors.general && <p className="text-danger text-center mt-2">{errors.general}</p>}
        </form>
      </div>
    </div>
  );
}
