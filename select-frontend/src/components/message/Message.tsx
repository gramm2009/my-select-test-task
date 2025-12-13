import React from "react";
import { MessageProps } from "./types";
import "./styles.css";

const Message: React.FC<MessageProps> = ({ messages }) => {
  return (
    <>
      {messages.map((message: string, index: number) => {
        return (
          <p className="message" key={`${message}-${index}`}>
            {message}
          </p>
        );
      })}
    </>
  );
};

export default Message;
