import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./singlelawyer.scss";
import axios from "axios";


const SingleLawyer = () => {
  const location = useLocation();

  const [lawyerData, setLawyerData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "https://legal-tech-api.onrender.com/api/v1/user/all",
          {
            params: {
              role: "lawyer",
            },
          }
        );

        console.log("data in single lawyer page: ", response.data);

        const filteredLawyerRows = response.data.clients.filter(
          (user) => user.role === "lawyer"
        );
        console.log("single data", filteredLawyerRows);
        setLawyerData(filteredLawyerRows);
      } catch (error) {
        console.error("Error fetching lawyer data:", error);
      }
    };

    fetchData();
  }, []);

  const _id = useParams();
  const userId = _id._id;
  const selectedLawyer = lawyerData?.find((item) => item._id === _id._id);

  console.log(selectedLawyer, lawyerData, _id);

  const { name, documents, photo, nationalID } = lawyerData;
  const handleApprove = async () => {
    try {
      let auth = JSON.parse(localStorage.getItem("IsLoggedIn"));
      const headers = {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${auth?.access_token}`,
      };
      const response = await axios.post(
        `https://legal-tech-api.onrender.com/api/v1/user/verifyProfile`,
        {
          isLawyer: true,
        },
        { headers }
      );

      console.log("Request:", response.request);

      console.log("Approval response:", response.data);
    } catch (error) {
      console.error(
        "Error approving lawyer:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <div className="singleLawyer">
      <div className="singleContainer">
        <div className="top">
          <div className="rights">
            <div className="case-details">
              <h2 className="case-title">Lawyer Details</h2>

              <div className="desc-1">Name: {selectedLawyer?.name}</div>
              <div className="desc-1">Date: {selectedLawyer?.date}</div>
              <div className="desc-1">
                National ID: {selectedLawyer?.nationalID}
              </div>
              <div className="desc-1">Photos: {selectedLawyer?.photo}</div>
              <div className="desc-1">Status: {selectedLawyer?.isLawyer}</div>
              <div className="case-title">
                Documents: {selectedLawyer?.documents}
              </div>
              <button onClick={handleApprove}>Approve</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleLawyer;
