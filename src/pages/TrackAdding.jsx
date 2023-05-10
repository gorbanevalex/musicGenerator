import React from "react";
import styled from "styled-components";
import axios from "../axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOption } from "../utils/toast";
import noTrackPreview from "../assets/noMusicPreview.png";
import { useParams } from "react-router-dom";

function TrackAdding({ edit }) {
  const { id } = useParams();
  const [fields, setFields] = React.useState({
    name: "",
    author: "",
    released: "",
    genre: "",
    isRussian: true,
    previewPicture: "",
    trackUrl: "",
  });
  const previewRef = React.useRef(null);
  const trackRef = React.useRef(null);

  React.useEffect(() => {
    if (edit) {
      axios.get(`/track/${id}`).then((res) => {
        console.log(res.data);
        setFields({
          name: res.data.name,
          author: res.data.author.join(","),
          released: res.data.released,
          genre: res.data.genre.join(","),
          isRussian: res.data.isRussian,
          previewPicture: res.data.previewPicture,
          trackUrl: res.data.trackUrl,
        });
      });
    }
  }, []);

  const validateFieldTrack = () => {
    const { name, author, released, trackUrl } = fields;
    if (name === "") {
      toast.error("Кажется вы забыли ввести название", toastOption);
      return false;
    }
    if (author === "") {
      toast.error("Кажется вы забыли ввести автора", toastOption);
      return false;
    }
    if (released === "") {
      toast.error("Кажется вы забыли ввести год выхода", toastOption);
      return false;
    }
    if (!edit && trackUrl === "") {
      toast.error("Кажется вы забыли загрузить аудио", toastOption);
      return false;
    }
    return true;
  };

  const validateTrackFile = () => {
    if (!edit && trackRef.current.files[0].type.indexOf("audio") === -1) {
      trackRef.current.value = "";
      toast.error("Не верный формат аудио", toastOption);
      return false;
    }
    return true;
  };

  const validatePreviewFile = () => {
    if (previewRef.current.files[0].type.indexOf("image") === -1) {
      previewRef.current.value = "";
      toast.error("Не верный формат обложки", toastOption);
      return false;
    }
    return true;
  };

  const postPreviewOnServer = () => {
    if (validatePreviewFile()) {
      const file = previewRef.current.files[0];
      const formData = new FormData();
      formData.append("preview", file);
      axios.post("/previews", formData).then((res) => {
        setFields((prev) => ({
          ...prev,
          previewPicture: res.data.url,
        }));
      });
    }
  };

  const postTrackOnServer = () => {
    if (validateTrackFile()) {
      const file = trackRef.current.files[0];
      const formData = new FormData();
      formData.append("track", file);
      axios.post("/tracks", formData).then((res) => {
        setFields((prev) => ({
          ...prev,
          trackUrl: res.data.url,
        }));
      });
    }
  };

  const inputChangeHandler = (e) => {
    setFields((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();
    if (validateFieldTrack()) {
      if (!edit) {
        axios
          .post("/track/add", {
            name: fields.name,
            author: fields.author.split(",").map((item) => item.trim()),
            released: Number(fields.released),
            genre: fields.genre.split(",").map((item) => item.trim()),
            isRussian: Boolean(fields.isRussian),
            previewPicture: fields.previewPicture,
            trackUrl: fields.trackUrl,
          })
          .then(() => {
            toast.success("Аудио загружено на сервер!", toastOption);
            setFields({
              name: "",
              author: "",
              released: "",
              genre: "",
              isRussian: true,
              previewPicture: "",
              trackUrl: "",
            });
            previewRef.current.value = "";
            trackRef.current.value = "";
          });
      } else {
        axios
          .patch(`/track/${id}`, {
            name: fields.name,
            author: fields.author.split(",").map((item) => item.trim()),
            released: Number(fields.released),
            genre: fields.genre.split(",").map((item) => item.trim()),
            isRussian: Boolean(fields.isRussian),
            previewPicture: fields.previewPicture,
          })
          .then(() => {
            toast.success("Трек обновлен!", toastOption);
          });
      }
    }
  };

  return (
    <>
      <Container>
        <h1>{edit ? `Редактирование аудио` : "Добавление аудио"}</h1>
        <div className="form">
          <form onSubmit={(e) => formSubmitHandler(e)}>
            <div className="form-input">
              <input
                type="text"
                placeholder="Название аудио"
                name="name"
                value={fields.name}
                onChange={(e) => inputChangeHandler(e)}
              />
            </div>
            <div className="form-input">
              <input
                type="text"
                placeholder="Автор, через запятую если несколько"
                name="author"
                value={fields.author}
                onChange={(e) => inputChangeHandler(e)}
              />
            </div>
            <div className="form-input">
              <input
                type="number"
                placeholder="Год выхода"
                name="released"
                value={fields.released}
                onChange={(e) => inputChangeHandler(e)}
              />
            </div>
            <div className="form-input">
              <input
                type="text"
                placeholder="Введите жанры чере запятую"
                name="genre"
                value={fields.genre}
                onChange={(e) => inputChangeHandler(e)}
              />
            </div>
            <div
              className={`form-checkbox ${fields.isRussian ? "active" : ""}`}
              onClick={() =>
                setFields((prev) => ({ ...prev, isRussian: !prev.isRussian }))
              }
            >
              <p>Слова в аудио на русском языке?</p>
            </div>
            <div
              className="form-preview"
              onClick={() => previewRef.current.click()}
            >
              <input
                type="file"
                hidden
                ref={previewRef}
                onChange={postPreviewOnServer}
              />
              <p>Выберите обложку аудио</p>
              <img
                src={
                  fields.previewPicture.length > 0
                    ? `http://localhost:8000${fields.previewPicture}`
                    : noTrackPreview
                }
                alt="preview"
              />
            </div>
            {!edit && (
              <div className="form-track">
                <p>Выберите аудио</p>
                <input
                  type="file"
                  ref={trackRef}
                  onChange={postTrackOnServer}
                />
              </div>
            )}
            <button type="submit">{edit ? "Обновить" : "Загрузить"}</button>
          </form>
        </div>
      </Container>
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  width: 60vw;
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
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
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

  .form-checkbox {
    position: relative;
    &:after {
      content: "";
      width: 1.5rem;
      height: 1.5rem;
      border: 0.1rem solid rgb(163, 159, 220);
      position: absolute;
      top: 50%;
      left: 0;
      transform: translateY(-50%);
    }
    &.active {
      &:after {
        background-color: #7b74d5;
      }
    }
    p {
      padding-left: 2rem;
    }
  }

  .form-preview {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    align-items: center;
    img {
      &:hover {
        cursor: pointer;
        opacity: 0.6;
        transition: 0.5s ease 0s;
      }
      transition: 0.5s ease 0s;
      width: 10rem;
      height: 10rem;
    }
  }

  .form-track {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
`;

export default TrackAdding;
