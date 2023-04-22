import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { toastOption } from "../utils/toast";
import { toast } from "react-toastify";
import axios from "../axios";

import styled from "styled-components";
import { login } from "../redux/slices/authSlice";

function ChangeLogin() {
  const userData = useSelector((store) => store.auth.data);
  const [loginField, setLoginField] = React.useState("");
  const dispatch = useDispatch();

  React.useEffect(() => {
    if (userData?.login) {
      setLoginField(userData.login);
    }
  }, [userData]);

  const validateLogin = () => {
    if (loginField.length < 3) {
      toast.error("Длина логина должна быть больше 3 символов", toastOption);
      return false;
    }
    if (loginField === userData?.login) {
      return false;
    }
    return true;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    if (validateLogin()) {
      axios.patch("/auth/change/login", { login: loginField }).then((res) => {
        dispatch(login(res.data));
      });
    }
  };
  return (
    <Container>
      <form onSubmit={(e) => submitHandler(e)}>
        <h3>Сменить логин</h3>
        <div className="content">
          <input
            type="text"
            value={loginField}
            placeholder="Ваш логин"
            onChange={(e) => setLoginField(e.target.value)}
          />
          <button type="submit">Сменить</button>
        </div>
      </form>
    </Container>
  );
}

const Container = styled.div`
  h3 {
    font-size: 1rem;
  }
  .content {
    padding-top: 0.5rem;
    display: flex;
    gap: 0.5rem;
    button {
      cursor: pointer;
      padding: 0.5rem;
      font-size: 0.8rem;
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
    input {
      width: 200px;
      padding: 0.5rem;
      border: 0.1rem solid rgb(163, 159, 220);
      outline: none;
      &:hover {
        border: 0.1rem solid #7b74d5;
      }
    }
  }
`;

export default ChangeLogin;
