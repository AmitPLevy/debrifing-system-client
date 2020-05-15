import React from "react";
import styled from "styled-components";

import backgroundImage from "../assets/background.jpeg";
import { useHistory } from "react-router-dom";

const MainPage = (props) => {
  const history = useHistory();

  return (
    <LoginContainer>
      <OpacityDiv>
        <CardsContainer>
          <Card onClick={() => history.push("/debriefing")}>Debriefing</Card>
          <Card onClick={() => history.push("/users-management")}>
            User Management
          </Card>
        </CardsContainer>
      </OpacityDiv>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  width: 100%;
  height: ${(props) => props.theme.sizes.containerHeight};
  background-image: url(${backgroundImage});
  background-repeat: no-repeat;
  background-size: cover;
  color: #fff;
  font-size: 17px;
  opacity: 1.5;
`;

const OpacityDiv = styled.div`
  width: 100%;
  height: ${(props) => props.theme.sizes.containerHeight};
  background-color: #000;
  opacity: 0.7;
  position: relative;
  display: flex;
  justify-content: center;
`;

const CardsContainer = styled.div`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
`;

const Card = styled.div`
  background: rgba(177, 177, 177, 0.3);
  border-radius: 8px;
  width: 350px;
  height: 400px;
  margin-left: 25px;
  margin-right: 25px;
  font-size: 20px;
  text-align: center;
  cursor: pointer;
`;

export default MainPage;
