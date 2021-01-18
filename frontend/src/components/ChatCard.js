import React from "react";
import { Comment, Tooltip, Avatar } from "antd";

function ChatCard(props) {
  //console.log(props);
  return (
    <div className="comment">
      <Comment
        author={props.sender.name + " "}
        avatar={
          <Avatar
            src={props.sender.image}
            alt={props.sender.name}
            className="avatar"
          />
        }
        content={
          props.message.substring(0, 8) === "uploads/" ? (
            // this will be either video or image

            props.message.substring(
              props.message.length - 3,
              props.message.length
            ) === "mp4" ? (
              <video
                style={{ maxWidth: "200px" }}
                src={`http://localhost:5000/${props.message}`}
                alt="video"
                type="video/mp4"
                controls
              />
            ) : (
              <img
                style={{ maxWidth: "200px" }}
                src={`http://localhost:5000/${props.message}`}
                alt="img"
              />
            )
          ) : (
            <p className="comment-text">{props.message}</p>
          )
        }
        datetime={
          <Tooltip>
            <span>
              {props.createdAt.substring(0, 10)} |{" "}
              {props.createdAt.substring(11, 16)}
            </span>
          </Tooltip>
        }
      />
    </div>
  );
}

export default ChatCard;
