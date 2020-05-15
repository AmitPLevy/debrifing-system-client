import React from "react";
import styled from "styled-components";

const ExpandedEvent = ({ event }) => {
  return (
    <div>
      <iframe
        width="420"
        height="315"
        src="https://www.youtube.com/embed/tgbNymZ7vqY" // TODO - change to videoUrl
      />
    </div>
  );
};

export default ExpandedEvent;
