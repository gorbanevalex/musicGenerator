import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

import axios from "../axios";

function Room({ socket }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const [roomData, setRoomData] = React.useState(null);
  const [actualRoomData, setActualRoomData] = React.useState(null);
  const userData = useSelector((store) => store.auth.data);

  React.useEffect(() => {
    if (userData) {
      axios
        .post("/room/user", {
          roomId: id,
          user: userData,
        })
        .then((res) => {
          setRoomData(res.data);
          setActualRoomData(res.data);
          socket.current.emit("add-user", res.data);
        })
        .catch((err) => {
          console.log(err);
          alert("Кажется такой комнаты не существует");
          navigate("/rooms");
        });
    }
  }, [userData]);

  React.useEffect(() => {
    if (socket.current) {
      socket.current.on("newUser-room", (room) => {
        setActualRoomData(room);
      });
      socket.current.on("removeUser-room", (room) => {
        setActualRoomData(room);
      });
    }

    return () => {
      axios.post("room/off", { roomId: id }).then((res) => {
        if (socket.current) {
          socket.current.emit("remove-user", res.data);
        }
      });
    };
  }, []);

  const leaveRoomHandler = () => {
    axios.delete(`/room/remove/${id}`).then((res) => {
      if (socket.current) {
        socket.current.emit("remove-user", res.data);
        navigate("/rooms");
      }
    });
  };

  if (!actualRoomData) {
    return <p>Загрузка</p>;
  }

  return (
    <Container>
      <p>{actualRoomData.allUsers.length} вошедших</p>
      <p>{actualRoomData.usersOnline.length} online</p>
      <button onClick={leaveRoomHandler}>Выйти из комнаты</button>
    </Container>
  );
}

const Container = styled.div``;

export default Room;
