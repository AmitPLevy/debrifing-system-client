import React from "react";
import styled from "styled-components";
import LogoImg from "../../assets/Logo_Black.png";
import { useHistory } from "react-router-dom";
import { useAuth } from "../../context/auth";
import { Avatar, Dropdown, Menu } from "antd";
import { UserOutlined } from "@ant-design/icons";


const Header = ({ className }) => {
  const { setAuthToken } = useAuth();
  const history = useHistory();
  const location = history.location.pathname;

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem("token");
  };

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <span
          onClick={(e) => {
            logout();
            e.preventDefault();
          }}
        >
          LogOut
        </span>
      </Menu.Item>
    </Menu>
  );

  return (
    <StyledHeader className={className} location={location}>
      <Logo src={LogoImg} onClick={() => history.push("/")} />
      <Dropdown overlay={menu} trigger={"click"}>
        <StyledAvatar icon={<UserOutlined />} size={50} src={undefined} />
        {/* TODO- change to user image*/}
      </Dropdown>
    </StyledHeader>
  );
};

const StyledHeader = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  // background-color: rgba(100, 100, 100, 1);
  // background-color: #f3f3f3;
  background: transparent;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  position: fixed;
`;

const Logo = styled.img`
  width: 100px;
  height: 70px;
  cursor: pointer;
  margin-left: 50px;
`;

const StyledAvatar = styled(Avatar)`
  cursor: pointer;
  margin-right: 50px;
`;

export default Header;
