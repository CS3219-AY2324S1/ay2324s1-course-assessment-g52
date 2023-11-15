import { ClientEvents, ServerEvents } from "../utils/constants.js";

export const clientLeaveRoom = async (io, socket, redis, userId) => {
    const handleLeaveRoom = async (data) => {
        console.log("Client left room: " + data);
        const roomId = data.roomId;
        io.to(roomId).emit(ServerEvents.LEFT_ROOM, {
            userId,
            roomId
        });
        socket.leave(roomId);
    }
    socket.on(ClientEvents.LEAVE_ROOM, handleLeaveRoom);
}