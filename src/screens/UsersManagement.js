import React, { useEffect, useState } from "react";
import { Button, Modal, Popconfirm, Popover, Table } from "antd";
import styled from "styled-components";
import RegisterUser from "../components/users/RegisterUser";
import { _get } from "../axios";
import Loader from "../components/general/Loader";
import moment from "moment";

const UsersManagement = (props) => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userModalVisible, setUserModalVisible] = useState(false);
  const [userModalMode, setUserModalMode] = useState(null);

  const fetchUsers = () => {
    _get("/users").then((response) => {
      setUsers(response.data);
      setIsLoading(false);
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const openNewUserRegistrationModal = () => {
    setUserModalMode("new");
    setUserModalVisible(true);
  };

  const openEditUserRegistrationModal = () => {
    setUserModalMode("edit");
    setUserModalVisible(true);
  };

  const closeNewUserRegistrationModal = () => {
    setUserModalMode(null);
    setUserModalVisible(false);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, { name }) => name,
    },
    {
      title: "Email address",
      dataIndex: "email",
      key: "email",
      render: (_, { email }) => email,
    },
    {
      title: "Last login",
      dataIndex: "lastLogin",
      key: "lastLogin",
      render: (_, { lastLogin, lastRow }) =>
        lastLogin
          ? moment(lastLogin).format("MMM DD, YYYY")
          : lastRow
          ? ""
          : "-",
    },
    {
      title: "Beaches",
      dataIndex: "beaches",
      key: "beaches",
      render: (_, { beaches }) =>
        beaches
          ? beaches.map((beach, i) => (
              <span key={i}>
                {i !== 0 && ", "}
                {beach.name}
              </span>
            ))
          : "-",
    },
    {
      title: "User type",
      dataIndex: "userType",
      key: "userType",
      render: (_, { userType }) => userType,
    },
    {
      title: "",
      dataIndex: "edit",
      key: "edit",
      render: (_, { lastRow }) =>
        lastRow ? (
          <Button onClick={openNewUserRegistrationModal}>OPEN MODAL</Button>
        ) : (
          <Button onClick={openEditUserRegistrationModal}>EDIT</Button>
        ),
    },
  ];

  return isLoading ? (
    <Loader />
  ) : (
    <Container>
      <Table
        columns={columns}
        dataSource={[...users, { lastRow: true }]}
        pagination={false}
      />
      {userModalVisible && (
        <StyledModal
          onCancel={closeNewUserRegistrationModal}
          visible={userModalVisible}
          title={userModalMode === "new" ? "Create new user" : "Edit User"}
          footer={null}
        >
          <RegisterUser mode={userModalMode} />
        </StyledModal>
      )}
    </Container>
  );
};

const StyledModal = styled(Modal)`
  width: 50% !important;
`;

const Container = styled.div`
  padding: 30px 30px;
`;

export default UsersManagement;
