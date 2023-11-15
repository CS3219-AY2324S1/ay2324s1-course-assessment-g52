import { ClientEvents, ServerEvents } from "../utils/constants.js";
import { updateLanguage, getRoom } from "../utils/redis.js";

export const clientUpdateLanguage = async (io, socket, redis, userId) => {
    const handleUpdateLanguage = async (data) => {
        const roomId = data.roomId;
        const language = data.language;
        await updateLanguage(redis, roomId, userId, language);
        const { code } = await getRoom(redis, roomId);
        io.to(roomId).emit(ServerEvents.LANGUAGE, {
            userId,
            roomId,
            code
        });
    }
    socket.on(ClientEvents.LANGUAGE, handleUpdateLanguage);
}