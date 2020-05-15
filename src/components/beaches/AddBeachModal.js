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
      beachImage
    })
      .then((response) => {
        onBeachAdd();
        message.info("Beach added");
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
        label={"Beach name"}
      >
        <Input isRequired={true} />
      </Form.Item>
      <Form.Item
        name={["lifeGuards"]}
        rules={[{ required: true, message: "Required field" }]}
        label="Life Guards"
      >
        <Select mode="multiple" disabled={isLoading}>
          {renderLifeGuardsOptions()}
        </Select>
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
        label={"Drone number"}
      >
        <Input />
      </Form.Item>
      <Form.Item name={["beachImage"]} label={"Beach image"}>
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

export default AddBeachModal;
