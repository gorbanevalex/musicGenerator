import React from "react";
import axios from "../axios";
import TrackItem from "./TrackItem";

import styled from "styled-components";

function EditPlaylist() {
  const [tracks, setTracks] = React.useState([]);
  const [activeTrack, setActiveTrack] = React.useState();
  const [searchValue, setSearchValue] = React.useState("");

  React.useEffect(() => {
    axios.get("/track/all").then((res) => {
      setTracks(res.data);
    });
  }, []);

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

  return (
    <Container>
      <h1>Редактируйте треки, добавленные в приложение</h1>
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
            editable={true}
          />
        ))}
      </div>
    </Container>
  );
}

const Container = styled.div`
  padding: 0 1rem;
  h1 {
    font-size: 1rem;
    text-align: center;
  }
  .playlist-search {
    padding: 1rem 0;
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

export default EditPlaylist;
