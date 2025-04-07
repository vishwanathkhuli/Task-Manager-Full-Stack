import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { registerUser } from "../redux/userReducer";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaCheckCircle,
  FaKey,
} from "react-icons/fa";
import { notificationActions } from "../redux/notificationReducer";
import apiClient from "../api/api";
import { FcGoogle } from "react-icons/fc";

export default function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({ firstName: "", lastName: "", email: "", password: "" });
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const toLogin = useCallback(() => navigate("/signin"), [navigate]);

  const handleInputChange = ({ target: { name, value } }) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === "email") {
      setErrors((prev) => ({ ...prev, email: undefined }));
      setOtpSent(false);
      setOtpVerified(false);
      setOtp("");
    }
  };

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible((prev) => !prev);
  }, []);

  const validateForm = useCallback(() => {
    const { firstName, lastName, email, password } = formData;
    const newErrors = {};

    if (!firstName.trim()) newErrors.firstName = "First name is required.";
    if (!lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Enter a valid email address.";

    if (password.length < 8) newErrors.password = "Password must be at least 8 characters long.";
    else if (!/[A-Z]/.test(password)) newErrors.password = "Include at least one uppercase letter.";
    else if (!/[a-z]/.test(password)) newErrors.password = "Include at least one lowercase letter.";
    else if (!/[!@#$%^&*]/.test(password)) newErrors.password = "Include a special character (!@#$%^&*).";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const notify = (message, status) =>
    dispatch(notificationActions.setNotification({ message, status }));

  const handleSendOtp = async () => {
    if (!validateForm()) return;
    setLoading(true);
    notify("Sending OTP...", "loading");

    try {
      const response = await apiClient.get(`/api/otp/send?email=${encodeURIComponent(formData.email)}`);
      if (response.status === 200) {
        setOtpSent(true);
        notify("OTP sent successfully!", "success");
      }
    } catch (error) {
      setErrors({ email: error.response?.data?.message || "Failed to send OTP." });
      notify("Failed to send OTP.", "error");
    }
    setLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) return setErrors({ otp: "OTP is required." });

    setLoading(true);
    notify("Verifying OTP...", "loading");

    try {
      const response = await apiClient.get(`/api/otp/verify?email=${encodeURIComponent(formData.email)}&otp=${otp}`);
      if (response.status === 200) {
        setOtpVerified(true);
        notify("OTP verified successfully!", "success");
      }
    } catch (error) {
      setErrors({ otp: error.response?.data?.message || "Invalid OTP." });
      notify("OTP verification failed.", "error");
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    if (!otpVerified) return setErrors({ general: "OTP verification is required!" });

    setLoading(true);
    notify("Registering user...", "loading");

    try {
      await dispatch(registerUser(formData)).unwrap();
      notify("Registration successful!", "success");
      navigate("/signin");
    } catch (error) {
      const msg = error?.response?.data || "Registration failed.";
      setErrors({ general: msg });
      notify(msg, "error");
    }
    setLoading(false);
  };

  const handleGoogleLogin = (e) => {
    e.preventDefault();
    const redirectURL = process.env.REACT_APP_BACKEND_URL || "http://localhost:8080";
    window.location.href = `${redirectURL}/oauth2/authorization/google`;
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center">
      <div className="card p-4 border-0" style={{ maxWidth: "600px", width: "100%" }}>
        <h3 className="text-center mb-2 special-font">Create your account</h3>

        <div className="mb-2 d-flex justify-content-center align-items-center">
          <span className="text-dark fs-6">Already have an account?</span>
          <span className="text-primary fs-6 cursor-pointer ms-2" onClick={toLogin}>Sign In</span>
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
          <div className="flex-grow-1 border-top"></div>
          <span className="text-muted fs-6">or</span>
          <div className="flex-grow-1 border-top"></div>
        </div>
        <form onSubmit={handleSubmit} className="d-flex flex-column">
          <div className="row mb-3">
            {["firstName", "lastName"].map((field, i) => (
              <div className="col-12 col-md-6" key={field}>
                <label htmlFor={field} className="text-dark fs-5 d-flex align-items-center">
                  <FaUser className="me-2" /> {field === "firstName" ? "First Name" : "Last Name"}
                </label>
                <input
                  id={field}
                  type="text"
                  name={field}
                  className="form-control"
                  placeholder={`Enter ${field === "firstName" ? "first" : "last"} name`}
                  value={formData[field]}
                  onChange={handleInputChange}
                />
                {errors[field] && <p className="text-danger fs-6">{errors[field]}</p>}
              </div>
            ))}
          </div>

          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <label htmlFor="email" className="text-dark fs-5 d-flex align-items-center">
                <FaEnvelope className="me-2" /> Email Address
              </label>
              <div className="input-group">
                <input
                  id="email"
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                <button
                  type="button"
                  className={`btn ${otpSent ? "btn-success" : "btn-primary"}`}
                  onClick={handleSendOtp}
                  disabled={loading}
                >
                  {otpSent ? <FaCheckCircle /> : "Send OTP"}
                </button>
              </div>
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
                  name="password"
                  className="form-control"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleInputChange}
                />
                <span
                  className="input-group-text"
                  onClick={togglePasswordVisibility}
                  style={{ cursor: "pointer" }}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              {errors.password && <p className="text-danger fs-6">{errors.password}</p>}
            </div>
          </div>

          {otpSent && !otpVerified && (
            <div className="mb-3">
              <label className="text-dark fs-5 d-flex align-items-center">
                <FaKey className="me-2" /> Enter OTP
              </label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <button type="button" className="btn btn-primary" onClick={handleVerifyOtp} disabled={loading}>
                  Verify OTP
                </button>
              </div>
              {errors.otp && <p className="text-danger fs-6">{errors.otp}</p>}
            </div>
          )}

          {errors.general && <p className="text-danger text-center">{errors.general}</p>}

          <button
            type="submit"
            className="btn btn-success w-40 m-auto fs-6 rounded-3 mt-3"
            disabled={!otpVerified || loading}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}