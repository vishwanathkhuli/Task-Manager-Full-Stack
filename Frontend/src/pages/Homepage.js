import React from "react";
import { SiTask } from "react-icons/si";
import { useNavigate } from "react-router-dom";

export default function Homepage() {
  const navigate = useNavigate();
  return (
    <>
      <div
        className="container-fluid d-flex align-items-center justify-content-between main"
        style={{
          height: "calc(100vh - 70px)",
          padding: "20px",
        }}
      >
        {/* Left Side */}
        <div className="left-side" style={{ maxWidth: "50%", padding: "20px" }}>
          <h1 style={{ fontWeight: "bold", fontSize: "3rem", color: "#007B5E" }}>
            Organize your work and life, finally.
          </h1>
          <p style={{ fontSize: "1.2rem", color: "#555" }}>
            Simplify life for both you and your team with the world’s #1 task
            manager and to-do list app.
          </p>
          <button
            style={{
              backgroundColor: "#007B5E",
              color: "#fff",
              border: "none",
              padding: "10px 20px",
              fontSize: "1rem",
              borderRadius: "5px",
              cursor: "pointer",
              marginTop: "20px",
            }}
            onClick={() => navigate('/dashboard')}
          >
            Get Started
          </button>
        </div>

        {/* Right Side */}
        <div
          className="right-side d-flex align-items-center justify-content-center"
          style={{
            maxWidth: "50%",
            textAlign: "center",
            padding: "20px",
          }}
        >
          <SiTask style={{ fontSize: "10rem", color: "#007B5E" }} />

        </div>
      </div>
    </>
  );
}
