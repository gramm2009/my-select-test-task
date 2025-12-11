import React from "react";
import { MessageProps } from "./types";
import './styles.css';

const Message: React.FC<MessageProps> = ({ messages }) => {
  return (
    <>
      {messages.map((message: string) => {
        return <p className="message">{message}</p>;
      })}
    </>
  );
};

export default Message;
