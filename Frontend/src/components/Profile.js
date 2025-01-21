import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { FaUser, FaEnvelope } from "react-icons/fa"; // Import relevant icons
import { selectUser, updateUserDetails } from "../redux/userReducer"; // Assuming updateUserDetails action

export default function Profile() {
  const dispatch = useDispatch();
  const { user } = useSelector(selectUser); // Adjust the selector to your user state

  // Initialize states with user data
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [isEditing, setIsEditing] = useState(false);  // State to toggle editing mode

  // Handle form submission (updating user info)
  const handleSubmit = async (e) => {
    e.preventDefault();  // Prevent form submission to handle the logic ourselves

    const updatedUserData = {
      firstName,
      lastName,
      email: user.email, // Email remains unchanged
    };

    // Dispatch the updated user details to Redux (or API call to server)
    try {
      await dispatch(updateUserDetails(updatedUserData)).unwrap();
      setIsEditing(false);  // After successful update, disable editing mode
    }
    catch (err) {
      console.log("Error while updating the user", err);
    }
  };

  // Handle cancel editing (reset to initial state)
  const handleCancel = () => {
    setFirstName(user.firstName);
    setLastName(user.lastName);
    setIsEditing(false);  // Return to non-editable state
  };

  // Prevent form submission when clicking the Edit button
  const handleEditClick = (e) => {
    e.preventDefault(); // Prevent any unintended form submission
    setIsEditing(true);  // Enable editing
  };

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center">
      <div className="card border-0" style={{ maxWidth: "600px", width: "100%" }}>
        {isEditing ? <h3 className="text-center mb-3 special-font">Updating My Details</h3> : <h3 className="text-center mb-3 special-font">My Profile</h3>}
        <form className="d-flex flex-column" onSubmit={handleSubmit}>
          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <label htmlFor="first-name" className="text-dark fs-5 d-flex align-items-center">
                <FaUser className="me-2" /> {/* User icon */}
                First Name
              </label>
              <div className="input-group">
                <input
                  id="first-name"
                  type="text"
                  className="form-control"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  disabled={!isEditing}  // Enable field if editing, disable if not
                  required
                />
              </div>
            </div>
            <div className="col-12 col-md-6">
              <label htmlFor="last-name" className="text-dark fs-5 d-flex align-items-center">
                <FaUser className="me-2" /> {/* User icon */}
                Last Name
              </label>
              <div className="input-group">
                <input
                  id="last-name"
                  type="text"
                  className="form-control"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  disabled={!isEditing}  // Enable field if editing, disable if not
                  required
                />
              </div>
            </div>
          </div>

          <div className="row mb-3">
            <div className="col-12 col-md-6">
              <label htmlFor="email" className="text-dark fs-5 d-flex align-items-center">
                <FaEnvelope className="me-2" /> {/* Envelope icon */}
                Email Address
              </label>
              <div className="input-group">
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  placeholder="Enter email"
                  value={user.email}
                  disabled={true}  // Email is always disabled
                  required
                />
              </div>
            </div>
          </div>

          <div className="d-flex justify-content-between">
            {isEditing ? (
              <>
                <button type="submit" className="btn btn-success text-white fs-4 rounded-3">
                  Update
                </button>
                <button type="button" className="btn btn-secondary text-white fs-4 rounded-3" onClick={handleCancel}>
                  Cancel
                </button>
              </>
            ) : (
              <button
                type="button"  // Use type="button" to prevent form submission
                className="btn btn-primary text-white fs-4 rounded-3"
                onClick={handleEditClick}  // Handle Edit click and prevent form submission
              >
                Edit
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
