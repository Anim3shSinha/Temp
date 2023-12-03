import React, { useState } from "react";
import styled from "styled-components";
import bg from "../../../../assets/signup2.jpg";
import axios from "axios";
import { CONST } from "../../../../constants";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function SignUp() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  function SubmitSignup() {
    axios
      .post(CONST.server + "/signup", {
        name: name,
        email: email,
        password: password,
        role: role,
      })
      .then(function (response) {
        console.log(response);
        setTimeout(() => {
          window.location.href = "/login";
        }, 2000);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <React.Fragment>
      <Container>
        <Form>
          <Title style={{ color: "#3B4044" }}>Sign Up</Title>
          <Input
            type="text"
            placeholder="Name"
            value={name}
            onChange={handleNameChange}
          />
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          <Select
            value={role}
            onChange={handleRoleChange}
            style={{ width: "100%" }}
          >
            <option value="">Select Role</option>
            <option value="user">User</option>
            <option value="manager">Manager</option>
          </Select>

          <Button
            variant="contained"
            sx={{
              padding: "10px",
              margin: "10px",
              backgroundColor: "#3B4044",
              ":hover": {
                bgcolor: "#435f70",
                color: "white",
              },
            }}
            onClick={SubmitSignup}
          >
            Sign Up
          </Button>
          <br />
          <Typography
            variant="h7"
            color={"#3B4044"}
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/Login");
            }}
          >
            Login
          </Typography>
        </Form>
      </Container>
    </React.Fragment>
  );
}

export default SignUp;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: url(${bg});
  background-size: cover;
  background-position: center;
  background-color: #080e5a;
`;

const Form = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #ffffff;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0px 5px 15px rgba(0, 0, 0, 0.1);
  &:hover {
    border: 1px solid #000000;
    background-color: #fffff4;
  }
`;

const Title = styled.h1`
  color: #3f51b5;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 200px;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #a9a9a9;
  transition: border 0.3s;

  &:hover {
    border: 1px solid #3f51b5;
  }
`;

const Select = styled.select`
  width: 200px;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 5px;
  border: 1px solid #a9a9a9;
  transition: border 0.3s;

  &:hover {
    border: 1px solid #3f51b5;
  }
`;
