import React from "react";
import { useSelector } from "react-redux";

import styled from "styled-components";
import ProfileMain from "./ProfileMain";

function Profile() {
  const userData = useSelector((store) => store.auth.data);
  return (
    <>
      <Container>
        <div className="welcome">
          <h2>
            <span>{userData?.login}</span>, тут вы можете изменить свои
            предпочтения и основные настройки
          </h2>
        </div>
        <div className="profile-main">
          <ProfileMain />
        </div>
      </Container>
    </>
  );
}

const Container = styled.div`
  padding: 0 1rem;
  height: 100%;
  display: flex;
  flex-direction: column;
  .welcome {
    text-align: center;
    h2 {
      font-size: 1rem;
      span {
        color: #7b74d5;
      }
    }
  }
  .profile-main {
    flex: 1 1 auto;
  }
`;

export default Profile;
