import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React, { useMemo, useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import Peer from "simple-peer";
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
import "./mainPage.scss";
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
  self: boolean;
}

const MainPage: React.FC<ContainerProps> = (props) => {
  const [socket, setSocket] = useState<null | Socket>(null);
  const [userInfo, setUserInfo] = useState<configType | null>(null);
  const [conn_roomID, setroomID] = useState<string | null>(null);
  const [messageList, setMessageList] = useState<Array<MessageType>>([]);
  const [messageValue, setMessageValue] = useState<string>("");
  const [streamData, setStream] = useState<MediaStream | null>(null);
  const [peerData, setPeer] = useState<null | Peer.Instance>(null);
  const [requestCount, setRequestCount] = useState<number>(0);
  const MessageAreaRef = useRef<HTMLDivElement>(null);
  const MyVideoRef = useRef<HTMLVideoElement>(null);
  const PeerVideoRef = useRef<HTMLVideoElement>(null);

  const ChangeMessageValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setMessageValue(value);
  };

  const UpdateMessageList = (data: MessageType) => {
    const dummy = [...messageList];
    dummy.push(data);
    setMessageList(dummy);
    if (MessageAreaRef.current) {
      // MessageAreaRef.current.scrollTop = MessageAreaRef.current.scrollHeight + 120;
      MessageAreaRef.current.scrollTo(0, MessageAreaRef.current.scrollHeight)
    }
  };

  const InitiateVideoCall = (initiator: boolean, roomID: string) => {
    if (streamData && socket) {
      const peer = new Peer({ initiator, trickle: false, stream: streamData });
      peer.on("signal", (signalData) => {
        socket.emit("peerServer", { roomID, signalData });
      });

      peer.on("stream", (streamObj) => {
        if (PeerVideoRef.current) {
          PeerVideoRef.current.srcObject = streamObj;
        }
      });
      setPeer(peer);
    }
  };

  const KeyPressHandler = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" && socket) {
      socket.emit("message", {
        roomID: conn_roomID,
        message: messageValue,
      });
      const id = Math.floor(Math.random() * 100000000).toString();
      UpdateMessageList({ message: messageValue, id, self: true });
      setMessageValue("");
    }
  };

  const ManageMyVideoStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      if (MyVideoRef.current) {
        setStream(stream);
        MyVideoRef.current.srcObject = stream;
      }
    } catch (error) {}
  };

  const StartSocketConn = async (reconnection: boolean = false) => {
    if (socket && userInfo) {
      socket.emit("join", userInfo.userID);
      if (reconnection !== true) ManageMyVideoStream();
      setRequestCount(requestCount + 1);
    }
  };

  const ChangeSocketConn = () => {
    if (socket && userInfo) {
      socket.emit("ConnectToNewSocket", userInfo.userID, conn_roomID);
      setroomID(null);
      setMessageList([]);
      setMessageValue("");
      setRequestCount(requestCount + 1);
      if (PeerVideoRef.current) {
        PeerVideoRef.current.srcObject = null;
      }
    }
  };

  useEffect(() => {
    const StorageConfig = FetchDatafromLocalStorage();
    if (StorageConfig) {
      setUserInfo(StorageConfig);
    }
  }, []);

  // socket initial conn;
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
        InitiateVideoCall(false, roomID);
        socket.emit("notify-broadcaster", roomID);
      });

      socket.on("notification", (roomID: string) => {
        InitiateVideoCall(true, roomID);
        setroomID(roomID);
      });

      socket.on("message-receiver", (data: MessageType) => {
        UpdateMessageList({ ...data, self: false });
      });

      socket.on("peerClientConnectionHandler", (signalData) => {
        if (peerData) {
          peerData.signal(signalData);
        }
      });

      socket.on("requestReconnection", () => {
        StartSocketConn(true);
        setroomID(null);
        setMessageList([]);
        setMessageValue("");
        if (PeerVideoRef.current) {
          PeerVideoRef.current.srcObject = null;
        }
      });

      return () => {
        socket.off("message-receiver");
        socket.off("notification");
        socket.off("connectionReceive");
        socket.off("requestReconnection");
        socket.off("peerClientConnectionHandler");
      };
    }
  });

  const MessageContents = useMemo(() => {
    if (messageList.length > 0) {
      return (
        <React.Fragment>
          {messageList.map((data) => {
            return (
              <div
                key={data.id}
                id="message-container"
                className={`message-${data.self}`}
              >
                <div
                  id="message-content"
                  className={`message-content-${data.self}`}
                >
                  {data.message}
                </div>
              </div>
            );
          })}
        </React.Fragment>
      );
    }
    return null;
  }, [messageList]);

  return (
    <React.Fragment>
      <ApolloProvider client={client}>
        <Navbar
          status={requestCount >= 1}
          ClickStart={StartSocketConn}
          ClickNext={ChangeSocketConn}
        />
        <VideoSection>
          <Video muted={true} Reference={MyVideoRef} />
          <Video muted={false} Reference={PeerVideoRef} />
        </VideoSection>
        <MessageSection>
          {conn_roomID !== null ? (
            <>
              <MessagesArea Reference={MessageAreaRef}>
                {MessageContents}
              </MessagesArea>
              <MessageSender
                Change={ChangeMessageValue}
                value={messageValue}
                KeyChange={KeyPressHandler}
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

export default React.memo(MainPage);
