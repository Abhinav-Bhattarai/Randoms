export const AddIdToRedisQueue = async (cache, MainQueue) => {
  await cache.set("MainQUEUE", JSON.stringify(MainQueue));
};

export const UpdateRedisQueue = async (cache) => {
  const UnserializedData = await cache.get("QUEUE");
  const Data = JSON.parse(UnserializedData);
  const QueueStartData = Data[0];
  Data.splice(0, 1);
  await cache.set("QUEUE", JSON.stringify(Data));
  return QueueStartData;
};

export const ImplementMassSocketConnection = async(cache, dummy, socket) => {
  await cache.set("MainQueue", JSON.stringify([]));
  const MID_VALUE = dummy.length / 2;
  const PROVIDER_QUEUE = dummy.slice(0, MID_VALUE);
  const CONSUMER_QUEUE = dummy.slice(MID_VALUE, dummy.length);
  let providerID = 0;
  let consumerID = 0;
  for (providerID of PROVIDER_QUEUE) {
    providerID.socketID.join(providerID.id);
  }
  for (consumerID in CONSUMER_QUEUE) {
    CONSUMER_QUEUE[consumerID].socket.join(PROVIDER_QUEUE[consumerID].id);
    socket.broadcast.to(PROVIDER_QUEUE[consumerID].id).emit("receiver", PROVIDER_QUEUE[consumerID].id)
  }
};
