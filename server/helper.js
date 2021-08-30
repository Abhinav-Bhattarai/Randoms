export const AddIdToRedisQueue = async (cache, MainQueue) => {
  await cache.set("MainQUEUE", JSON.stringify(MainQueue));
};

export const ImplementMassSocketConnection = async(dummy, socket) => {
  const MID_VALUE = dummy.length / 2;
  const PROVIDER_QUEUE = dummy.slice(0, MID_VALUE);
  const CONSUMER_QUEUE = dummy.slice(MID_VALUE, dummy.length);
  let providerID = 0;
  let consumerID = 0;
  for (providerID of PROVIDER_QUEUE) {
    socket.joinTwoWay(providerID.socketID, providerID.roomID);
  }
  for (consumerID in CONSUMER_QUEUE) {
    socket.joinTwoWay(CONSUMER_QUEUE[consumerID].socketID, PROVIDER_QUEUE[consumerID].roomID);
    socket.broadcast.to(PROVIDER_QUEUE[consumerID].roomID).emit('connectionReceive', PROVIDER_QUEUE[consumerID].roomID);
  }
};

export const HandleSocketDisconnection = (socket, io) => {
  const roomID = socket.handshake.query.myRoomID;
  const client = io.sockets.adapter.rooms.get(roomID);
  if (client) {
    // converting set into array;
    const clientArr = Array.from(client);
    if (clientArr.length > 0) {
      io.sockets.adapter.rooms.delete(roomID);
      io.to(clientArr[0]).emit("requestReconnection");
    }
  }
}

export const JoinCommunicationQueue = async(socket, cache, id) => {
  socket.handshake.query.myRoomID = id;
  const STRINGLIFIED_QUEUE = await cache.get("MainQUEUE");
  const MainQueue = JSON.parse(STRINGLIFIED_QUEUE);
  if (MainQueue) {
    MainQueue.push({ roomID: id, socketID: socket.id });
    AddIdToRedisQueue(cache, MainQueue);
  };
}