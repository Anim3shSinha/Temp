import React, { useState } from "react";
import styled from "styled-components";
import bg from "../../../../assets/signup2.jpg";
import axios from "axios";
import { CONST } from "./../../../../constants";
import { useValue } from "../../../../contexts/ValueContext";

import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const { setUserType, setUserId } = useValue();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [load, setload] = useState(false);
  const navigate = useNavigate();

  const [selectedOption, setSelectedOption] = useState("");

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleSelectChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const userFunc = async (name, email) => {
    try {
      const userData = {
        name: name,
        email: email,
      };

      const response = await axios.post(
        `${CONST.server}/add_client`,
        // `http://localhost:5000/add_client`,
        userData
      );
      setUserId(response.data.clientId);
      await localStorage.setItem("userId", response.data.clientId);
    } catch (error) {
      console.error("Error adding client:", error);
    }
  };

  const handleGetManagerId = async (email) => {
    try {
      const response = await axios.post(
        // `http://localhost:5000/get_manager_by_email`,
        `${CONST.server}/get_manager_by_email`,
        {
          email: email,
        }
      );
      setUserId(response.data.managerId);
      await localStorage.setItem("userId", response.data.managerId);
    } catch (error) {
      console.error("Error fetching manager ID:", error);
    }
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };
  function handleLogin() {
    setload(true);

    axios
      .post(CONST.server + "/login", {
        email: email,
        password: password,
      })
      .then(async (response) => {
        console.log(response.data);

        async function setDetails() {
          setUserType(selectedOption);
          if (selectedOption == "Client") {
            userFunc(response.data.name, response.data.email);
          } else {
            handleGetManagerId(response.data.email);
          }
          await localStorage.setItem("uid", response.data.id);
          await localStorage.setItem("uname", response.data.name);
          await localStorage.setItem("email", response.data.email);
          await localStorage.setItem("role", response.data.role);
          await localStorage.setItem("manager", response.data.manager);
          await localStorage.setItem("userType", selectedOption);
        }

        await setDetails();

        setTimeout(() => {
          navigate("/home/Dashboard");
        }, 100);
      })
      .catch((err) => {});
  }

  return (
    <>
      <Container>
        <Form>
          <Title style={{ color: "#3B4044" }}>Login</Title>
          {load ? (
            <Box sx={{ width: "100%" }}>
              <LinearProgress /> <br />
            </Box>
          ) : null}
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

          <select value={selectedOption} onChange={handleSelectChange}>
            <option value="">Select an option</option>
            <option value="Admin">Super Admin</option>
            <option value="Manager">Manager</option>
            <option value="Client">Client</option>
          </select>

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
            disabled={!selectedOption}
            onClick={handleLogin}
          >
            Login
          </Button>
          <br />

          <Typography
            variant="h7"
            color={"#3B4044"}
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/signup");
            }}
          >
            Signup
          </Typography>
          <Typography
            variant="h7"
            color={"#3B4044"}
            style={{ cursor: "pointer" }}
            onClick={() => {
              navigate("/");
            }}
          >
            Back To Home
          </Typography>
        </Form>
      </Container>
    </>
  );
}

export default Login;

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
  margin-bottom: 50px;
  margin-top: 0px;
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
