import React, { useEffect, useRef, useState, useLayoutEffect } from "react";
import { _get } from "../axios/index";
import styled from "styled-components";
import BeachCard from "../components/beaches/BeachCard";
import { useHistory } from "react-router-dom";
import { Modal } from "antd";
import AddBeachModal from "../components/beaches/AddBeachModal";
import Loader from "../components/general/Loader";

const Debriefing = ({ className }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [beaches, setBeaches] = useState([]);
  const [addBeachModalVisible, setAddBeachModalVisible] = useState(false);
  const [numOfShadowBoxes, setNumOfShadowBoxes] = useState(0);
  const history = useHistory();

  const fetchBeaches = () => {
    setIsLoading(true);
    _get("/beaches").then((response) => {
      setBeaches(response.data);
      setIsLoading(false);
    });
  };

  const calculateBoxShadowNumber = () => {
    const containerSize = (95 * window.innerWidth) / 100 - 20;
    const numberOfBoxesInRow = Math.floor(containerSize / 360);
    const totalNumOfBoxes = beaches.length + 1;
    let missingBoxes =
      numberOfBoxesInRow - (totalNumOfBoxes % numberOfBoxesInRow);
    if (missingBoxes >= numberOfBoxesInRow) missingBoxes = 0;
    setNumOfShadowBoxes(missingBoxes);
  };

  useEffect(() => {
    fetchBeaches();
    window.addEventListener("resize", calculateBoxShadowNumber);
  }, []);

  useEffect(() => {
    calculateBoxShadowNumber();
  }, [beaches]);

  const onBeachClick = (index) => {
    history.push({
      pathname: `logger/beach#${beaches[index].name}`,
      state: beaches[index],
    });
  };

  const onBeachAdd = () => {
    fetchBeaches();
    setAddBeachModalVisible(false);
  };

  const renderShadows = () => {
    let shadowBoxArr = [];
    if (numOfShadowBoxes) {
      for (let i = 0; i < numOfShadowBoxes; i++) {
        shadowBoxArr.push(<ShadowBox />);
      }
      return shadowBoxArr;
    }
  };

  return isLoading ? (
    <Loader />
  ) : (
    <DebriefingContainer>
      <BeachesContainer>
      <StyledText>Beach list</StyledText>
        {beaches.length > 0 &&
          beaches.map((beach, i) => (
            <BeachCard
              beach={beach}
              index={i}
              key={i}
              onBeachClick={onBeachClick}
            />
          ))}
        <BeachCard
          empty={true}
          onBeachClick={() => setAddBeachModalVisible(true)}
        />
        {renderShadows()}
      </BeachesContainer>

      <StyledModal
        onCancel={() => setAddBeachModalVisible(false)}
        visible={addBeachModalVisible}
        title={"Add new beach"}
        footer={null}
        destroyOnClose
      >
        <AddBeachModal onBeachAdd={onBeachAdd} />
      </StyledModal>
    </DebriefingContainer>
  );
};

const DebriefingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  // height: ${(props) => props.theme.sizes.containerHeight};
  height: auto;
  background: #f3f3f3;;
`;

const BeachesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  padding: 20px 0;
  width: 95%;
  // max-width: 95%;
  // max-height: ${(props) => props.theme.sizes.containerHeight};
  justify-content: center;
  // overflow-y: auto;
  // margin-top: 50px;
  overflow-y: auto;
`;

const StyledModal = styled(Modal)`
  width: 50% !important;
`;

const ShadowBox = styled.div`
  width: 340px;
  height: 224px;

  margin: 10px;
`;

const StyledText = styled.h1`
  font-size: 38px;
  text-align: left;
  width: 95%;
  // align-self: flex-start;
  margin-left: 80px;
  margin-top: 40px;
  margin-bottom: 40px;
`;
export default Debriefing;
