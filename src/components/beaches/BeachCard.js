import React from "react";
import styled from "styled-components";
import backgroundImage from "../../assets/bg.png";

const BeachCard = ({ beach, index, onBeachClick, empty }) => {
  const renderEmptyCard = () => {
    return <EmptyBeachContainer onClick={onBeachClick}>+</EmptyBeachContainer>;
  };

  const renderCard = () => {
    return (
      <BeachContainer onClick={() => onBeachClick(index)}>
        <BeachName>{beach.name}</BeachName>
      </BeachContainer>
    );
  };

  return empty ? renderEmptyCard() : renderCard();
};

const BeachContainer = styled.div`
  width: 340px;
  height: 225px;
  // width: 300px;
  // height: 185px;
  display: flex;
  border-radius: 8px;
  cursor: pointer;
  margin: 10px;
  background-image: url(${backgroundImage});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
`;

const BeachName = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  width: 100%;
  background-color: rgba(200, 200, 200, 0.4);
  color: #fff;
  font-size: 19px;
`;

const EmptyBeachContainer = styled(BeachContainer)`
  border: 1px dashed black;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default BeachCard;
