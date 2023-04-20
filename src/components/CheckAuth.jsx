import React from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import axios from "../axios";
import { login } from "../redux/slices/authSlice";

function CheckAuth() {
  const dispatch = useDispatch();

  React.useState(() => {
    if (window.localStorage.getItem("token")) {
      axios.get("/auth/me").then((res) => {
        dispatch(login(res.data));
      });
    }
  });

  if (!window.localStorage.getItem("token")) {
    return <Navigate to="/login" />;
  }
  return <div>CheckAuth</div>;
}

export default CheckAuth;
