import React from "react";
import axios from "../axios";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";

import addIcon from "../assets/add.png";
import removeIcon from "../assets/remove.png";
import { login } from "../redux/slices/authSlice";

function ChangeGenre() {
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.auth.data);
  const [userGenre, setUserGenre] = React.useState([]);
  const [allGenre, setAllGenre] = React.useState([]);

  const genreNotAdded = allGenre.filter((item) => {
    return userGenre.indexOf(item) === -1;
  });

  React.useEffect(() => {
    if (userData?.likedGenre) {
      setUserGenre(userData.likedGenre);
    }
  }, [userData]);

  React.useEffect(() => {
    axios.get("/track/genre").then((res) => {
      setAllGenre(res.data);
    });
  }, []);

  const addGenreHandler = (genre) => {
    axios.patch("/auth/genre", { genre }).then((res) => {
      setAllGenre(allGenre.filter((item) => item !== genre));
      dispatch(login(res.data));
    });
  };

  const removeGenreHandler = (genre) => {
    axios.delete(`/auth/genre/${genre}`).then((res) => {
      dispatch(login(res.data));
      setAllGenre((prev) => [genre, ...prev]);
    });
  };

  return (
    <Container>
      <h3>Добавьте любимые жанры</h3>
      <div className="content">
        {genreNotAdded.map((item, index) => (
          <button
            key={index}
            className="genre"
            onClick={() => addGenreHandler(item)}
          >
            <p>{item}</p>
            <img src={addIcon} alt="" />
          </button>
        ))}
      </div>
      <div className="added-genre">
        <h3>Добавленные жанры</h3>
        <div className="content">
          {userGenre.map((item, index) => (
            <button
              key={index}
              className="genre"
              onClick={() => removeGenreHandler(item)}
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
    height: 14rem;
    overflow-y: scroll;
  }
  .genre {
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
  .added-genre {
    margin-top: 1rem;
  }
`;

export default ChangeGenre;
