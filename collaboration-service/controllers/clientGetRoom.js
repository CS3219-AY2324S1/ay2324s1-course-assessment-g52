import { ClientEvents, ServerEvents } from "../utils/constants.js";
import { getRoom } from "../utils/redis.js";

export const clientGetRoom = async (io, socket, redis, userId) => {
    const handleGetRoom = async (data) => {
        console.log("Client left room: " + data);
        const roomId = data.roomId;
        const room = await getRoom(redis, roomId);
        socket.emit(ServerEvents.ROOM_STATE, {
            room
        });
    }
    socket.on(ClientEvents.GET_ROOM, handleGetRoom);
}