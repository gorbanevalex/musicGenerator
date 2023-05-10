import React from "react";
import axios from "../axios";

import styled from "styled-components";
import { useSelector } from "react-redux";
import TrackItem from "./TrackItem";

function ChangeTrack() {
  const userData = useSelector((store) => store.auth.data);
  const [allTracks, setAllTracks] = React.useState([]);
  const [userTracks, setUserTracks] = React.useState([]);
  const [activeTrack, setActiveTrack] = React.useState();
  const [searchValue, setSearchValue] = React.useState("");

  const tracksNotAdded = allTracks.filter((item) => {
    return userTracks.indexOf(item) === -1;
  });

  const filteredSearchTracks =
    searchValue.length > 0
      ? tracksNotAdded.filter((item) => {
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
      : tracksNotAdded;

  React.useEffect(() => {
    if (userData?.likedTrack) {
      setUserTracks(userData.likedTrack);
    }
  }, [userData]);

  React.useEffect(() => {
    axios.get("/track/all").then((res) => {
      setAllTracks(res.data);
    });
  }, []);
  return (
    <Container>
      <h3>Добавьте любимую музыку</h3>
      <div className="search">
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
            editable={false}
          />
        ))}
      </div>
    </Container>
  );
}

const Container = styled.div`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  h3 {
    font-size: 1rem;
  }
  .search {
    margin-top: 0.5rem;
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
    overflow-y: scroll;
    flex: 1 1 auto;
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
`;

export default ChangeTrack;
