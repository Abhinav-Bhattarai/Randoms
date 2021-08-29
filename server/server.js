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
import { AddIdToRedisQueue, ImplementMassSocketConnection } from "./helper.js";
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
  socket.on("join", async (id) => {
    socket.handshake.query.myRoomID = id;
    const STRINGLIFIED_QUEUE = await cache.get("MainQUEUE");
    const MainQueue = JSON.parse(STRINGLIFIED_QUEUE);
    if (MainQueue) {
      MainQueue.push({ roomID: id, socketID: socket.id });
      AddIdToRedisQueue(cache, MainQueue);
    }
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
    const id = Math.floor(Math.random() * 100000000).toString();
    socket.broadcast.to(roomID).emit("message-receiver", { message, id });
  });

  socket.on("disconnect", () => {
    const roomID = socket.handshake.query.myRoomID;
    const client = io.sockets.adapter.rooms.get(roomID);
    if (client) {
      const clientArr = Array.from(client);
      if (clientArr.length > 0) {
        if (io.sockets.sockets.get(clientArr[0])) {
          io.sockets.sockets.get(clientArr[0]).leave(roomID);
        }
        io.to(clientArr[0]).emit("requestReconnection");
      }
    }
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
