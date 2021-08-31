import React from "react";
import "../style.scss";
interface MessageSenderProps {
  value: string | undefined;
  Change: (event: React.ChangeEvent<HTMLInputElement>) => void;
  KeyChange: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}
export const MessageSender: React.FC<MessageSenderProps> = (props) => {
  const { value, Change, KeyChange } = props;
  return (
    <div id="messege-sender-container">
      <input
        autoComplete="off"
        value={value}
        onChange={Change}
        placeholder="Enter your message here"
        spellCheck="false"
        id="messege-sender-input"
        onKeyPress={KeyChange}
      />
    </div>
  );
};

export const MessagesArea: React.FC<{
  Reference: React.RefObject<HTMLDivElement>;
}> = ({ children, Reference }) => {
  return <main id="messages-area" ref={Reference}>{children}</main>;
};

const MessageSection: React.FC<{}> = ({ children }) => {
  return (
    <React.Fragment>
      <main id="message-section">{children}</main>
    </React.Fragment>
  );
};

export default MessageSection;
