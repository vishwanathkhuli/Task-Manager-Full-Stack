import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectUser, userActions } from "../redux/userReducer";
import { FaSignOutAlt, FaTasks } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import ConfirmationModal from "./ConfirmationModal";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "./Navbar.css";

export default function Navbar() {
  const { user } = useSelector(selectUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const buttonRef = useRef(null); // Ref for menu button

  const generateInitial = (firstName) => {
    return `${firstName?.charAt(0) ?? ""}`.toUpperCase();
  };

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    dispatch(userActions.logoutUser());
    navigate("/signin");
    setShowLogoutModal(false);
  };

  const handleCloseLogoutModal = () => {
    setShowLogoutModal(false);
  };

  // Toggle menu function
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  // Close menu when clicking outside (ignores menu button)
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target) // Ignore menu button clicks
      ) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light fonts shadow-sm fixed-top" style={{ zIndex: 1050 }}>
      <div className="container-fluid">
        <span className="navbar-brand d-flex align-items-center cursor-pointer"
          onClick={() => navigate('/')}
          style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
          <FaTasks className="me-2" style={{ color: "rgb(0, 104, 74)", fontSize: "1rem" }} />
          <h3 className="text-center mb-1 special-font">Task Manager</h3>
        </span>

        {/* Menu Button */}
        <button className="navbar-toggler" type="button" onClick={toggleMenu} ref={buttonRef}>
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`} id="navbarNav" ref={menuRef}>
          <ul className="navbar-nav ms-auto align-items-center">
            {user ? (
              <>
                <li>
                  <button className="btn btn-outline-primary bg-primary me-2 p-2 fs-6"
                    onClick={() => { navigate("/dashboard"); setMenuOpen(false); }}
                    style={{ fontSize: "1rem" }}>
                    <MdDashboard className="me-2" /> Dashboard
                  </button>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-success bg-success me-2 p-2 fs-6"
                    style={{ width: "50px", height: "45px", fontSize: "1rem", borderRadius: "12px" }}
                    onClick={() => { navigate("/profile"); setMenuOpen(false); }}>
                    {user.profileImage ? (
                      <img src={user.profileImage} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "12px" }} />
                    ) : (
                      generateInitial(user.firstName)
                    )}
                  </button>
                  {user.profileImage && <span className="ms-2 text-dark fs-5">{user.firstName}</span>}
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-danger bg-danger me-2 p-2 fs-6"
                    onClick={() => { handleLogoutClick(); setMenuOpen(false); }}
                    style={{ fontSize: "1rem" }}>
                    <FaSignOutAlt className="me-2" /> Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <button className="btn btn-outline-success bg-success me-2 p-2 fs-6"
                    onClick={() => { navigate("/signup"); setMenuOpen(false); }}>
                    Register
                  </button>
                </li>
                <li className="nav-item">
                  <button className="btn btn-outline-success bg-success me-2 p-2 fs-6"
                    onClick={() => { navigate("/signin"); setMenuOpen(false); }}>
                    Login
                  </button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      {showLogoutModal && (
        <ConfirmationModal
          show={showLogoutModal}
          onClose={handleCloseLogoutModal}
          onConfirm={handleConfirmLogout}
          heading="Logout"
          message="Are you sure you want to log out?"
          suggestions="After logout you will be redirected to login page"
          confirmLabel="Logout"
          cancelLabel="Cancel"
        />
      )}
    </nav>
  );
}
