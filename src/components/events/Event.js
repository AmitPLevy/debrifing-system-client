import React, { useState } from "react";
import styled from "styled-components";
import { PlayCircleOutlined } from "@ant-design/icons";
import moment from "moment";
import { Button, Popconfirm, Popover } from "antd";
import EditIcon from "assets/edit-tools.svg";
import TrashIcon from "assets/send-to-trash.svg";
import { _delete, _post } from "../../axios";

const Event = ({ event, onVideoModalOpen, lifeGuard, fetchEvents }) => {
  const {
    videoUrl,
    telemtryURL,
    thumbnailURL,
    loggerURL,
    _id,
    startTime,
    endTime,
  } = event;
  const [notePopOverVisible, setNotePopOverVisible] = useState(false);
  const [visibleNoteKey, setVisibleNoteKey] = useState(null);
  const [note, setNote] = useState(event.note);

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
    await _delete(`/removeEvent/${eventId}`);
    fetchEvents();
  };

  const getDurationInMinutes = (startTime, endTime) => {
    return moment
      .duration(
        moment(endTime, "YYYY/MM/DD HH:mm").diff(
          moment(startTime, "YYYY/MM/DD HH:mm")
        )
      )
      .asMinutes();
  };

  const getDurationInSeconds = (startTime, endTime) => {
    return moment
      .duration(
        moment(endTime, "YYYY/MM/DD HH:mm:ss").diff(
          moment(startTime, "YYYY/MM/DD HH:mm:ss")
        )
      )
      .asSeconds();
  };

  const durationInMinutes =
    getDurationInMinutes(startTime, endTime) > 0 &&
    `${getDurationInMinutes(startTime, endTime)} Minutes`;

  const durationInSeconds =
    getDurationInSeconds(startTime, endTime) > 0 &&
    `${getDurationInSeconds(startTime, endTime)} Seconds`;

  return (
    <EventContainer>
      <LeftPart>
        <Thumbnail
          onClick={() => onVideoModalOpen(videoUrl, telemtryURL, loggerURL)}
        >
          <ThumbnailImage src={thumbnailURL} />
          <PlayCircleOutlined />
        </Thumbnail>
        <TextContainer>
          <StyledText>Life Guard - {lifeGuard && lifeGuard.name}</StyledText>
          <h3>Date - {moment(event.startTime).format("MMM DD, YYYY")}</h3>
          <View>
            <h3>
              Duration - {durationInMinutes} {durationInMinutes ? "," : ""}{" "}
              {durationInSeconds} ({moment(startTime).format("HH:mm:ss")}-
              {moment(endTime).format("HH:mm:ss")})
            </h3>
            <div>{note ? note : "No note available"}</div>
          </View>
        </TextContainer>
      </LeftPart>
      <ButtonsContainer>
        <Popover
          trigger="click"
          title={note ? "Edit note" : "Add note to event"}
          visible={visibleNoteKey === _id && notePopOverVisible}
          placement={"left"}
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
            visibleNoteKey === _id && setNotePopOverVisible(!notePopOverVisible)
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
    </EventContainer>
  );
};

const Thumbnail = styled.div`
  background-size: cover;
  width: 240px;
  height: 135px;
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

const ThumbnailImage = styled.img`
  width: 100%;
  height: 100%;
`;

const EventContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 15px 0;
`;

const StyledText = styled.h2`
  font-size: 20px;
  font-weight: 400;
  margin: 0 !important;
  padding: 0 !important;
  line-height: normal !important;
`;

const TextArea = styled.textarea`
  resize: none;
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

const ButtonsContainer = styled.div`
  display: flex;
  justify-content: space-evenly;
  align-items: flex-end;
  width: 100px;
`;

const StyledImage = styled.img`
  cursor: pointer;
  width: 25px;
  height: 25px;
`;

const TextContainer = styled.div`
  margin-left: 20px;
  flex: 1;

  h3 {
    font-size: 15px;
    color: rgba(0, 0, 0, 0.3);
    margin: 0 !important;
    padding: 0 !important;
  }
`;

const View = styled.div`
  margin-top: 10px;

  h3 {
    font-size: 17px;
    color: rgba(0, 0, 0, 0.5);
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
`;

const LeftPart = styled.div`
  display: flex;
  flex: 1;
`;

export default Event;
