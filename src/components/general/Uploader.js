import React, { useState } from "react";
import { Upload, message } from "antd";
import styled from "styled-components";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { consts } from "../../../src/consts";
import S3 from "react-aws-s3";

const Uploader = ({ onChange }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState();

  const config = {
    bucketName: "drone-guard-videos",
    region: "eu-west-1",
    accessKeyId: consts.aws.accessKey,
    secretAccessKey: consts.aws.secretKey,
    contentType: "image/*",
  };

  const customRequest = (fileData) => {
    setIsLoading(true);
    const { file } = fileData;

    const ReactS3Client = new S3(config);
    const newFileName = `${file.name}.${Date.now()}`;

    ReactS3Client.uploadFile(file, newFileName)
      .then((data) => {
        setImageUrl(data.location);
        onChange(data.location);
        setIsLoading(false);
        console.log('data.location:', data.location);
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
    <StyledUpload
      listType="picture-card"
      showUploadList={false}
      customRequest={customRequest}
      disabled={isLoading || imageUrl}
    >
      {imageUrl ? (
        <ImageContainer>
          <StyledSpan onClick={deleteFile}>x</StyledSpan>
          <img src={imageUrl} style={{ width: "100%" }} />
        </ImageContainer>
      ) : (
        uploadButton
      )}
    </StyledUpload>
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

const StyledUpload = styled(Upload)`
  .ant-upload.ant-upload-select-picture-card {
    background-color: transparent;
  }
`;

export default Uploader;
