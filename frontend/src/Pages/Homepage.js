import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const Container = styled.div`
  display: flex;
  width: 100vw;
  height: 100vh;
  justify-content: center;
  align-items: center;
  background-image: url(./images/food_background.jpg);
  background-size: cover;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const Wrapper = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px;
  width: 60%;
  height: 55%;
  flex-direction: column;
  background-color: #5cb85c;
  color: white;
  margin-top: -20px;
`;

const Logo = styled.img`
  color: white;
  width: 30px;
  height: 40px;
`;

const HeadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: max-content;
  margin-top: -50px;
`;

const Heading = styled.h1`
  color: white;
`;

const UsernameBox = styled.div`
  display: flex;
  flex-direction: column;
  width: 80%;
  margin: 10px;
  padding: 0px 20px;
`;
const Label = styled.div`
  font-size: 500;
  color: white;
`;

const Input = styled.input`
  display: flex;
  font: inherit;
  letter-spacing: inherit;
  border: none;
  box-sizing: content-box;
  background: white;
  border-radius: 5px;
  width: 100%;
  padding-left: 8px;
  height: 40px;
  transition: all 0.3s ease;
  color: #000;
  margin-top: 5px;
`;

const Button = styled.button`
  width: 100%;
  padding: 15px 20px;
  border: none;
  background-color: #529563;
  cursor: pointer;
  justify-self: center;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: white;
`;

const ButtonContainer = styled.div`
  margin-top: 20px;
  width: 75%;
`;
const Homepage = () => {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const username = window.localStorage.getItem("username");
    if (username) {
      navigate("/chat");
    }
  }, [navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      setTimeout(async () => {
        const res = await axios
          .post(`http://localhost:5000/api/chats`, {
            username,
          })
          .catch((e) => {
            const error = (e.response && e.response.data) || e.message;
            setIsLoading(false);
            notifyError(error);
            console.log(error);
          });
        if (res) {
          const data = res.data;
          window.localStorage.setItem("username", data.user);
          window.localStorage.setItem("chat", data._id);

          navigate("/chat");
          setIsLoading(false);
        }
      }, 3000);
    } catch (e) {
      const error = (e.response && e.response.data) || e.message;
      setIsLoading(false);
      notifyError(error);
      console.log(error);
    }
  };

  //notification for error
  const notifyError = (message) => {
    toast.error(message, {
      position: toast.POSITION.TOP_CENTER,
      autoClose: false,
    });
  };
  return (
    <Container>
      <Wrapper onSubmit={handleSubmit}>
        <HeadingContainer>
          <Logo src="./images/main_logo.png" />
          <Heading>D&G Delicacy</Heading>
        </HeadingContainer>
        <UsernameBox>
          <Label>Username</Label>
          <Input
            placeholder="Enter Username"
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            type="text"
            required
          />
        </UsernameBox>
        <ButtonContainer>
          {!isLoading && <Button type="submit">Join Chat</Button>}
          {isLoading && (
            <Button disabled>
              <ClipLoader
                color={"#fff"}
                loading={isLoading}
                css={override}
                size={30}
                aria-label="Loading Spinner"
              />{" "}
            </Button>
          )}
        </ButtonContainer>
      </Wrapper>
    </Container>
  );
};

export default Homepage;
