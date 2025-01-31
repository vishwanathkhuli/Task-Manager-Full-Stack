import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNotification, notificationActions } from "../redux/notificationReducer";
import "bootstrap/dist/css/bootstrap.min.css";

export default function NotificationModel() {
  const { message, status } = useSelector(useNotification);
  const dispatch = useDispatch();
  const [visibleMessage, setVisibleMessage] = useState("");

  useEffect(() => {
    if (message) {
      setVisibleMessage(message);

      const timer = setTimeout(() => {
        setVisibleMessage(""); // Clear UI
        dispatch(notificationActions.clearNotification()); // Clear Redux
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  if (!visibleMessage) return null;

  return (
    <div
      className="position-fixed start-50 translate-middle-x"
      style={{
        top: "10px", // Positions it at the top
        left: "50%", // Centers horizontally
        transform: "translate(-50%, 0)", // Ensures proper centering
        zIndex: 1050,
        width: "500px",
        maxWidth: "90%", // Prevents overflow on small screens
      }}
    >
      <div
        className={`p-3 mb-2 border rounded shadow-lg text-black ${status === "loading" ? "bg-light" : status === "error" ? "bg-danger bg-opacity-100 text-white" : "bg-success text-white"
          } w-100`}
        style={{
          opacity: visibleMessage ? 1 : 0,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        <div className="d-flex justify-content-between align-items-center">
          <p className="mb-0 fs-5 d-flex align-items-center">
            {status === "loading" && (
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
            )}
            {visibleMessage}
          </p>
          <button
            className="btn-close btn-close-white fs-5"
            onClick={() => {
              dispatch(notificationActions.clearNotification()); // Clear Redux
              setVisibleMessage(""); // Clear UI immediately
            }}
          ></button>
        </div>
      </div>
    </div>
  );
}
