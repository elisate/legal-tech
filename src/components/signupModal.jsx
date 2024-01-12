import React, { useState } from "react";
import "../style/sign.scss";
import axios from "axios";
import { useForm } from "react-hook-form";
import { Notify } from "notiflix";

import "./Lawyers1.scss";
import { Label } from "@mui/icons-material";
const signupModal = ({ onClose }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  console.log(errors);

  const onsubmit = async (data) => {
    console.log(data);

    const { userType, name, email, password, confirmPassword } = data;

    try {
      const formData = new FormData();
      formData.append("userType", userType);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);

      const res = await axios.post(
        "https://legal-tech-api.onrender.com/api/v1/user/signup",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            //   Authorization: `Bearer ${auth.access_token}`,
          },
        }
      );
      Notify.success("sign up successfuly");
      if (res.data) {
        console.log("sign up submitted", res.data);
      }
      setTimeout(() => {
        window.location.reload();
      }, 3000);

      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="overlay1">
      <div className="modal1">
        <div className="modal-content1">
          <h2>Signup</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime
            debitis,
          </p>
          <hr />
          <form onSubmit={handleSubmit(onsubmit)}>
            <div className="row">
              <div className="form-group col-6">
                <label htmlFor="name">Full Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  {...register("name", { required: true })}
                />
              </div>

              <div className="form-group col-6">
                <select
                  id="userType"
                  name="userType"
                  {...register("userType", { required: true })}
                >
                  <option d>Select User Type</option>
                  <option value="individual">Individual</option>
                  <option value="organization">Organization</option>
                </select>
              </div>
            </div>

            <div className="row">
              <div className="form-group col-6">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  {...register("email", { required: true })}
                />
              </div>
              <div className="form-group col-6">
                <label htmlFor="phone">Phone Number:</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  {...register("phone", { required: true })}
                />
              </div>
            </div>

            <div className="row">
              <div className="form-group col-6">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  {...register("password", { required: true })}
                />
              </div>
              <div className="form-group col-6">
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  {...register("confirmPassword", { required: true })}
                />
              </div>
            </div>

            <div className="signup-btn1">
              <a href="/client">
                <button type="submit" className="btn">
                  Signup
                </button>
              </a>
              <button className="button" onClick={onClose}>
                cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default signupModal;
