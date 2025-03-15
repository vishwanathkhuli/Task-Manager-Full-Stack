import { useState, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../redux/userReducer"; // ✅ Redux action for registration
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import apiClient from "../api/api";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch(); // ✅ Redux dispatch function
  const apiKey = process.env.REACT_APP_EMAIL_API_KEY;
  const emailCheckTimeout = useRef(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: ""
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [emailValid, setEmailValid] = useState(null);
  const [emailMessage, setEmailMessage] = useState("");

  const toLogin = useCallback(() => navigate("/signin"), [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "email") {
      setEmailValid(null);
      setErrors((prev) => ({ ...prev, email: undefined }));
      setEmailMessage("");

      if (emailCheckTimeout.current) clearTimeout(emailCheckTimeout.current);
      emailCheckTimeout.current = setTimeout(() => {
        isEmailExist(value);
      }, 500);
    }
  };

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible((prev) => !prev);
  }, []);

  const isEmailExist = async (email) => {
    if (!email) return;

    try {
      const response = await apiClient.get(
        `https://apilayer.net/api/check?access_key=${apiKey}&email=${email}&smtp=1&format=1`
      );

      if (!response.data.smtp_check) {
        setErrors((prev) => ({ ...prev, email: " Email does not exist!" }));
        setEmailValid(false);
        setEmailMessage("Email does not exist!");
      } else {
        setEmailValid(true);
        setEmailMessage("Valid email");
      }
    } catch (e) {
      console.log(e);
      setErrors((prev) => ({ ...prev, email: "Failed to verify email!" }));
      setEmailMessage("Failed to verify email!");
    }
  };

  const validateForm = useCallback(() => {
    const { firstName, lastName, email, password } = formData;
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!lastName.trim()) newErrors.lastName = "Last name is required.";

    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }

    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Password must contain at least one lowercase letter.";
    } else if (!/[!@#$%^&*]/.test(password)) {
      newErrors.password = "Password must contain at least one special character (!@#$%^&*).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!emailValid) {
      setErrors((prev) => ({ ...prev, email: "Email verification failed!" }));
      return;
    }

    try {
      await dispatch(registerUser(formData)).unwrap(); // ✅ Dispatch Redux action to register user
      navigate("/signin");
    } catch (error) {
      setErrors({ general: "Registration failed. Please try again." });
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center">
      <div className="card p-4 border-0" style={{ maxWidth: "600px", width: "100%" }}>
        <h3 className="text-center mb-3 special-font">Create your account</h3>

        <div className="mb-4 d-flex justify-content-center align-items-center">
          <span className="text-dark fs-6">Already have an account?</span>
          <span className="text-primary fs-6 cursor-pointer ms-2" onClick={toLogin}>
            Sign In
          </span>
        </div>

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
                name="firstName"
                className="form-control"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleInputChange}
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
                name="lastName"
                className="form-control"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleInputChange}
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
                name="email"
                className="form-control"
                placeholder="Enter email"
                value={formData.email}
                onChange={handleInputChange}
              />
              {emailMessage && (
                <p className={emailValid ? "text-success fs-6" : "text-danger fs-6"}>
                  {emailMessage}
                </p>
              )}
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="password" className="text-dark fs-5 d-flex align-items-center">
                <FaLock className="me-2" /> Password
              </label>
              <div className="input-group">
                <input
                  id="password"
                  type={passwordVisible ? "text" : "password"}
                  name="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: "pointer" }}>
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && <p className="text-danger fs-6">{errors.password}</p>}
            </div>
          </div>

          <button type="submit" className="btn btn-success w-40 m-auto fs-6 rounded-3 mt-3">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
