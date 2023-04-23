import React from "react";
import { useSelector } from "react-redux";
import styled from "styled-components";
import TrackItem from "./TrackItem";

function PLaylist() {
  const userData = useSelector((store) => store.auth.data);
  const [tracks, setTracks] = React.useState([]);
  const [activeTrack, setActiveTrack] = React.useState("");
  const [searchValue, setSearchValue] = React.useState("");

  const filteredSearchTracks =
    searchValue.length > 0
      ? tracks.filter((item) => {
          let flag = false;
          item.author.map((authorItem) => {
            if (
              authorItem.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
            ) {
              flag = true;
            }
          });
          if (
            item.name.toLowerCase().indexOf(searchValue.toLowerCase()) !== -1
          ) {
            flag = true;
          }
          return flag;
        })
      : tracks;

  React.useEffect(() => {
    if (userData?.likedTrack) {
      setTracks(userData.likedTrack);
    }
  }, [userData]);

  return (
    <Container>
      <div className="playlist-search">
        <input
          type="text"
          placeholder="Название или автор"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </div>
      <div className="content">
        {filteredSearchTracks.map((item) => (
          <TrackItem
            key={item._id}
            track={item}
            activeTrack={activeTrack}
            changeActiveTrack={setActiveTrack}
          />
        ))}
        {tracks.length === 0 && (
          <p className="empty-list">
            Добавьте музыку в свой плейлист во вкладке "Профиль"
          </p>
        )}
      </div>
    </Container>
  );
}

const Container = styled.div`
  padding-left: 1rem;
  .playlist-search {
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
  .content {
    margin-top: 1rem;
    .empty-list {
      text-align: center;
      font-weight: 600;
      font-size: 14px;
    }
  }
`;

export default PLaylist;
