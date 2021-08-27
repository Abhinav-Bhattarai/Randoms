import React from "react";

interface MessageSenderProps {
  value: string | undefined;
  Change: (event: React.ChangeEvent<HTMLInputElement>) => void;
  KeyChange: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  Reference: React.RefObject<HTMLInputElement>
}
export const MessageSender: React.FC<MessageSenderProps> = (props) => {
  const { value, Change, KeyChange, Reference } = props;
  return (
    <div id="messege-sender-container">
      <input
        value={value}
        onChange={Change}
        placeholder="Enter your message here"
        spellCheck="false"
        id="messege-sender-input"
        onKeyPress={KeyChange}
        ref={Reference}
      />
    </div>
  );
};

export const MessagesArea: React.FC<{}> = ({ children }) => {
  return <main id="messages-area">{children}</main>;
};

const MessageSection: React.FC<{}> = ({ children }) => {
  return (
    <React.Fragment>
      <main id="message-section">{children}</main>
    </React.Fragment>
  );
};

export default MessageSection;
