import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import ScrollableFeed from "react-scrollable-feed";
import moment from "moment";
import io from "socket.io-client";

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

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  border-radius: 8px;
  width: 80%;
  height: 95%;
  flex-direction: column;
  background-color: #5cb85c;
  color: white;
`;

const LogoBox = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  align-items: center;
  padding: 10px;
`;

const Image = styled.img`
  color: white;
  width: 30px;
  height: 40px;
`;

const Icon = styled.img`
  color: white;
  width: 20px;
  height: 20px;
`;
const HeadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: max-content;
  height: max-content;
  margin-left: 10px;
`;

const Heading = styled.h1`
  color: white;
`;
const LeaveChatBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: max-content;
  height: max-content;
  margin-right: 10px;
`;

const LeaveChatButton = styled.button`
  width: 100%;
  padding: 15px 20px;
  border: none;
  background-color: #529563;
  cursor: pointer;
  justify-self: center;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #fff;
`;

const MainChatBox = styled.div`
  background-color: white;
  width: 90%;
  height: 90%;
  padding: 30px 30px 0px 30px;
  max-height: 600px;
  overflow-y: scroll;
`;

const BottomBox = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
  margin-top: 10px;
  margin-bottom: 20px;
`;

const Input = styled.input`
  display: flex;
  font: inherit;
  letter-spacing: inherit;
  border: none;
  box-sizing: content-box;
  background: white;
  width: 100%;
  height: 40px;
  padding-left: 5px;
  transition: all 0.3s ease;
  color: #000;
`;

const SendBox = styled.div`
  display: flex;
  justify-content: center;
  background-color: #529563;
  cursor: pointer;
  color: white;
  font-weight: 500;
  align-items: center;
  height: 40px;
`;

const SendButton = styled.button`
  color: white;
  font-weight: 500;
  align-items: center;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #529563;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
`;

const Message = styled.div`
  padding: 10px;
  margin-bottom: 15px;
  background-color: #e6e9ff;
  border-radius: 5px;
`;

const Meta = styled.p`
  font-size: 15px;
  font-weight: bold;
  color: #7386ff;
  opacity: 0.7;
  margin-bottom: 7px;
`;

const DateStyled = styled.span`
  color: #777;
`;

const Text = styled.p`
  color: black;
`;

const Chat = () => {
  const [username, setUsername] = useState("");
  const [chat, setChat] = useState("");
  const [messages, setMesssages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [oneSelected, setOneSelected] = useState(false);

  const navigate = useNavigate();
  const socketRef = useRef(); // create  reference for the socket

  const ENDPOINT = "http://localhost:5000";

  useEffect(() => {
    const username = window.localStorage.getItem("username");
    const chat = window.localStorage.getItem("chat");

    if (!username || !chat) {
      navigate("/");
      return;
    }

    setChat(chat);
    setUsername(username);
  }, [navigate]);

  useEffect(() => {
    const messages = JSON.parse(localStorage.getItem("messages"));

    if (messages) {
      setMesssages(messages);
    }
  }, []);

  useEffect(() => {
    const username = window.localStorage.getItem("username");
    const chat = window.localStorage.getItem("chat");
    socketRef.current = io(ENDPOINT); // assign the socket value to the ref

    socketRef.current.emit("setup", username);

    socketRef.current.on("connection", () => {
      console.log("connected to socket");
    });
    socketRef.current.emit("join chat", chat);

    // cleanup function to close the socket connection
    return () => {
      socketRef.current.close();
    };
  }, []);

  useEffect(() => {
    socketRef.current.on("message received", (message) => {
      setMesssages((prevMessages) => [...prevMessages, message]);
    });
  }, []);

  //leave chat
  const leaveChat = () => {
    window.localStorage.removeItem("username");
    window.localStorage.removeItem("chat");
    navigate("/");
  };

  const addMessage = (message) => {
    setMesssages((prevState) => [...prevState, message]);
  };

  //send message
  const sendMessage = async (e) => {
    e.preventDefault();
    const messageContent = newMessage.trim();

    const username = window.localStorage.getItem("username");

    let date = new Date().toJSON();
    let content = [messageContent];

    let newMessageDetails = {
      sender: username,
      chat,
      content: content,
      date: date,
    };

    addMessage(newMessageDetails);

    if (messageContent == 1) {
      setOneSelected(true);
    }

    if (!oneSelected) {
      if (
        messageContent !== "1" &&
        messageContent !== "97" &&
        messageContent !== "98" &&
        messageContent !== "99" &&
        messageContent !== "0"
      ) {
        content = ["77"];
      }
    } else {
      if (
        messageContent !== "1" &&
        messageContent !== "2" &&
        messageContent !== "3" &&
        messageContent !== "4" &&
        messageContent !== "5" &&
        messageContent !== "6" &&
        messageContent !== "7" &&
        messageContent !== "8" &&
        messageContent !== "9" &&
        messageContent !== "97" &&
        messageContent !== "98" &&
        messageContent !== "99" &&
        messageContent !== "0"
      ) {
        content = ["77"];
      }
    }

    newMessageDetails = {
      sender: username,
      chat,
      content: content,
      date: date,
    };

    socketRef.current.emit("new message", newMessageDetails);
    setNewMessage("");

    return;
  };

  return (
    <Container>
      <Wrapper>
        <LogoBox>
          {" "}
          <HeadingContainer>
            <Image src="./images/main_logo.png" />
            <Heading>D&G Delicacy</Heading>
          </HeadingContainer>
          <LeaveChatBox>
            <LeaveChatButton onClick={leaveChat}>Leave Chat</LeaveChatButton>
          </LeaveChatBox>
        </LogoBox>
        <MainChatBox>
          <ScrollableFeed>
            <Message>
              <Meta>
                D&G Bot{" "}
                <DateStyled>
                  {" "}
                  {moment(new Date().toJSON()).format("h:mm a")}
                </DateStyled>
              </Meta>
              <Text>
                Hello {username}..Welcome to D&G delicacy
                <Icon src="./images/wave.png" />
              </Text>
              <Text>Select 1 to Place an order</Text>
              <Text>Select 99 to checkout order</Text>
              <Text>Select 98 to see order history</Text>
              <Text>Select 97 to see current order</Text>
              <Text>Select 0 to cancel order</Text>
            </Message>
            {messages &&
              messages.map((message, index) => {
                return (
                  <Message key={index}>
                    <Meta>
                      {message.sender}{" "}
                      <DateStyled>
                        {moment(message.createdAt).format("h:mm a")}
                      </DateStyled>
                    </Meta>
                    {Array.isArray(message.content) &&
                      message.content.map((content, index) => {
                        return <Text key={index}>{content}</Text>;
                      })}
                  </Message>
                );
              })}
          </ScrollableFeed>
        </MainChatBox>
        <BottomBox onSubmit={sendMessage}>
          <Input
            placeholder="Enter Message"
            type="number"
            value={newMessage}
            onChange={(e) => {
              setNewMessage(e.target.value);
            }}
            required
          />
          <SendBox>
            <SendButton type="submit">
              <Image src="./images/send.png" />
              Send
            </SendButton>
          </SendBox>
        </BottomBox>
      </Wrapper>
    </Container>
  );
};

export default Chat;
