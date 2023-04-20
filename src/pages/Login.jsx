import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "../axios";

import { toastOption } from "../utils/toast";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styled from "styled-components";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/authSlice";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fields, setFields] = React.useState({
    email: "",
    password: "",
  });

  const validateFields = () => {
    if (fields.email === "") {
      toast.error("Введите email", toastOption);
      return false;
    }
    if (fields.password === "") {
      toast.error("Введите пароль", toastOption);
      return false;
    }
    return true;
  };

  const submitFormHandler = (e) => {
    e.preventDefault();
    if (validateFields()) {
      axios
        .post("/auth/login", fields)
        .then((res) => {
          dispatch(login(res.data.user));
          window.localStorage.setItem("token", res.data.token);
          navigate("/");
        })
        .catch((err) => {
          toast.error(err.response.data.msg, toastOption);
        });
    }
  };

  const inputChangeHandler = (e) => {
    setFields((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  if (window.localStorage.getItem("token")) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Container>
        <h1>Вход</h1>
        <div className="form">
          <form onSubmit={(e) => submitFormHandler(e)}>
            <div className="form-input">
              <input
                type="email"
                name="email"
                onChange={(e) => inputChangeHandler(e)}
                placeholder="Введите ваш email"
              />
            </div>
            <div className="form-input">
              <input
                type="password"
                name="password"
                onChange={(e) => inputChangeHandler(e)}
                placeholder="Введите пароль"
              />
            </div>
            <button type="submit">Войти</button>
            <Link to="/register">Еще нет аккаунта?</Link>
          </form>
        </div>
      </Container>
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  max-width: 400px;
  width: 100%;
  height: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: #fff;
  border-radius: 25px;
  -webkit-box-shadow: 6px 8px 8px 0px rgba(34, 60, 80, 0.2);
  -moz-box-shadow: 6px 8px 8px 0px rgba(34, 60, 80, 0.2);
  box-shadow: 6px 8px 8px 0px rgba(34, 60, 80, 0.2);
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    font-weight: 600;
  }

  .form {
    padding: 1.5rem 0;
    width: 100%;
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      a {
        text-decoration: none;
        color: #00000076;
        text-transform: uppercase;
        font-weight: bold;
        font-size: 0.8rem;
      }
      button {
        cursor: pointer;
        padding: 1rem;
        border: none;
        outline: none;
        background: rgb(106, 99, 212);
        background: linear-gradient(
          90deg,
          rgba(106, 99, 212, 1) 0%,
          rgba(186, 236, 194, 1) 0%,
          rgba(105, 216, 238, 1) 100%
        );
        color: #283e3f;
        text-transform: uppercase;
        font-weight: bold;
        border-radius: 10px;
      }
    }
  }
  .form-input {
    input {
      width: 100%;
      padding: 1rem;
      border: 0.1rem solid rgb(163, 159, 220);
      outline: none;
      &:hover {
        border: 0.1rem solid #7b74d5;
      }
    }
  }
`;

export default Login;
