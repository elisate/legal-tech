import React, { useEffect, useState } from "react";
import coverImg from "./../../assets/blog8-600x398.jpg";
import profileImg from "./../../assets/testimonial3.jpg";
import Notiflix from "notiflix";

function Setting() {
  const [editProfile, setEditProfile] = useState(false);
  const [changePassword, setChangePassword] = useState(false);
  const [otpSent, setOTPSent] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOTP] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userDetails, setUserDetails] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        // Retrieve access token from localStorage
        const storedData = localStorage.getItem("IsLoggedIn");
        const accessToken = JSON.parse(storedData)?.access_token;

        // Fetch all users from the API
        const response = await fetch(
          "https://legal-tech-api.onrender.com/api/v1/user/all",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        const data = await response.json();
        console.log("API Response:", data);

        // Find the user in the API response that matches the stored data
        const loggedInUser = data.clients.find(
          (user) => user.email === JSON.parse(storedData)?.USER.email
        );

        // Set user details in the state
        setUserDetails(loggedInUser);
      } catch (error) {
        console.error("Error fetching user details:", error);
        setError("An error occurred while fetching user details.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  // const handleChangePassword = () => {
  //   setOTPSent(false);
  //   setEmail("");
  //   setOTP("");
  //   setNewPassword("");
  // };

  const handleEditProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      const storedData = localStorage.getItem("IsLoggedIn");
      const accessToken = JSON.parse(storedData)?.access_token;

      const formData = new FormData();
      formData.append("name", e.target?.name?.value || "");
      formData.append("email", e.target?.email?.value || "");
      formData.append("phone", e.target?.phone?.value || "");
      formData.append("photo", e.target?.photo?.value || "");
      formData.append("nationalId", e.target?.nationalID?.value || "");
      formData.append("country", e.target?.country?.value || "");
      formData.append("city", e.target?.city?.value || "");
      formData.append("sector", e.target?.sector?.value || "");
      formData.append("cell", e.target?.cell?.value || "");
      formData.append("documents", e.target?.documents?.value || "");
      formData.append("lawyerType", e.target?.lawyerType?.value || "");
      // ... add other fields accordingly

      const response = await fetch(
        "https://legal-tech-api.onrender.com/api/v1/user/verifyProfile",
        {
          method: "POST", // Change to POST
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: formData, // Use FormData for multipart/form-data
        }
      );

      const updatedData = await response.json();
      console.log("Updated Profile Response:", updatedData);
      Notiflix.Notify.success("Profile Updated Successfully");
      // Close the edit profile modal after submission
      setEditProfile(false);
    } catch (error) {
      console.error("Error updating user profile:", error);
      Notiflix.Notify.error("Profile Update Failure");
    }
  };

  const handleSendOTP = async () => {
    try {
      const response = await fetch(
        "https://legal-tech-api.onrender.com/api/v1/user/forgotPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      if (response.ok) {
        setOTPSent(true);
        Notiflix.Notify.success("OTP sent successfully to your email.");

        setOTPSent(true);
      } else {
        Notiflix.Notify.failure("Failed to send OTP. Please try again.");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      Notiflix.Notify.failure("An error occurred. Please try again.");
    }
  };

  const handleChangePassword = async () => {
    try {
      const response = await fetch(
        "https://legal-tech-api.onrender.com/api/v1/user/resetPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, otp, newPassword }),
        }
      );

      if (response.ok) {
        Notiflix.Notify.success("Password changed successfully.");
        setChangePassword(false);

        setOTPSent(false);
        setEmail("");
        setOTP("");
        setNewPassword("");
      } else {
        Notiflix.Notify.failure("Failed to change password. Please try again.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      Notiflix.Notify.failure("An error occurred. Please try again.");
    }
  };

  return (
    <div className="lawyer">
      <div className="setting-container">
        <div className="vrow">
          {userDetails && (
            <div className="profile col-12 vrow">
              <div className="cover-img col-12">
                <img src={coverImg} alt="Cover Image" />
              </div>
              <div className="profile-img">
                <img src={profileImg} alt="Profile Picture" />
                <div className="file upload">
                  Change Photo
                  <input type="file" name="file" />
                </div>
              </div>
              <div className="row col-12">
                <div className="user-detail col-8">
                  <h4>
                    {userDetails?.name || "Metre Carine"} <span>lawyer</span>
                  </h4>
                  <p className="bio">
                    A highly experienced attorney who provides clients with
                    personalized legal advice and representation. This dedicated
                    and skilled advocate is passionate about helping clients
                    achieve their legal goals.
                  </p>
                  <div className="row user-contact">
                    <span className="id">
                      National Id:{" "}
                      <i>{userDetails?.nationalID || "1192924848"}</i>
                    </span>
                    <span>
                      Email Address:{" "}
                      <i>{userDetails?.email || "carine@gmail.com"}</i>
                    </span>
                  </div>
                  <p className="user-contact row location">
                    <span className="id">
                      Phone Number: <i>{userDetails?.phone || "078888888"}</i>
                    </span>
                    <span>
                      Category:{" "}
                      <i>{userDetails?.lawyerType || "Familyy Lawyer"}</i>
                    </span>
                  </p>
                </div>
                <div className="col4 user-doc vrow">
                  <h5>My documents</h5>
                  <div className="doc">
                    <img src={userDetails?.photo}></img>
                    {userDetails?.photo || "photo 1"}
                  </div>
                  <div className="doc">
                    <img src={userDetails?.photo}></img>
                    {userDetails?.documents || "Document1"}
                  </div>
                </div>
              </div>
              <div className="profile-action row">
                <button
                  className="btn btn-primary"
                  onClick={() => setEditProfile(true)}
                >
                  Edit Profile
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setChangePassword(true)}
                >
                  change password
                </button>
                <button className="btn btn-tertiary">about me</button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* edit profile modal */}
      {editProfile && userDetails && (
        <div className="edit-profile-overlay">
          <div className="modal">
            <div className="edit-profile">
              <span className="close" onClick={() => setEditProfile(false)}>
                X
              </span>
              <h4>edit your profile</h4>
              <form onSubmit={handleEditProfileSubmit}>
                <div className="row">
                  <div className="input">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      defaultValue={userDetails.name || ""}
                    />
                  </div>
                  <div className="input">
                    <label>Email</label>
                    <input
                      type="email"
                      name="email"
                      defaultValue={userDetails.email || ""}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="input">
                    <label>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      defaultValue={userDetails.phone || ""}
                    />
                  </div>
                  <div className="input">
                    <label>National ID</label>
                    <input
                      type="text"
                      name="nationalID"
                      defaultValue={userDetails.nationalID || ""}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="input">
                    <label>Lawyer Type</label>
                    <input
                      type="text"
                      name="lawyerType"
                      defaultValue={userDetails.lawyerType || "[undefined]"}
                    />
                  </div>
                  <div className="input">
                    <label>Documents</label>
                    <input
                      type="file"
                      name="documents"
                      multiple
                      defaultValue={userDetails?.documents}
                    />
                  </div>
                </div>
                <button type="submit">Save Changes</button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* change password */}
      {changePassword && (
        <div className="edit-profile-overlay">
          <div className="modal">
            <span className="close" onClick={() => setChangePassword(false)}>
              X
            </span>
            <div className="change-password">
              {!otpSent && (
                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    defaultValue={userDetails.email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button onClick={handleSendOTP}>Send OTP</button>
                </div>
              )}

              {otpSent && (
                <div>
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    defaultValue={userDetails.email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label>OTP</label>
                  <input
                    type="text"
                    name="otp"
                    value={otp}
                    onChange={(e) => setOTP(e.target.value)}
                  />

                  <label>New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />

                  <button onClick={handleChangePassword}>
                    Change Password
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Setting;
