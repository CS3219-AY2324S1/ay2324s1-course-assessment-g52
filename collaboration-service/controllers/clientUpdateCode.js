import { ClientEvents, ServerEvents } from "../utils/constants.js";
import { updateCode, getRoom } from "../utils/redis.js";

export const clientUpdateCode = async (io, socket, redis, userId) => {
    const handleUpdateCode = async (data) => {
        const roomId = data.roomId;
        const newCode = data.code;
        await updateCode(redis, roomId, userId, newCode);
        const { code } = await getRoom(redis, roomId);
        io.to(roomId).emit(ServerEvents.CODE, {
            userId,
            roomId,
            code
        });
    }
    socket.on(ClientEvents.CODE, handleUpdateCode);
}