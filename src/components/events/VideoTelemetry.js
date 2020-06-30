import React, { useEffect, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import BatteryIcon from "../../assets/battery.png";
import Loader from "components/general/Loader";

let _index = 0;
let interval;

const VideoTelemetry = ({ telemetryFile, className, loggerFile }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [telemetryInfo, setTelemetryInfo] = useState({});
  const [loggerInfo, setLoggerInfo] = useState({});
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [isSeeking, setIsSeeking] = useState(false);

  const video = document.getElementById("video");

  if (video) {
    video.onpause = (e) => {
      clearInterval(interval);
      setPaused(true);
    };
    video.onplay = (e) => {
      if (paused) {
        interval = setInterval(() => {
          setIndex(_index + 1);
          _index++;
        }, 1000);
        setPaused(false);
      }
      if (isSeeking) {
        _index = Math.floor(video.currentTime);
        setIsSeeking(false);
      } else {
        _index = Math.floor(video.currentTime);
      }
    };
    video.onseeking = (e) => {
      setIsSeeking(true);
    };
  }

  useEffect(() => {
    axios
      .get(telemetryFile)
      .then((response) => {
        setTelemetryInfo(response.data);
        return response.data.map((d, i) => {
          return {
            ...d,
            sec: i,
          };
        });
      })
      .then((telemetryData) => {
        axios.get(loggerFile).then((response) => {
          const loggerData = response.data.map((d, i) => {
            const timeFromEventStart =
              response.data[i].time - telemetryData[0].time;
            return {
              ...d,
              timeFromEventStart: Math.floor(timeFromEventStart / 1000),
            };
          });
          setLoggerInfo(loggerData);
        });
      })
      .then(() => {
        interval = setInterval(() => {
          setIndex(_index + 1);
          _index++;
        }, 1000);
        setIsLoading(false);
      });
  }, []);

  const height = telemetryInfo[index] && telemetryInfo[index].height;
  const battery = telemetryInfo[index] && telemetryInfo[index].batStatus;

  const action =
    loggerInfo &&
    loggerInfo.length &&
    loggerInfo.find((data) => data.timeFromEventStart === index);

  return isLoading ? (
    <Loader />
  ) : (
    <>
      <StyledContainer className={className}>
        {battery ? battery : "0"}% <StyledBatteryIcon src={BatteryIcon} /> |{" "}
        {height && height > 0 ? parseFloat(height / 100) : 0}m
      </StyledContainer>
      <ActionContainer>{action && action.msg}</ActionContainer>
    </>
  );
};

const StyledContainer = styled.div`
  width: ${(props) => props.theme.sizes.videoWidth};
  color: #fff;
  z-index: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  position: absolute;
  top: 80px;
`;

const StyledBatteryIcon = styled.img`
  width: 11px;
  height: 20px;
  background-size: cover;
  margin-right: 6px;
  margin-left: 4px;
`;

const ActionContainer = styled.div`
  width: ${(props) => props.theme.sizes.videoWidth};
  color: #fff;
  z-index: 1;
  justify-content: center;
  align-items: center;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: 80px;
  text-align: center;
  font-size: 30px;
`;

export default VideoTelemetry;
