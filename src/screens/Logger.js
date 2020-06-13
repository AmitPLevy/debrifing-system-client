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

  const fetchEvents = () => {
    setIsLoading(true);
    _get(`/events/${selectedBeach._id}`).then((response) => {
      setBeachEvents(response.data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    setFilteredBeachEvents(beachEvents);
  }, [beachEvents]);

  useEffect(() => {
    const lifeGuards = [];
    Promise.map(selectedBeach.lifeGuards, async (lifeGuardId) => {
      const response = await _get(`/lifeGuard/${lifeGuardId}`);
      lifeGuards.push(...response.data);
    }).then(() => {
      setBeachLifeGuards(lifeGuards);
      setIsLoading(false);
    });
    fetchEvents();
  }, []);

  const getLifeGuardById = (id) => {
    return (
      beachLifeGuards.length &&
      beachLifeGuards.find((beachLifeGuard) => beachLifeGuard._id === id)
    );
  };

  const onVideoModalOpen = (videoUrl, telemtryURL) => {
    setVideoModalVisible(true);
    setSelectedVideoUrl(videoUrl);
    setSelectedTelemetryUrl(telemtryURL);
  };

  const onVideoModalClose = () => {
    setVideoModalVisible(false);
    setSelectedVideoUrl(null);
    setSelectedTelemetryUrl(null);
  };

  const filterEventsByLifeGuard = (e) => {
    const query = e.target.value;
    let filteredArray = [...beachEvents];
    filteredArray = filteredArray.filter((event) => {
      const lifeGuard = getLifeGuardById(event.lifeGuardId);
      return lifeGuard.name.toLowerCase().includes(query.toLowerCase());
    });
    setFilteredBeachEvents(filteredArray);
  };

  return isLoading ? (
    <Loader />
  ) : !filteredBeachEvents.length ? (
    <div>No data</div>
  ) : (
    <Container>
      <StyledInput
        placeholder={"Search by Life Guard..."}
        onChange={filterEventsByLifeGuard}
      />
      {filteredBeachEvents &&
        filteredBeachEvents.map((event, i) => [
          i !== 0 && <Divider />,
          <Event
            event={event}
            lifeGuard={getLifeGuardById(event.lifeGuardId)}
            onVideoModalOpen={onVideoModalOpen}
            fetchEvents={fetchEvents}
          />,
        ])}

      <StyledModal
        onCancel={onVideoModalClose}
        visible={videoModalVisible}
        footer={null}
        // title={"Event video"}
        destroyOnClose
      >
        <StyledVideoTelemetry telemetryFile={selectedTelemetryUrl} />
        <StyledVideo id="video" controls autoPlay>
          <source src={selectedVideoUrl} type="video/mp4" />
        </StyledVideo>
      </StyledModal>
    </Container>
  );
};

const StyledModal = styled(Modal)`
  width: 80% !important;
  position: relative;
  // top: 50%;
  // transform: translateY(-50%);
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  // height: auto;
  // background: #f3f3f3;
  background: rgba(0, 0, 150, 0.1);
  // background: rgba(0, 0, 160, .4);
  // padding: 40px;
`;

const Thumbnail = styled.div`
  background-size: cover;
  width: 160px;
  height: 90px;
  cursor: pointer;
  position: relative;

  svg {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 30px;
    height: 30px;
    position: absolute;
    opacity: 0.7;

    path {
      fill: #fff;
    }
  }
`;

const StyledVideo = styled.video`
  position: relative;
  width: 95%;
  left: 50%;
  transform: translateX(-50%);
`;

const StyledTable = styled(Table)`
  .ant-table {
    background: transparent !important;
  }
  width: 95%;
  border-radius: 4px;
  td,
  tr,
  th {
    font-size: 18px;
    // background-color: #f3f3f3 !important;
    background: transparent !important;
    text-align: center !important;
    border-bottom: 1px solid #cccccc !important;
    color: #000;
  }

  table {
    background: transparent !important;
    border-radius: 4px;
    border-right: 1px solid #cccccc;
    border-left: 1px solid #cccccc;
    border-top: 1px solid #cccccc;
    border-bottom: 1px solid #cccccc;
  }
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
`;

const StyledVideoTelemetry = styled(VideoTelemetry)`
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 16px;
`;

const Divider = styled.div`
  background-color: red;
  height: 1px;
  width: 100%;
`;

const StyledInput = styled(Input)``;

export default Logger;
