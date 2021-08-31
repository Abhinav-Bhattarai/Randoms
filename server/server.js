import express from "express";
import mongoose from "mongoose";
import fs from "fs";
import cors from "cors";
import https from "https";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const ExpressGraphQL = require("express-graphql").graphqlHTTP;
import depthlimit from "graphql-depth-limit";
import dotenv from "dotenv";
import redis from "async-redis";
import { Server } from "socket.io";

import AuthRoute from "./Routes/check-auth.js";
import LoginRoute from "./Routes/login.js";
import SignupRoute from "./Routes/signup.js";
import MainSchema from "./GraphQL/MainConf.js";
import {
  HandleSocketDisconnection,
  ImplementMassSocketConnection,
  JoinCommunicationQueue,
} from "./helper.js";
dotenv.config();
const cache = redis.createClient();

const PORT = 8080;
const config = {
  cert: fs.readFileSync("cert.pem"),
  key: fs.readFileSync("key.pem"),
};
const app = express();
const server = https.createServer(config, app);

// middleware
app.use(
  cors({
    origin: [
      "https://localhost:3000",
      "https://192.168.56.1:3000",
      "https://192.168.0.104:3000",
    ],
  })
);
app.use(express.json({ limit: "50mb" }));

// Socket connection
const io = new Server(server, {
  cors: {
    origin: [
      "https://localhost:3000",
      "https://192.168.56.1:3000",
      "https://192.168.0.104:3000",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("join", async (userID) => {
    const IntervalProcessing = await cache.get("IntervalProcessing");
    if (IntervalProcessing === "false") {
      await cache.set("IntervalProcessing", true);
      setInterval(async () => {
        const QUEUE = await cache.get("MainQUEUE");
        const dummy = [...JSON.parse(QUEUE)];
        if (dummy.length > 1) {
          if (dummy.length % 2 === 0) {
            await cache.set("MainQUEUE", JSON.stringify([]));
            ImplementMassSocketConnection(dummy, socket);
          } else {
            await cache.set(
              "MainQUEUE",
              JSON.stringify([dummy[dummy.length - 1]])
            );
            dummy.pop();
            ImplementMassSocketConnection(dummy, socket);
          }
        }
      }, 5000);
    }
    JoinCommunicationQueue(socket, cache, userID);
  });

  socket.on("notify-broadcaster", (roomID) => {
    socket.handshake.query.myRoomID = roomID;
    socket.broadcast.to(roomID).emit("notification", roomID);
  });

  socket.on("peerServer", (data) => {
    const { roomID, signalData } = data;
    socket.broadcast.to(roomID).emit("peerClientConnectionHandler", signalData);
  });

  socket.on("message", (data) => {
    const { roomID, message } = data;
    console.log(roomID, message);
    const id = Math.floor(Math.random() * 100000000).toString();
    socket.broadcast.to(roomID).emit("message-receiver", { message, id });
  });

  socket.on("ConnectToNewSocket", async(userID, roomID) => {
    socket.leave(roomID);
    HandleSocketDisconnection(socket, io);
    JoinCommunicationQueue(socket, cache, userID);
  });

  socket.on("disconnect", () => {
    HandleSocketDisconnection(socket, io);
  });
});

// GraphQL
app.use(
  "/graphql",
  ExpressGraphQL({
    graphiql: true,
    schema: MainSchema,
    validationRules: [depthlimit(2)],
  })
);

// RestAPI
app.use("/checkAuth", AuthRoute);
app.use("/login", LoginRoute);
app.use("/signup", SignupRoute);

// DB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Connected to mongoDB");
  })
  .catch(() => {
    console.log("Did not connect to mongoDB");
  });

// main listener
server.listen(PORT, () => {
  console.log(`Connected to localhost:${PORT}`);
});