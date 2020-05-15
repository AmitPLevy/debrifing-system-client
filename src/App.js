import React, { useState } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { AuthContext } from "./context/auth";
import PrivateRoute from "./PrivateRoute";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme";

import Logger from "./screens/Logger";
import Login from "./screens/Login";
import Debriefing from "./screens/Debriefing";
import styled from "styled-components";
import Header from "./components/general/Header";

const App = (props) => {
  const existingToken = JSON.parse(localStorage.getItem("token"));
  const [authToken, setAuthToken] = useState(existingToken);

  const setToken = (data) => {
    localStorage.setItem("token", JSON.stringify(data));
    setAuthToken(data);
  };

  return (
    <AuthContext.Provider value={{ authToken, setAuthToken: setToken }}>
      <ThemeProvider theme={theme}>
        <Router>
          {!!authToken && <StyledHeader />}
          <Container withTop={!!authToken}>
            <Route path="/login" component={Login} />
            <PrivateRoute exact path="/" component={Debriefing} />
            <PrivateRoute path="/logger" component={Logger} />
          </Container>
        </Router>
      </ThemeProvider>
    </AuthContext.Provider>
  );
};

const StyledHeader = styled(Header)`
  position: fixed;
  z-index: 1;
`;

const Container = styled.div`
  position: relative;
  top: ${(props) => props.withTop && "100px"};
  height: ${(props) => props.withTop && props.theme.sizes.containerHeight};
  background-color: #f3f3f3;
`;

export default App;
