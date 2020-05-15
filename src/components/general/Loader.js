import React from "react";
import { Spin } from "antd";

import styled from "styled-components";

const Loader = (props) => {
  return <FullPageLoader />;
};

const FullPageLoader = styled(Spin)`
  position: absolute;
  top: calc(50% - 50px);
  left: 50%;

  .ant-spin-dot-item {
    background-color: #bcbcbc;
  }
`;

export default Loader;
