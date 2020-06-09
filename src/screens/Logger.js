import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { _delete, _get, _post } from "../axios";
import Promise from "bluebird";
import Loader from "../components/general/Loader";
import { Button, Modal, Popconfirm, Popover, Table, Tooltip } from "antd";
import moment from "moment";
import EditIcon from "../assets/edit-tools.svg";
import TrashIcon from "../assets/send-to-trash.svg";
import { PlayCircleOutlined } from "@ant-design/icons";
import { StyledText } from "./Debriefing";
import VideoTelemetry from "components/events/VideoTelemetry";

const Logger = (props) => {
  const selectedBeach = props.history.location.state;
  const [isLoading, setIsLoading] = useState(true);
  const [beachEvents, setBeachEvents] = useState([]);
  const [beachLifeGuards, setBeachLifeGuards] = useState([]);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
  const [selectedTelemetryUrl, setSelectedTelemetryUrl] = useState(null);
  const [notePopOverVisible, setNotePopOverVisible] = useState(false);
  const [visibleNoteKey, setVisibleNoteKey] = useState(null);
  const [note, setNote] = useState(null);

  const fetchEvents = () => {
    setIsLoading(true);
    _get(`/events/${selectedBeach._id}`).then((response) => {
      setBeachEvents(response.data);
      setIsLoading(false);
    });
  };

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

  const getDurationInMinutes = (startTime, endTime) => {
    return moment
      .duration(
        moment(endTime, "YYYY/MM/DD HH:mm").diff(
          moment(startTime, "YYYY/MM/DD HH:mm")
        )
      )
      .asMinutes();
  };

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

  const onAddEventNote = async (eventId) => {
    setNotePopOverVisible(false);
    setVisibleNoteKey(null);
    await _post("/addEventNote", {
      note,
      eventId,
    });
    setNote(null);
    fetchEvents();
  };

  const removeEvent = async (eventId) => {
    await _delete(`removeEvent/${eventId}`);
    fetchEvents();
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (_, { startTime }) => moment(startTime).format("MMM DD, YYYY"),
      sorter: (a, b) => moment(a.startTime) - moment(b.startTime),
    },
    {
      title: "Start time",
      dataIndex: "startTime",
      key: "startTime",
      render: (_, { startTime }) => moment(startTime).format("HH:mm"),
    },
    {
      title: "End time",
      dataIndex: "endTime",
      key: "endTime",
      render: (_, { endTime }) => moment(endTime).format("HH:mm"),
    },
    {
      title: "Duration",
      dataIndex: "duration",
      key: "duration",
      render: (_, { startTime, endTime }) => {
        return `${getDurationInMinutes(startTime, endTime)} Minutes`;
      },
      sorter: (a, b) => {
        const aMinutes = getDurationInMinutes(a.startTime, a.endTime);
        const bMinutes = getDurationInMinutes(b.startTime, b.endTime);
        return bMinutes - aMinutes;
      },
    },
    {
      title: "Life Guard",
      dataIndex: "lifeGuard",
      key: "lifeGuard",
      render: (_, { lifeGuardId }) => {
        const lifeGuard = getLifeGuardById(lifeGuardId);
        return lifeGuard && lifeGuard.name;
      },
      sorter: (a, b) => {
        const aLifeGuard = getLifeGuardById(a.lifeGuardId);
        const bLifeGuard = getLifeGuardById(b.lifeGuardId);
        return !aLifeGuard || !bLifeGuard
          ? -1
          : aLifeGuard.name > bLifeGuard.name;
      },
    },
    {
      title: "",
      dataIndex: "buttons",
      key: "buttons",
      render: (_, { note, _id }) => {
        return (
          <ButtonsContainer>
            <Popover
              trigger="click"
              title={note ? "Edit note" : "Add note to event"}
              visible={visibleNoteKey === _id && notePopOverVisible}
              placement={"bottom"}
              content={
                <NoteContainer>
                  <TextArea onChange={(e) => setNote(e.target.value)}>
                    {note}
                  </TextArea>
                  <StyledButton onClick={() => onAddEventNote(_id)}>
                    save note
                  </StyledButton>
                </NoteContainer>
              }
              onVisibleChange={() =>
                visibleNoteKey === _id &&
                setNotePopOverVisible(!notePopOverVisible)
              }
            >
              <StyledImage
                src={EditIcon}
                onClick={() => {
                  setNotePopOverVisible(true);
                  setVisibleNoteKey(_id);
                }}
              />
            </Popover>

            <Popconfirm
              title={"are you sure you want to remove this event?"}
              onConfirm={() => removeEvent(_id)}
            >
              <StyledImage src={TrashIcon} />
            </Popconfirm>
          </ButtonsContainer>
        );
      },
      width: 120,
    },
    {
      title: "",
      dataIndex: "video",
      key: "video",
      render: (_, { videoUrl, thumbnailURL, telemtryURL }) => {
        return (
          <Thumbnail onClick={() => onVideoModalOpen(videoUrl, telemtryURL)}>
            <ThumbnailImage src={thumbnailURL} />
            <PlayCircleOutlined />
          </Thumbnail>
        );
      },
      width: 150,
    },
  ];

  return isLoading ? (
    <Loader />
  ) : (
    <Container>
      <StyledText>Events- {selectedBeach.name} beach</StyledText>

      <StyledTable
        columns={columns}
        dataSource={beachEvents}
        pagination={false}
        // expandedRowRender={(event) => <ExpandedEvent event={event} />}
      />

      <StyledModal
        onCancel={onVideoModalClose}
        visible={videoModalVisible}
        footer={null}
        title={"Event video"}
        destroyOnClose
      >
        <StyledVideoTelemetry telemetryFile={selectedTelemetryUrl} />
        <StyledVideo id="video" controls autoPlay width="600" height="300">
          <source src={selectedVideoUrl} type="video/mp4" />
        </StyledVideo>
      </StyledModal>
    </Container>
  );
};

const StyledModal = styled(Modal)`
  width: 50% !important;
  position: relative;
`;

const StyledImage = styled.img`
  cursor: pointer;
  width: 20px;
  height: 20px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: auto;
  background: #f3f3f3;
  padding: 0px 20px;
`;

const Thumbnail = styled.div`
  background-size: cover;
  height: 100px;
  width: 150px;
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
  left: 50%;
  transform: translateX(-50%);
`;

const StyledTable = styled(Table)`
  width: 95%;
  border-radius: 4px;
  td,
  tr,
  th {
    font-size: 15px;
    background-color: #f3f3f3 !important;
    text-align: center !important;
    border-bottom: 1px solid #cccccc !important;
  }

  table {
    border-radius: 4px;
    border-right: 1px solid #cccccc;
    border-left: 1px solid #cccccc;
    border-top: 1px solid #cccccc;
  }
`;

const NoteContainer = styled.div`
  width: 280px;
  height: 160px;
  display: flex;
  flex-direction: column;

  textarea {
    height: 100px;
    border-radius: 4px;
  }
`;

const StyledButton = styled(Button)`
  margin-top: 20px;
  width: 100px;
  align-self: flex-end;
  border-radius: 4px;
`;

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
`;

const TextArea = styled.textarea`
  resize: none;
`;

const StyledVideoTelemetry = styled(VideoTelemetry)`
  position: absolute;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
`;

export default Logger;
