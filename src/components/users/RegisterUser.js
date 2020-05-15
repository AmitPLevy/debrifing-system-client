import React, { useState } from "react";
import { Button, Form, Input, Modal } from "antd";
import styled from "styled-components";

const RegisterUser = ({ mode }) => {
  const onSubmit = (values) => {
    console.log("values:", values);
  };

  const validateMessages = {
    required: "Required field",
  };

  return (
    <StyledForm
      name="login-form"
      onFinish={onSubmit}
      validateMessages={validateMessages}
      layout={"vertical"}
    >
      <StyledFormItem
        name={["user", "email"]}
        label="Email"
        rules={[{ required: true, message: "Required field" }]}
      >
        <StyledInput type="email" placeholder="email" />
      </StyledFormItem>
      <StyledFormItem
        name={["user", "password"]}
        label="Password"
        rules={[{ required: true }]}
      >
        <StyledInput type="password" placeholder="password" />
      </StyledFormItem>
      <StyledButton type="primary" htmlType="submit">
        {mode === "new" ? "Create" : "Edit"}
      </StyledButton>
    </StyledForm>
  );
};

const StyledForm = styled(Form)`
  .ant-form-item-explain {
    font-size: 12px;
    position: absolute;
    color: red;
    padding-top: 5px;
  }
`;

const StyledFormItem = styled(Form.Item)`
  margin-top: 25px;
`;

const StyledInput = styled(Input)`
  width: 100%;
  height: 20px;
  border: 4px solid #fff;
  border-radius: 4px;
  margin-top: 10px;
`;

const StyledButton = styled(Button)`
  width: 50%;
  border: 2px solid #fff;
  border-radius: 4px;
  margin-top: 40px;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  background-color: transparent;
  height: 30px;
  color: #fff;
  font-size: 17px;
  cursor: pointer;

  .anticon-loading {
    padding-right: 10px;
  }

  :focus {
    outline: 0;
  }
`;

export default RegisterUser;
