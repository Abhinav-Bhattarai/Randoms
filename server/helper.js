export const AddIdToRedisQueue = async(id) => {
    await cache.set("QUEUE", JSON.stringify([id]));
};

export const UpdateRedisQueue = async(cache) => {
    const UnserializedData = await cache.get('QUEUE');
    const Data = JSON.parse(UnserializedData);
    const QueueStartData = Data[0];
    Data.splice(0, 1);
    await cache.set('QUEUE', JSON.stringify(Data));
    return QueueStartData;
}