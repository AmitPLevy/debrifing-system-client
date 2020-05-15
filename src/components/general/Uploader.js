import React, { useState } from "react";
import { Upload, message } from "antd";
import styled from "styled-components";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import S3FileUpload from "react-s3";
import { consts } from "../../../src/consts";

const Uploader = ({ onChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const config = {
    bucketName: "drone-guard-assets",
    region: "eu-west-1",
    accessKeyId: consts.aws.accessKey,
    secretAccessKey: consts.aws.secretKey,
    contentType: "image/*",
  };

  const customRequest = (fileData) => {
    console.log("file:", fileData);

    S3FileUpload.uploadFile(fileData.file, config)
      .then((data) => {
        setImageUrl(data.location);
        onChange(data.location);
      })
      .catch((err) =>
        message.error("Error occurred while trying to upload file")
      );
  };

  const deleteFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setImageUrl(null);
    onChange(null);
  };

  const uploadButton = (
    <div>
      {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div className="ant-upload-text">Upload</div>
    </div>
  );
  return (
    <Upload
      listType="picture-card"
      showUploadList={false}
      customRequest={customRequest}
      transformFile={(file) => {
        return { ...file, name: "name" };
      }}
    >
      {imageUrl ? (
        <ImageContainer>
          <StyledSpan onClick={deleteFile}>x</StyledSpan>
          <img src={imageUrl} style={{ width: "100%" }} />
        </ImageContainer>
      ) : (
        uploadButton
      )}
    </Upload>
  );
};

const ImageContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  align-items: center;
`;

const StyledSpan = styled.span`
  position: absolute;
  top: -7px;
  right: -2px;
`;

export default Uploader;
