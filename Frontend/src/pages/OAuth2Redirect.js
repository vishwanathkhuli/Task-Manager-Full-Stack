import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { userActions } from "../redux/userReducer";
import apiClient from "../api/api";

const OAuth2Redirect = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const token = new URLSearchParams(window.location.search).get("token");

    const fetchUserProfile = async () => {
      try {
        // Set token in localStorage
        localStorage.setItem("token", token);

        // Fetch user profile
        const response = await apiClient.get("/user/profile");
        const user = response.data;

        // Dispatch user to Redux
        dispatch(userActions.setUser(user));

        // Redirect to dashboard
        navigate("/dashboard");
      } catch (error) {
        console.error("OAuth redirect error:", error);
        navigate("/signin?error=oauth_failed");
      }
    };

    if (token) {
      fetchUserProfile();
    } else {
      navigate("/signin?error=oauth_failed");
    }
  }, [dispatch, navigate]);

  return <p>Redirecting...</p>;
};

export default OAuth2Redirect;
