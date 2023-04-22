import React from "react";
import { useDispatch } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import axios from "../axios";
import { login } from "../redux/slices/authSlice";

import styled from "styled-components";
import Profile from "./Profile";
import Header from "./Header";

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
  return (
    <Container>
      <div className="header-block">
        <Header />
      </div>
      <div className="content-block">
        <Routes>
          <Route path="/" element={<Profile />} />
        </Routes>
      </div>
    </Container>
  );
}

const Container = styled.div`
  width: 95vw;
  height: 95vh;
  background-color: #fff;
  border-radius: 25px;
  -webkit-box-shadow: 6px 8px 8px 0px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 6px 8px 8px 0px rgba(34, 60, 80, 0.2);
  box-shadow: 6px 8px 8px 0px rgba(34, 60, 80, 0.2);
  padding: 1rem;
  display: flex;
  .content-block {
    flex: 1 1 auto;
  }
`;

export default CheckAuth;
