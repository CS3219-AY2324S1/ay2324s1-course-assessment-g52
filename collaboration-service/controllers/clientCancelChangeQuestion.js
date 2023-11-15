 import { ClientEvents, ServerEvents } from "../utils/constants.js";
 import { changeQuestionStatus} from "../utils/redis.js";
 

export const clientCancelChangeQuestion = async (io, socket, redis, userId) => {
    const handleCancelChangeQuestion = async (data) => {
        const otherUserId = data.otherUserId;
        if (!otherUserId) {
            sendErrorToClient(io, socket, "Missing fields");

            console.error("Missing fields in change question request: " + data)
            return;
        }
        const roomId = data.roomId;
        // User cancels the change request
        await changeQuestionStatus(redis, roomId, userId, false);
        await changeQuestionStatus(redis, roomId, otherUserId, false);
        // Emit a cancelChange event to all users
        io.to(roomId).emit(ServerEvents.CANCEL_CHANGE_REQUEST, { 
            userId,
            roomId
        });
        console.log("change both status to false")
    }
    socket.on(ClientEvents.CANCEL_CHANGE_QN, handleCancelChangeQuestion);
}