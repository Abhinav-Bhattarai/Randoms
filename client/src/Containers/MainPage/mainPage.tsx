import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React, { useMemo, useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Socket, io } from "socket.io-client";
import MessageSection, {
  MessagesArea,
  MessageSender,
} from "../../Components/MainPage/MessagingSection/message-section";
import Navbar from "../../Components/MainPage/Navbar/navbar";
import VideoSection, {
  Video,
} from "../../Components/MainPage/VideoSection/video-section";
import Default from "../../Components/UI/Default/default";
interface ContainerProps {
  ChangeAuthentication: (type: boolean) => void;
}

interface configType {
  userID: string;
  authToken: string;
  userName: string;
}

const FetchDatafromLocalStorage = () => {
  const userID = localStorage.getItem("userID");
  const authToken = localStorage.getItem("authToken");
  const userName = localStorage.getItem("userName");
  if (userID && authToken && userName) {
    const config = {
      userID,
      authToken,
      userName,
    };
    return config;
  }
  return null;
};

const client = new ApolloClient({
  uri: "https://localhost:8080",
  cache: new InMemoryCache(),
});

interface MessageType {
  message: string;
  id: string;
}

const MainPage: React.FC<ContainerProps> = (props) => {
  const [socket, setSocket] = useState<null | Socket>(null);
  const [userInfo, setUserInfo] = useState<configType | null>(null);
  const [conn_roomID, setroomID] = useState<string | null>(null);
  const [messageList, setMessageList] = useState<Array<MessageType>>([]);
  const messageValue = useRef<HTMLInputElement>(null);

  const ChangeMessageValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (messageValue.current) {
      messageValue.current.value = value;
    }
  };

  const KeyPressHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && socket && messageValue.current) {
      socket.emit("message", {
        roomID: conn_roomID,
        message: messageValue.current.value,
      });
      messageValue.current.value = "";
    }
  };

  const StartSocketConn = () => {
    if (socket && userInfo) {
      socket.emit("join", userInfo.userID);
    }
  };

  const ChangeSocketConn = () => {};

  useEffect(() => {
    const StorageConfig = FetchDatafromLocalStorage();
    if (StorageConfig) {
      setUserInfo(StorageConfig);
    }
  }, []);

  // socket initian conn;
  useEffect(() => {
    const ioClient = io("https://localhost:8080", {
      reconnectionDelayMax: 4000,
    });
    setSocket(ioClient);
  }, []);

  // socket listener
  useEffect(() => {
    if (socket) {
      socket.on("connectionReceive", (roomID: string) => {
        setroomID(roomID);
        socket.emit("notify-broadcaster", roomID);
      });

      socket.on("notification", (roomID: string) => {
        setroomID(roomID);
      });

      socket.on("message-receiver", (data: MessageType) => {
        const dummy = [...messageList];
        dummy.push(data);
        setMessageList(dummy);
      });

      return () => {
        socket.off("message-receiver");
        socket.off("notification");
        socket.off("connectionReceive");
      };
    }
  });

  const MessageContents = useMemo(() => {
    return (
      <React.Fragment>
        <div id="message-container">
          {messageList.map((data) => {
            return <div key={data.id} id='message-content'>{data.message}</div>;
          })}
        </div>
      </React.Fragment>
    );
  }, [messageList]);

  return (
    <React.Fragment>
      <ApolloProvider client={client}>
        <Navbar ClickStart={StartSocketConn} ClickNext={ChangeSocketConn} />
        <VideoSection>
          <Video />
          <Video />
        </VideoSection>
        <MessageSection>
          {conn_roomID !== null ? (
            <>
              <MessagesArea>{MessageContents}</MessagesArea>
              <MessageSender
                Change={ChangeMessageValue}
                value={messageValue.current?.value}
                KeyChange={KeyPressHandler}
                Reference={messageValue}
              />
            </>
          ) : (
            <Default />
          )}
        </MessageSection>
      </ApolloProvider>
    </React.Fragment>
  );
};

export default MainPage;
