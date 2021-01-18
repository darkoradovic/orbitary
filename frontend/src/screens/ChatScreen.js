import React, { useState, useEffect, useRef } from "react";
import { Form, Input, Button, Row, Col } from "antd";
import {
  EnterOutlined,
  UploadOutlined,
  MessageFilled,
  SendOutlined,
} from "@ant-design/icons";
import Icon from "@ant-design/icons";
import io from "socket.io-client";
import { connect } from "react-redux";
import moment from "moment";
import { getChats, afterPostMessage } from "../actions/chatActions";
import ChatCard from "../components/ChatCard";
import Dropzone from "react-dropzone";
import Axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import ScrollToBottom from "react-scroll-to-bottom";

let socket;

const ChatScreen = (props) => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const ENDPOINT = "http://localhost:5000";

  const userLogin = useSelector((state) => state.userLogin);
  const { loading, error, userInfo } = userLogin;

  const chatMessage = useSelector((state) => state.chatMessage);
  const { chats } = chatMessage;

  let isSendByCurrentUser = false
  const trimmedName = userInfo.name
  console.log(trimmedName)

  if(userInfo.name === trimmedName){
    isSendByCurrentUser = true
  }

  useEffect(() => {
    dispatch(getChats());

    socket = io(ENDPOINT);
    console.log(socket);

    socket.on("Output Chat Message", (messageFromBackEnd) => {
      console.log(messageFromBackEnd);
      dispatch(afterPostMessage(messageFromBackEnd));
      
    });
  }, [ENDPOINT, dispatch]);

  /* const renderCards = () => {
    if(chats){
      chats.map((chat) => <ChatCard key={chat._id} {...chat} />)
    }
    return <h1>No chats</h1>
  }; */

  const onDrop = (files) => {
    console.log(files);
    let formData = new FormData();

    const config = {
      header: { "content-type": "multipart/form-data" },
    };

    formData.append("file", files[0]);

    Axios.post("api/chat/uploadfiles", formData, config).then((response) => {
      if (response.data.success) {
        let chatMessage = response.data.url;
        let userId = userInfo._id;
        let userName = userInfo.name;
        let userImage = userInfo.image;
        let nowTime = moment();
        let type = "VideoOrImage";

        socket.emit("Input Chat Message", {
          chatMessage,
          userId,
          userName,
          userImage,
          nowTime,
          type,
        });
      }
    });
  };

  const submitChatMessage = (e) => {
    e.preventDefault();

    let chatMessage = message;
    let userId = userInfo._id;
    let userName = userInfo.name;
    let userImage = userInfo.image;
    let nowTime = moment();
    let type = "Text";

    socket.emit("Input Chat Message", {
      chatMessage,
      userId,
      userName,
      userImage,
      nowTime,
      type,
    });
    setMessage("");
  };

  return (
    <React.Fragment>
      <div>
        <p style={{ fontSize: "2rem", textAlign: "center", marginTop: "30px" }}>
          Share with us what's on your mind.
        </p>
      </div>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {isSendByCurrentUser ? (
          <ScrollToBottom
          className="infinite-container justifyEnd"
          style={{ height: "500px", overflowY: "scroll" }}
        >
          {chats && chats.map((chat) => <ChatCard key={chat._id} {...chat} />)}
        </ScrollToBottom>
        ) : (
          <ScrollToBottom
            className="infinite-container justifyStart"
            style={{ height: "500px", overflowY: "scroll" }}
          >
            {chats && chats.map((chat) => <ChatCard key={chat._id} {...chat} />)}
          </ScrollToBottom>
        )}
          
        

        <Row>
          <Form
            layout="inline"
            onSubmit={submitChatMessage}
            style={{
              marginTop: "50px",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Col style={{ width: "80%" }}>
              <input
                style={{ borderBottom: "2px solid black", color: "black" }}
                id="message"
                prefix={<MessageFilled style={{ color: "rgba(0,0,0,.25)" }} />}
                placeholder="Type message"
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </Col>
            <Col>
              <button
                className="btn-enter"
                onClick={submitChatMessage}
                type="submit"
                disabled={!message}
              >
                <SendOutlined />
              </button>
            </Col>
            <Col>
              <Dropzone onDrop={onDrop}>
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <button className="btn-upload">
                        <UploadOutlined />
                      </button>
                    </div>
                  </section>
                )}
              </Dropzone>
            </Col>
          </Form>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default ChatScreen;
