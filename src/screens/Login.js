import React, { useState } from "react";
import styled from "styled-components";
import { useAuth } from "../context/auth";
import { Redirect } from "react-router-dom";
import { _post } from "../axios";
import { Form, Input, Button } from "antd";

import backgroundImage from "../assets/bg.png";
import LogoImg from "../assets/Logo.png";

const Login = (props) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { setAuthToken } = useAuth();

  const { previousLocation } = props.location.state || "/";

  const postLogin = (email, password) => {
    setIsLoading(true);
    _post("/login", {
      email,
      password,
    })
      .then((response) => {
        if (response.status === 200) {
          setAuthToken(response.data.token);
          setLoggedIn(true);
        } else {
          setIsLoading(false);
          setError(response.data);
        }
      })
      .catch((error) => {
        setIsLoading(false);
        setError(error.response.data);
      });
  };

  if (isLoggedIn) {
    return <Redirect to={previousLocation} />;
  }

  const onSubmit = (values) => {
    const { email, password } = values.user;
    postLogin(email, password);
  };

  const validateMessages = {
    required: "Required field",
  };

  return (
    <LoginContainer>
      <Card>
        <Logo src={LogoImg} />
        <StyledForm
          name="login-form"
          onFinish={onSubmit}
          validateMessages={validateMessages}
          layout={"vertical"}
        >
          <StyledFormItem name={["user", "email"]} rules={[{ required: true }]}>
            <StyledInput type="email" placeholder="Email" />
          </StyledFormItem>
          <StyledFormItem
            name={["user", "password"]}
            rules={[{ required: true }]}
          >
            <StyledInput type="password" placeholder="Password" />
          </StyledFormItem>
          {!!error && <Error>{error}</Error>}
          <StyledButton loading={isLoading} type="primary" htmlType="submit">
            Sign In
          </StyledButton>
        </StyledForm>
      </Card>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  box-sizing: border-box;
  width: 100vw;
  height: 100vh;
  margin: 0 auto;
  background-image: url(${backgroundImage});
  background-repeat: no-repeat;
  background-size: cover;
  background-position: bottom;
  color: #fff;
  font-size: 17px;
`;

const Card = styled.div`
  position: relative;
  top: 50%;
  transform: translateY(-50%);
  box-sizing: border-box;
  width: 28%;
  min-width: 350px;
  height: 70%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  border-radius: 8px;
  z-index: 2;
  background-color: rgba(255, 255, 255, 0.2);

  label {
    font-size: 17px;
  }
`;

const Logo = styled.img`
  max-width: 70%;
`;



const StyledForm = styled(Form)`
  width: 60%;
  height: 40%;
  display: flex;
  flex-direction: column;
  justify-contanet: center;

  .ant-form-item-explain {
      font-size: 12px;
      position: absolute;
      color: red;
      margin-top: 48px;
      margin-left: 2px;
    }
`;
  
  const StyledFormItem = styled(Form.Item)`
  // margin-top: 25px;
  `;
  
  const StyledInput = styled(Input)`
    width: 100%;
    height: 40px;
    background: transparent;
    border: none;
    border-bottom: 1px solid #fff;
    font-size: 15px;
    color: #fff;
  
    ::placeholder {
      color: rgba(255, 255, 255, .8);
    }
    
    :focus {
      outline: none;
    }
    
    :hover,
    :active,
    :visited {
      border-bottom: 1px solid #fff;
    }
  `;

const StyledButton = styled(Button)`
  width: 60%;
  height: 40px;
  border: 2px solid #fff;
  border-radius: 20px;
  margin-top: 20px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  background-color: transparent;
  color: #fff;
  cursor: pointer;
  font-size: 17px;
  min-width: 130px;

  :hover,
  :active,
  :focus {
    background-color: #fff;
    color: #000;
    border-color: #fff;
  }

  .anticon-loading {
    padding-right: 10px;
  }

  :focus {
    outline: 0;
  }
`;

const Error = styled.div`
  width: 120%;
  color: red;
  margin-top: 30px;
`;

export default Login;
