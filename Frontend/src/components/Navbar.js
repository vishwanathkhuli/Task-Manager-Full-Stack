import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser, userActions } from "../redux/userReducer";
import { FaSignOutAlt, FaTasks } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Navbar.css";

export default function Navbar() {
  const { user } = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Generate the first letter of the user's first name
  const generateInitial = (firstName) => {
    return `${firstName?.charAt(0) ?? ""}`.toUpperCase();
  };

  const handleLogout = () => {
    dispatch(userActions.logoutUser());
    navigate("/signin");
    collapseNavbar();
  };

  const handleProfileClick = () => {
    navigate("/profile");
    collapseNavbar();
  };

  const handleDashboardClick = () => {
    navigate("/dashboard");
    collapseNavbar();
  };

  const collapseNavbar = () => {
    const navbarCollapse = document.getElementById("navbarNav");
    if (navbarCollapse && navbarCollapse.classList.contains("show")) {
      navbarCollapse.classList.remove("show");
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light fonts shadow-sm fixed-top"
      style={{ zIndex: 1050 }}
    >
      <div className="container-fluid">
        {/* Navbar Brand */}
        <span
          className="navbar-brand d-flex align-items-center cursor-pointer"
          onClick={() => navigate('/')}
          style={{ fontWeight: "bold", fontSize: "1.5rem" }}
        >
          <FaTasks
            className="me-2"
            style={{ color: "rgb(0, 104, 74)", fontSize: "1rem" }}
          />
          <h3 className="text-center mb-1 special-font">Task Manager</h3>
        </span>
        {/* Navbar Toggle Button */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        {/* Navbar Menu */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul
            className="navbar-nav ms-auto align-items-center"
            style={{ display: "flex", alignItems: "center" }}
          >
            {user ? (
              <>
                {/* Dashboard Button */}
                <li>
                  <button
                    className="btn btn-outline-primary bg-primary me-2 p-2 fs-6"
                    onClick={handleDashboardClick}
                    style={{ fontSize: "1rem" }}
                  >
                    <MdDashboard className="me-2" /> Dashboard
                  </button>
                </li>
                {/* User Profile */}
                <li className="nav-item">
                  <button
                    className="btn btn-outline-success bg-success me-2 p-2 fs-6"
                    style={{
                      width: "50px",
                      height: "45px",
                      fontSize: "1rem",
                      borderRadius: "12px",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={handleProfileClick}
                  >
                    {user.profileImage ? (
                      <img
                        src={user.profileImage}
                        alt="Profile"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "12px",
                        }}
                      />
                    ) : (
                      generateInitial(user.firstName)
                    )}
                  </button>
                  {user.profileImage && (
                    <span className="ms-2 text-dark fs-5">{user.firstName}</span>
                  )}
                </li>
                {/* Logout Button */}
                <li className="nav-item">
                  <button
                    className="btn btn-outline-red bg-danger me-2 p-2 fs-6"
                    onClick={handleLogout}
                    style={{ fontSize: "1rem" }}
                  >
                    <FaSignOutAlt className="me-2" /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                {/* Register Button */}
                <li className="nav-item">
                  <button
                    className="btn btn-outline-success bg-success me-2 p-2 fs-6"
                    onClick={() => {
                      navigate("/signup");
                      collapseNavbar();
                    }}
                  >
                    Register
                  </button>
                </li>
                {/* Login Button */}
                <li className="nav-item">
                  <button
                    className="btn btn-outline-success bg-success me-2 p-2 fs-6"
                    onClick={() => {
                      navigate("/signin");
                      collapseNavbar();
                    }}
                  >
                    Login
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
