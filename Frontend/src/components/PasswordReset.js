import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import apiClient from "../api/api";
import { notificationActions } from "../redux/notificationReducer";
import { useDispatch } from "react-redux";

export default function PasswordReset() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = useCallback(() => {
    setPasswordVisible((prev) => !prev);
  }, []);

  const toggleConfirmPasswordVisibility = useCallback(() => {
    setConfirmPasswordVisible((prev) => !prev);
  }, []);

  const toLogin = useCallback(() => {
    navigate("/signin");
  }, [navigate]);

  const validateEmail = useCallback(() => {
    const newErrors = {};
    if (!email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Enter a valid email address.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [email]);

  const handleVerifyEmail = async () => {
    if (!validateEmail()) return;
    setLoading(true);
    dispatch(notificationActions.setNotification({ message: "Verifying email...", status: "loading" }));

    try {
      const response = await apiClient.get(`/user/verify/${encodeURIComponent(email)}`);
      const data = await response.data;
      if (response.status === 200) {
        setEmailVerified(true);
        dispatch(notificationActions.setNotification({ message: data, status: "success" }));
      }
    } catch (error) {
      setErrors({ email: error.response?.data?.message || "Email verification failed. User not found." });
      dispatch(notificationActions.setNotification({ message: "Email verification failed", status: "error" }));
    }
    setLoading(false);
  };

  const validatePasswords = useCallback(() => {
    const newErrors = {};
    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long.";
    } else if (!/[A-Z]/.test(password)) {
      newErrors.password = "Password must contain at least one uppercase letter.";
    } else if (!/[a-z]/.test(password)) {
      newErrors.password = "Password must contain at least one lowercase letter.";
    } else if (!/[!@#$%^&*]/.test(password)) {
      newErrors.password = "Password must contain at least one special character (!@#$%^&*).";
    }

    if (confirmPassword !== password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [password, confirmPassword]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePasswords()) return;
    setLoading(true);
    dispatch(notificationActions.setNotification({ message: "Resetting password...", status: "loading" }));

    try {
      await apiClient.post("/user/reset-password", { email, password });
      dispatch(notificationActions.setNotification({ message: "Password reset successful", status: "success" }));
      navigate("/signin");
    } catch (error) {
      setErrors({ general: error.response?.data?.message || "Failed to reset password. Please try again." });
      dispatch(notificationActions.setNotification({ message: "Password reset failed", status: "error" }));
    }
    setLoading(false);
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center fonts">
      <div className="card p-4 border-0" style={{ maxWidth: "400px", width: "100%" }}>
        <h3 className="text-center mb-3 special-font">Reset Your Password</h3>
        <form onSubmit={handleSubmit} className="d-flex flex-column">
          <div className="mb-3">
            <label className="text-dark fs-5 d-flex align-items-center">
              <FaEnvelope className="me-2" /> Email Address
            </label>
            <div className="input-group">
              <input type="email" className="form-control custom-input" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={emailVerified} />
              <button
                type="button"
                className={`btn ${emailVerified ? "btn-success" : "btn-primary"}`}
                onClick={handleVerifyEmail}
                disabled={emailVerified || loading}
              >
                {emailVerified ? <FaCheckCircle /> : "Verify"}
              </button>

            </div>
            {errors.email && <p className="text-danger fs-6">{errors.email}</p>}
          </div>
          {emailVerified && (
            <>
              <div className="mb-3">
                <label className="text-dark fs-5 d-flex align-items-center">
                  <FaLock className="me-2" /> Password
                </label>
                <div className="input-group">
                  <input type={passwordVisible ? "text" : "password"} className="form-control" placeholder="Enter password" value={password} onChange={(e) => setPassword(e.target.value)} />
                  <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: "pointer" }}>
                    {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.password && <p className="text-danger fs-6">{errors.password}</p>}
              </div>
              <div className="mb-3">
                <label className="text-dark fs-5 d-flex align-items-center">
                  <FaLock className="me-2" /> Confirm Password
                </label>
                <div className="input-group">
                  <input type={confirmPasswordVisible ? "text" : "password"} className="form-control" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  <span className="input-group-text" onClick={toggleConfirmPasswordVisibility} style={{ cursor: "pointer" }}>
                    {confirmPasswordVisible ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>
                {errors.confirmPassword && <p className="text-danger fs-6">{errors.confirmPassword}</p>}
              </div>
              <button type="submit" className="btn btn-success w-40 m-auto text-white fs-5 rounded-3 mt-3" disabled={loading}>{loading ? "Processing..." : "Reset Password"}</button>
            </>
          )}
        </form>
        <div className="mt-3 d-flex align-items-center fs-6">
          <FaArrowLeft className="me-2 cursor-pointer" onClick={toLogin} />
          <span className="text-primary cursor-pointer" onClick={toLogin}>Back to Login</span>
        </div>
      </div>
    </div>
  );
}
