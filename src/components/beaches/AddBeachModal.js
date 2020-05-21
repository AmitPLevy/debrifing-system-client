import React, { useEffect, useState } from "react";
import { Form, Button, Select as AntSelect, Alert, Upload } from "antd";
import { _get, _post } from "../../axios/index";
import styled from "styled-components";
import { Select, Input, message } from "antd";
import Uploader from "../../components/general/Uploader";

const AddBeachModal = ({ onBeachAdd }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lifeGuards, setLifeGuards] = useState([]);
  const [beachImage, setBeachImage] = useState(null);
  const [form] = Form.useForm();

  const defaultBeachImage =
    "https://drone-guard-videos.s3-eu-west-1.amazonaws.com/defaultBeachImage.jpeg";

  useEffect(() => {
    _get("/lifeGuards").then((response) => {
      setLifeGuards(response.data);
      setIsLoading(false);
    });
  }, []);

  const onSubmit = (values) => {
    const { name, droneNumber, lifeGuards } = values;
    setIsSubmitting(true);
    _post("/addBeach", {
      name,
      droneNumber,
      lifeGuards,
      image: beachImage || defaultBeachImage,
    })
      .then((response) => {
        onBeachAdd();
        message.success("Beach added");
      })
      .catch((error) => {
        setIsSubmitting(false);
        setIsLoading(false);
        message.error(error.response.data);
      });
  };

  const validateMessages = {
    required: "Required field",
  };

  const renderLifeGuardsOptions = () => {
    return lifeGuards.map((lifeGuard, i) => (
      <AntSelect.Option key={i} value={lifeGuard._id}>
        {lifeGuard.name}
      </AntSelect.Option>
    ));
  };

  const onBeachImageChange = (file) => {
    setBeachImage(file);
  };

  return (
    <Form
      name="add-beach-form"
      onFinish={onSubmit}
      validateMessages={validateMessages}
      form={form}
      layout={"vertical"}
    >
      <Form.Item
        name={["name"]}
        rules={[{ required: true, message: "Required field" }]}
      >
        <StyledInput isRequired={true} placeholder={"Beach name"} />
      </Form.Item>
      <Form.Item
        name={["lifeGuards"]}
        rules={[{ required: true, message: "Required field" }]}
      >
        <StyledSelect
          mode="multiple"
          disabled={isLoading}
          placeholder={"Life Guards"}
        >
          {renderLifeGuardsOptions()}
        </StyledSelect>
      </Form.Item>
      <Form.Item
        name={["droneNumber"]}
        rules={[
          {
            required: true,
            pattern: new RegExp("^[1-9][0-9]*$"),
            message: "Invalid drone number",
          },
        ]}
      >
        <StyledInput placeholder={"Drone number"} />
      </Form.Item>
      <Form.Item name={["beachImage"]}>
        <Uploader onChange={onBeachImageChange} />
      </Form.Item>

      <ButtonContainer>
        <StyledButton
          type="primary"
          htmlType="submit"
          loading={isSubmitting}
          disabled={isSubmitting}
        >
          Create
        </StyledButton>
      </ButtonContainer>
    </Form>
  );
};

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;
`;

const StyledButton = styled(Button)`
  background-color: #bcbcbc;
  border-color: #bcbcbc;

  :hover,
  :active,
  :focus {
    background-color: #bcbcbc;
    border-color: #bcbcbc;
  }
`;

const StyledInput = styled(Input)`
  border-radius: 4px;
  height: 40px;
`;

const StyledSelect = styled(Select)`
  border-radius: 4px;
  height: 40px;

  .ant-select-selector {
    height: 100%;
  }
`;

export default AddBeachModal;
