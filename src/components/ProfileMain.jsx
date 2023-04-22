import React from "react";
import { useSelector } from "react-redux";

import styled from "styled-components";
import ChangeAuthor from "./ChangeAuthor";
import ChangeGenre from "./ChangeGenre";
import ChangeLogin from "./ChangeLogin";
import ChangeTrack from "./ChangeTrack";

function ProfileMain() {
  const userData = useSelector((store) => store.auth.data);
  console.log(userData);
  return (
    <Container>
      <ChangeLogin />
      <div className="changed-preferences">
        <ChangeGenre />
        <ChangeAuthor />
        <ChangeTrack />
      </div>
    </Container>
  );
}

const Container = styled.div`
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  .changed-preferences {
    display: flex;
    gap: 2rem;
  }
`;

export default ProfileMain;
