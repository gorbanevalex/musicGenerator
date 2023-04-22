import React from "react";

import playIcon from "../assets/playButton.png";
import playGif from "../assets/musicPlay.gif";
import styled from "styled-components";

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

function TrackItem({ track, activeTrack, changeActiveTrack }) {
  const [audio] = React.useState(
    new Audio(`http://localhost:8000${track.trackUrl}`)
  );
  const [duration, setDuration] = React.useState("");

  React.useEffect(() => {
    audio.onloadedmetadata = () => {
      const minutes = Math.floor(audio.duration / 60);
      const seconds = Math.round(audio.duration - minutes * 60);
      setDuration(minutes + ":" + seconds);
    };
  });

  const [playing, toggle, pause] = useAudio(audio, activeTrack);
  if (activeTrack !== track._id && playing) {
    pause();
  }
  const onPlayClickHandler = () => {
    changeActiveTrack(track._id);
    toggle();
  };

  return (
    <>
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
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
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
