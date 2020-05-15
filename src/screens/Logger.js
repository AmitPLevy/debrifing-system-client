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

const Logger = (props) => {
  const selectedBeach = props.history.location.state;
  const [isLoading, setIsLoading] = useState(true);
  const [beachEvents, setBeachEvents] = useState([]);
  const [beachLifeGuards, setBeachLifeGuards] = useState([]);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [selectedVideoUrl, setSelectedVideoUrl] = useState(null);
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

  const onVideoModalOpen = (videoUrl) => {
    setVideoModalVisible(true);
    setSelectedVideoUrl(videoUrl);
  };

  const onVideoModalClose = () => {
    setVideoModalVisible(false);
    setSelectedVideoUrl(null);
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
        const minutes = moment
          .duration(
            moment(endTime, "YYYY/MM/DD HH:mm").diff(
              moment(startTime, "YYYY/MM/DD HH:mm")
            )
          )
          .asMinutes();
        return `${minutes} Minutes`;
      },
    },
    {
      title: "Life Guard",
      dataIndex: "lifeGuard",
      key: "lifeGuard",
      render: (_, { lifeGuardId }) => {
        const lifeGuard =
          beachLifeGuards.length &&
          beachLifeGuards.find(
            (beachLifeGuard) => beachLifeGuard._id === lifeGuardId
          );
        return lifeGuard && lifeGuard.name;
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
                  <textarea onChange={(e) => setNote(e.target.value)}>
                    {note}
                  </textarea>
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
      render: (_, { videoUrl }) => {
        return (
          <Thumbnail onClick={() => onVideoModalOpen(videoUrl)}>
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
      <Heading>Events Logger- {selectedBeach.name}</Heading>

      <StyledTable
        columns={columns}
        dataSource={beachEvents}
        pagination={false}
        // expandedRowRender={(event) => <ExpandedEvent event={event} />}
      />
      {videoModalVisible && (
        <StyledModal
          onCancel={onVideoModalClose}
          visible={videoModalVisible}
          footer={null}
          title={"Event video"}
        >
          <StyledIframe
            width="619"
            height="350"
            src={
              "https://drone-guard-videos.s3-eu-west-1.amazonaws.com/uploads/converted.mp4"
            }
          />
        </StyledModal>
      )}
    </Container>
  );
};

const Heading = styled.div`
  font-size: 20px;
  text-align: center;
  padding: 30px 0;
`;

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
  padding: 0 30px;
`;

const Thumbnail = styled.div`
  background-image: url("https://drone-guard-videos.s3-eu-west-1.amazonaws.com/uploads/screenShot_00%3A00%3A00.jpeg");
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

const StyledIframe = styled.iframe`
  position: relative;
  left: 50%;
  transform: translateX(-50%);
`;

const StyledTable = styled(Table)`
  td,
  tr {
    font-size: 15px;
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

export default Logger;
