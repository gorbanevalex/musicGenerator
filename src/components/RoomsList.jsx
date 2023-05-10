import React from "react";
import styled from "styled-components";
import axios from "../axios";
import { toast } from "react-toastify";
import { toastOption } from "../utils/toast";
import { Link, useNavigate } from "react-router-dom";

function RoomsList() {
  const [roomCredeIsOpen, setRoomCreadeIsOpen] = React.useState(false);
  const [newRoomName, setNewRoomName] = React.useState("");
  const navigate = useNavigate();
  const [allRooms, setAllRooms] = React.useState([]);

  console.log(allRooms);

  React.useEffect(() => {
    axios.get(`/room`).then((res) => {
      setAllRooms(res.data);
    });
  }, []);

  const roomCreateHandler = () => {
    if (newRoomName.length < 3) {
      toast.error("Имя комнаты минимум 3 символа", toastOption);
    } else {
      axios.post("/room", { name: newRoomName }).then((res) => {
        navigate(`/rooms/${res.data}`);
      });
    }
  };

  return (
    <>
      <Container>
        <h3>
          Создавайте комнаты, делитесь ID комнаты с друзьями и генерируйте общий
          плейлист!
        </h3>
        <div className="rooms-buttons">
          <button onClick={() => setRoomCreadeIsOpen(true)}>
            Создать комнату
          </button>
          <button>Зайти в комнату</button>
        </div>
        <div className="rooms-list">
          <h3>Ваши комнаты</h3>
          {allRooms.map((item) => (
            <Link key={item._id} to={`/rooms/${item._id}`} className="room">
              <h4>{item.name}</h4>
              <p>Участников: {item.allUsers.length}</p>
            </Link>
          ))}
        </div>
      </Container>
      {roomCredeIsOpen && (
        <ModalCreate>
          <div
            className="modal-bg"
            onClick={() => setRoomCreadeIsOpen(false)}
          ></div>
          <div className="modal-body">
            <h3>Создание комнаты</h3>
            <div className="create-input">
              <input
                type="text"
                placeholder="Имя комнаты"
                value={newRoomName}
                onChange={(e) => setNewRoomName(e.target.value)}
              />
            </div>
            <button onClick={roomCreateHandler}>Создать</button>
          </div>
        </ModalCreate>
      )}
    </>
  );
}

const ModalCreate = styled.div`
  position: fixed;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  .modal-bg {
    position: absolute;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: rgba(0, 0, 0, 0.6);
  }
  .modal-body {
    position: absolute;
    z-index: 2;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
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
    h3 {
      font-weight: 600;
    }
    .create-input {
      padding-top: 1rem;
      width: 100%;
    }
    input {
      width: 100%;
      padding: 1rem;
      border: 0.1rem solid rgb(163, 159, 220);
      outline: none;
      &:hover {
        border: 0.1rem solid #7b74d5;
      }
    }
    button {
      cursor: pointer;
      padding: 1rem;
      border: none;
      outline: none;
      width: 100%;
      margin-top: 1rem;
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
`;

const Container = styled.div`
  padding-left: 1rem;
  h3 {
    text-align: center;
  }
  .rooms-list {
    margin-top: 2rem;
    h3 {
      padding-bottom: 1rem;
    }
    .room {
      text-decoration: none;
      cursor: pointer;
      padding: 1rem;
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
      margin-bottom: 1rem;
    }
  }
  .rooms-buttons {
    padding-top: 1rem;
    display: flex;
    justify-content: center;
    gap: 1rem;
    button {
      opacity: 0.8;
      text-align: center;
      cursor: pointer;
      padding: 1.5rem;
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
      &:hover {
        opacity: 1;
      }
    }
  }
`;

export default RoomsList;
