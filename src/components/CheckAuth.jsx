import React from "react";
import { useDispatch } from "react-redux";
import { Navigate, Route, Routes } from "react-router-dom";
import axios from "../axios";
import { login } from "../redux/slices/authSlice";

import { io } from "socket.io-client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styled from "styled-components";
import Profile from "./Profile";
import Header from "./Header";
import PLaylist from "./PLaylist";
import RoomsList from "./RoomsList";
import Room from "./Room";

function CheckAuth() {
  const dispatch = useDispatch();
  const socket = React.useRef();

  React.useState(() => {
    if (window.localStorage.getItem("token")) {
      axios.get("/auth/me").then((res) => {
        dispatch(login(res.data));
      });
      socket.current = io("http://localhost:8000");
    }
  });

  if (!window.localStorage.getItem("token")) {
    return <Navigate to="/login" />;
  }
  return (
    <>
      <Container>
        <div className="header-block">
          <Header />
        </div>
        <div className="content-block">
          <Routes>
            <Route path="/" element={<Profile />} />
            <Route path="playlist" element={<PLaylist />} />
            <Route path="rooms" element={<RoomsList />} />
            <Route path="rooms/:id" element={<Room socket={socket} />} />
          </Routes>
        </div>
      </Container>
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  width: 95vw;
  height: 95vh;
  position: relative;
  overflow-y: scroll;
  background-color: #fff;
  border-radius: 25px;
  -webkit-box-shadow: 6px 8px 8px 0px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 6px 8px 8px 0px rgba(34, 60, 80, 0.2);
  box-shadow: 6px 8px 8px 0px rgba(34, 60, 80, 0.2);
  padding: 1rem;
  display: flex;
  &::-webkit-scrollbar {
    width: 4px;
    border-radius: 25px;
    &-thumb {
      width: 1px;
      border-radius: 25px;
      background: rgb(106, 99, 212);
      background: linear-gradient(
        111 90deg,
        rgba(106, 99, 212, 1) 0%,
        rgba(186, 236, 194, 1) 0%,
        rgba(105, 216, 238, 1) 100%
      );
    }
  }
  .header-block {
    flex: 0 0 180px;
  }
  .content-block {
    flex: 1 1 auto;
  }
`;

export default CheckAuth;
