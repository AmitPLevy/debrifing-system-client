import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { _get } from "../axios";
import Promise from "bluebird";
import Loader from "../components/general/Loader";
import { Input, Modal, Table } from "antd";
import VideoTelemetry from "components/events/VideoTelemetry";
import Event from "components/events/Event";

import background from "../assets/home_bg.png";

const Logger = (props) => {
  const selectedBeach = props.history.location.state;
  const [isLoading, setIsLoading] = useState(true);
  const [beachEvents, setBeachEvents] = useState([]);
  const [filteredBeachEvents, setFilteredBeachEvents] = useState([]);
  const [beachLifeGuards, setBeachLifeGuards] = useState([]);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [selectedTelemetryUrl, setSelectedTelemetryUrl] = useState(null);
  const [selectedLoggerUrl, setSelectedLoggerUrl] = useState(null);

  const fetchEvents = () => {
    setIsLoading(true);
    _get(`/events/${selectedBeach._id}`).then((response) => {
      setBeachEvents(response.data);
    });
  };

  useEffect(() => {
    setFilteredBeachEvents(beachEvents);
    setIsLoading(false);
  }, [beachEvents]);

  useEffect(() => {
    const lifeGuards = [];
    Promise.map(selectedBeach.lifeGuards, async (lifeGuardId) => {
      const response = await _get(`/lifeGuard/${lifeGuardId}`);
      lifeGuards.push(...response.data);
    }).then(() => {
      setBeachLifeGuards(lifeGuards);
    });
    fetchEvents();
  }, []);

  const getLifeGuardById = (id) => {
    return (
      beachLifeGuards.length &&
      beachLifeGuards.find((beachLifeGuard) => beachLifeGuard._id === id)
    );
  };

  const onVideoModalOpen = (videoUrl, telemtryURL, loggerUrl) => {
    setVideoModalVisible(true);
    setSelectedVideoUrl(videoUrl);
    setSelectedTelemetryUrl(telemtryURL);
    setSelectedLoggerUrl(loggerUrl);
  };

  const onVideoModalClose = () => {
    setVideoModalVisible(false);
    setSelectedVideoUrl(null);
    setSelectedTelemetryUrl(null);
    setSelectedLoggerUrl(null);
  };

  const filterEventsByLifeGuard = (e) => {
    const query = e.target.value;
    let filteredArray = [...beachEvents];
    filteredArray = filteredArray.filter((event) => {
      const lifeGuard = getLifeGuardById(event.lifeGuardId);
      return (
        lifeGuard &&
        lifeGuard.name &&
        lifeGuard.name.toLowerCase().includes(query.toLowerCase())
      );
    });
    setFilteredBeachEvents(filteredArray);
  };

  return isLoading ? (
    <Loader />
  ) : (
    <Container>
      <StyledInput
        placeholder={"Search by Life Guard..."}
        onChange={filterEventsByLifeGuard}
      />
      <Events>
        {filteredBeachEvents && filteredBeachEvents.length ? (
          filteredBeachEvents.map((event, i) => [
            <Event
              event={event}
              lifeGuard={getLifeGuardById(event.lifeGuardId)}
              onVideoModalOpen={onVideoModalOpen}
              fetchEvents={fetchEvents}
            />,
            <Divider />,
          ])
        ) : (
          <StyledNoData>No events...</StyledNoData>
        )}
      </Events>

      <StyledModal
        onCancel={onVideoModalClose}
        visible={videoModalVisible}
        footer={null}
        destroyOnClose
      >
        <StyledVideoTelemetry telemetryFile={selectedTelemetryUrl} loggerFile={selectedLoggerUrl} />
        <StyledVideo id="video" controls autoPlay muted>
          <source src={selectedVideoUrl} type="video/mp4" />
        </StyledVideo>
      </StyledModal>
    </Container>
  );
};

const StyledModal = styled(Modal)`
  width: 80% !important;
  position: relative;
  top: 50%;
  transform: translateY(-50%);
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 70px;
  margin: 0 auto;
  overflow-y: auto;
  background-color: #f3f3f3;
`;

const StyledVideo = styled.video`
  position: relative;
  width: 95%;
  left: 50%;
  transform: translateX(-50%);
`;

const StyledVideoTelemetry = styled(VideoTelemetry)`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
`;

const Divider = styled.div`
  margin: 0 auto;
  background-color: rgba(150, 150, 150, 0.4);
  height: 1px;
  width: 100%;
`;

const StyledInput = styled(Input)`
  margin-top: 20px;
  padding: 8px;
  width: 200px;
  border-color: rgba(0, 0, 0, 0.5);
  border-radius: 4px;
  background-color: transparent;

  :hover {
    border-color: transparent;
  }

  ::placeholder {
    color: rgba(0, 0, 0, 0.5);
  }
`;

const StyledNoData = styled.div`
  width: 100%;
  text-align: center;
  font-size: 20px;
  margin-top: 60px;
  font-weight: bold;
`;

const Events = styled.div`
  margin-top: 30px;
`;

export default Logger;
