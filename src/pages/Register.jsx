import React from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import axios from "../axios";

import { toastOption } from "../utils/toast";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import styled from "styled-components";
import { useDispatch } from "react-redux";
import { login } from "../redux/slices/authSlice";

function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fields, setFields] = React.useState({
    email: "",
    login: "",
    password: "",
    confirmpassword: "",
  });

  const validateFields = () => {
    if (fields.email === "") {
      toast.error("Вы не ввели ваш e-mail", toastOption);
      return false;
    }
    if (fields.login.length < 3) {
      toast.error("Логин должен быть больше 3 символов", toastOption);
      return false;
    }
    if (fields.password < 8) {
      toast.error(
        "Длина вашего пароля должна быть больше 8 символов",
        toastOption
      );
      return false;
    }
    if (fields.password !== fields.confirmpassword) {
      toast.error("Кажется введенные вами пароли не совпадают", toastOption);
      return false;
    }
    return true;
  };

  const inputChangeHandler = (e) => {
    setFields((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const submitFormHandler = (e) => {
    e.preventDefault();
    if (validateFields()) {
      axios
        .post("/auth/register", {
          email: fields.email,
          login: fields.login,
          password: fields.password,
        })
        .then((res) => {
          console.log(res);
          dispatch(login(res.data.user));
          window.localStorage.setItem("token", res.data.token);
          navigate("/");
        })
        .catch((err) => {
          toast.error(err.response.data.msg, toastOption);
        });
    }
  };

  if (window.localStorage.getItem("token")) {
    return <Navigate to="/" />;
  }

  return (
    <>
      <Container>
        <h1>Регистрация</h1>
        <div className="form">
          <form onSubmit={(e) => submitFormHandler(e)}>
            <div className="form-input">
              <input
                type="email"
                placeholder="E-mail"
                name="email"
                onChange={(e) => inputChangeHandler(e)}
              />
            </div>
            <div className="form-input">
              <input
                type="text"
                placeholder="Логин"
                name="login"
                onChange={(e) => inputChangeHandler(e)}
              />
            </div>
            <div className="form-input">
              <input
                type="password"
                placeholder="Введите пароль"
                autoComplete="off"
                name="password"
                onChange={(e) => inputChangeHandler(e)}
              />
            </div>
            <div className="form-input">
              <input
                type="password"
                name="confirmpassword"
                autoComplete="off"
                placeholder="Введите пароль повторно"
                onChange={(e) => inputChangeHandler(e)}
              />
            </div>
            <button type="submit">Зарегестрироваться</button>
            <Link to="/login">У меня есть аккаунт</Link>
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

export default Register;
