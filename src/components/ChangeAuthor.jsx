import React from "react";
import axios from "../axios";

import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import addIcon from "../assets/add.png";
import removeIcon from "../assets/remove.png";
import { login } from "../redux/slices/authSlice";

function ChangeAuthor() {
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.auth.data);
  const [allAuthor, setAllAuthor] = React.useState([]);
  const [userAuthor, setUserAuthor] = React.useState([]);

  const authorNotAdded = allAuthor.filter((item) => {
    return userAuthor.indexOf(item) === -1;
  });

  React.useEffect(() => {
    if (userData?.likedAuthor) {
      setUserAuthor(userData.likedAuthor);
    }
  }, [userData]);
  React.useEffect(() => {
    axios.get("/track/author").then((res) => {
      setAllAuthor(res.data);
    });
  }, []);

  const addAuthorHandler = (author) => {
    axios.patch("/auth/author", { author }).then((res) => {
      setAllAuthor(allAuthor.filter((item) => item !== author));
      dispatch(login(res.data));
    });
  };

  const removeAuthorHandler = (author) => {
    axios.delete(`/auth/author/${author}`).then((res) => {
      dispatch(login(res.data));
      setAllAuthor((prev) => [author, ...prev]);
    });
  };

  return (
    <Container>
      <h3>Добавьте любимых авторов</h3>
      <div className="content">
        {authorNotAdded.map((item, index) => (
          <button
            key={index}
            className="author"
            onClick={() => addAuthorHandler(item)}
          >
            <p>{item}</p>
            <img src={addIcon} alt="" />
          </button>
        ))}
      </div>
      <div className="added-author">
        <h3>Добавленные авторы</h3>
        <div className="content">
          {userAuthor.map((item, index) => (
            <button
              key={index}
              className="author"
              onClick={() => removeAuthorHandler(item)}
            >
              <p>{item}</p>
              <img src={removeIcon} alt="" />
            </button>
          ))}
        </div>
      </div>
    </Container>
  );
}

const Container = styled.div`
  h3 {
    font-size: 1rem;
  }
  .content {
    margin-top: 1rem;
    display: flex;
    flex-direction: column;
    max-width: 200px;
    gap: 0.5rem;
    max-height: 14rem;
    overflow-y: scroll;
    &::-webkit-scrollbar {
      width: 4px;
      &-thumb {
        width: 1px;
        background: rgb(106, 99, 212);
        background: linear-gradient(
          90deg,
          #a8a6c0 0%,
          #d0edd5 0%,
          #e3f6fa 100%
        );
      }
    }
  }
  .author {
    text-align: left;
    cursor: pointer;
    padding: 0.5rem;
    border: none;
    outline: none;
    background: rgb(106, 99, 212);
    background: linear-gradient(90deg, #a8a6c0 0%, #d0edd5 0%, #e3f6fa 100%);
    color: #3f4967;
    font-weight: bold;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    img {
      height: 2rem;
    }
  }
  .added-author {
    margin-top: 1rem;
  }
`;

export default ChangeAuthor;
