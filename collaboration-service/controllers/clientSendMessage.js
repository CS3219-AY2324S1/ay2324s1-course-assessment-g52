import { ClientEvents, ServerEvents } from "../utils/constants.js";
import { addMessage, getRoom } from "../utils/redis.js";

export const clientSendMessage = async (io, socket, redis, userId) => {
    const handleSendMessage = async (data) => {
        const roomId = data.roomId;
        const message = data.message;
        await addMessage(redis, roomId, userId, message);
        const { messages } = await getRoom(redis, roomId);
        io.to(roomId).emit(ServerEvents.MESSAGE, {
            userId,
            roomId,
            messages
        });
    }
    socket.on(ClientEvents.MESSAGE, handleSendMessage);
}