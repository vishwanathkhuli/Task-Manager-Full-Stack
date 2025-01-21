import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/userReducer";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";  // Import eye icons

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);  // State for visibility toggle
  const dispatch = useDispatch();

  const toRegister = () => {
    navigate("/signup");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      email: email,
      password: password,
    };
    try {
      await dispatch(loginUser(userData)).unwrap();
      navigate('/dashboard');
    }
    catch (err) {
      console.log("There is error with the logging in ");
    }
  };

  // Toggle password visibility
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
        <form onSubmit={handleSubmit} className="d-flex flex-column">
          <div className="mb-3">
            <label htmlFor="user-email" className="text-dark fs-5 d-flex align-items-center">
              <FaEnvelope className="me-2" /> {/* Email icon */}
              Email Address
            </label>
            <input
              id="user-email"
              type="email"
              className="form-control custom-input"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="user-pass" className="text-dark fs-5 d-flex align-items-center">
              <FaLock className="me-2" /> {/* Lock icon */}
              Password
            </label>
            <div className="input-group">
              <input
                id="user-pass"
                type={passwordVisible ? "text" : "password"} // Toggle password visibility
                className="form-control custom-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="input-group-text" onClick={togglePasswordVisibility} style={{ cursor: 'pointer' }}>
                {passwordVisible ? <FaEyeSlash /> : <FaEye />} {/* Eye icon for toggle */}
              </span>
            </div>
          </div>
          <button type="submit" className="btn btn-success w-40 mx-auto text-white fs-5 rounded-3 mt-3">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
