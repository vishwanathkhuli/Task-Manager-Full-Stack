import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../redux/userReducer";
import { useDispatch } from "react-redux";
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const dispatch = useDispatch();

  const toLogin = () => {
    navigate("/signin");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = { firstName, lastName, email, password };
    try {
      await dispatch(registerUser(userData)).unwrap();
      navigate("/signin");
    } catch (error) {
      console.log("There is an error with the register");
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
        <form onSubmit={handleSubmit} className="d-flex flex-column">
          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <label htmlFor="first-name" className="text-dark fs-5 d-flex align-items-center">
                <FaUser className="me-2" /> First Name
              </label>
              <div className="input-group">
                <input
                  id="first-name"
                  type="text"
                  className="form-control"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="last-name" className="text-dark fs-5 d-flex align-items-center">
                <FaUser className="me-2" /> Last Name
              </label>
              <div className="input-group">
                <input
                  id="last-name"
                  type="text"
                  className="form-control"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>
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
                  className="form-control"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
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
                  required
                />
                <span
                  className="input-group-text"
                  onClick={togglePasswordVisibility}
                  style={{ cursor: "pointer" }}
                >
                  {passwordVisible ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-success px-4 py-2 text-white fs-5 rounded-3 mx-auto mt-3"
            style={{ width: "100%", maxWidth: "150px" }}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
