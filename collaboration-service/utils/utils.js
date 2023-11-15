import { createHash } from "crypto";
import { ServerEvents } from "./constants.js";

export const sendErrorToClient = (io, socket, error) => {

    io.to(socket.id).emit(ServerEvents.ERROR, {
        error: error
    });
}

export const makeRoomId = (userId, otherUserId, questionId) => {
    const arr = [userId, otherUserId].sort();
    return createHash('md5').update(arr[0] + arr[1] + questionId).digest('hex');
}