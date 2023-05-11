import React from "react";
import axios from "../axios";

import editIcon from "../assets/editIcon.png";
import playIcon from "../assets/playButton.png";
import playGif from "../assets/musicPlay.gif";
import addIcon from "../assets/add.png";
import addedIcon from "../assets/check.png";
import basketIcon from "../assets/basket.png";

import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";

const useAudio = (audio, activeTrack) => {
  const [playing, setPlaying] = React.useState(false);

  const toggle = () => setPlaying(!playing);

  const pause = () => setPlaying(false);

  React.useEffect(() => {
    playing ? audio.play() : audio.pause();
  }, [playing]);

  React.useEffect(() => {
    audio.addEventListener("ended", () => setPlaying(false));

    return () => {
      audio.removeEventListener("ended", () => setPlaying(false));
    };
  }, []);

  return [playing, toggle, pause];
};

function TrackItem({ track, activeTrack, changeActiveTrack, editable }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.auth.data);
  const [isAdded, setIsAdded] = React.useState(false);

  React.useEffect(() => {
    if (userData?.likedTrack) {
      setIsAdded(
        (userData.likedTrack.find((item) => item._id === track._id) && true) ||
          false
      );
    }
  }, [userData]);

  const [audio] = React.useState(
    new Audio(`http://localhost:8000${track.trackUrl}`)
  );
  const [duration, setDuration] = React.useState("");
  const [currentTime, setCurrentTime] = React.useState(0);

  const [playing, toggle, pause] = useAudio(audio, activeTrack);
  if (activeTrack !== track._id && playing) {
    pause();
  }

  React.useEffect(() => {
    let timer;
    if (playing) {
      timer = setInterval(() => {
        setCurrentTime((prevState) => prevState + 1);
      }, 1000);
    } else {
      clearInterval(timer);
      console.log("not play");
    }

    return () => {
      clearInterval(timer);
    };
  }, [playing]);

  React.useEffect(() => {
    audio.onloadedmetadata = () => {
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.round(audio.duration - minutes * 60);
      setDuration(minutes + ":" + seconds);
    };

    return () => {
      audio.pause();
    };
  }, []);

  const onPlayClickHandler = () => {
    changeActiveTrack(track._id);
    toggle();
  };

  const addTrackHandler = () => {
    if (!isAdded) {
      axios.patch("/auth/track", { track }).then((res) => {
        dispatch(login(res.data));
      });
    } else {
      axios.delete(`/auth/track/${track._id}`).then((res) => {
        dispatch(login(res.data));
      });
    }
  };

  const removeTrackHandler = () => {
    axios.delete(`/track/${track._id}`).then((res) => {
      setDuration("");
    });
  };

  return (
    <TrackContainer className={duration.length === 0 && "off"}>
      <Container onClick={onPlayClickHandler}>
        <div className={`track-preview ${playing && "active"}`}>
          <img src={playIcon} alt="" className="play-icon" />
          <img src={playGif} alt="" className="play-gif" />
          <img src={`http://localhost:8000${track.previewPicture}`} alt="" />
        </div>
        <div className="track-info">
          <h3>{track.name}</h3>
          <p>{track.author.join(",")}</p>
        </div>
        <div className="track-duration">
          <p>{duration}</p>
          <p>{`${Math.floor(currentTime / 60)} : ${Math.round(
            currentTime - Math.floor(currentTime / 60) * 60
          )}`}</p>
        </div>
      </Container>
      {!editable ? (
        <button className="add" onClick={addTrackHandler}>
          {!isAdded && duration.length !== 0 && <img src={addIcon} alt="" />}
          {isAdded && <img src={addedIcon} alt="" />}
        </button>
      ) : (
        <>
          <button className="add" onClick={removeTrackHandler}>
            {duration.length !== 0 && <img src={basketIcon} alt="" />}
          </button>
          <button
            className="add"
            onClick={() => navigate(`/edit/${track._id}`)}
          >
            {duration.length !== 0 && <img src={editIcon} alt="" />}
          </button>
        </>
      )}
    </TrackContainer>
  );
}

const TrackContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: center;
  &.off {
    opacity: 0.3;
  }
  .add {
    height: 2rem;
    cursor: pointer;
    background: none;
    border: none;
    img {
      width: 2rem;
      height: 2rem;
    }
  }
`;

const Container = styled.div`
  flex: 1 1 auto;
  display: flex;
  gap: 1rem;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem;
  &:hover {
    background-color: #eee8e8;
    .track-preview {
      &:after {
        content: "";
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.6);
        position: absolute;
        top: 0;
        left: 0;
      }
      .play-icon {
        display: block;
      }
    }
  }
  .track-info {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
  }
  .track-preview {
    position: relative;
    height: 4rem;
    &.active {
      .play-gif {
        display: block;
      }
      .play-icon {
        display: none !important;
      }
    }
    .play-gif {
      position: absolute;
      display: none;
      width: 2.5rem;
      height: 2.5rem;
      z-index: 2;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
    .play-icon {
      position: absolute;
      z-index: 2;
      width: 2rem;
      height: 2rem;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: none;
    }
    img {
      height: 4rem;
      width: 4rem;
    }
  }
  .track-duration {
    margin-left: auto;
  }
`;

export default TrackItem;
