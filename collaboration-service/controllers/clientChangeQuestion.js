import { ClientEvents, ServerEvents } from "../utils/constants.js";
import { changeQuestionStatus, getRoom } from "../utils/redis.js";

export const clientChangeQuestion = async (io, socket, redis, userId) => {
   const handleChangeQuestion = async (data) => {
       const otherUserId = data.otherUserId;
       if (!otherUserId) {
           sendErrorToClient(io, socket, "Missing fields");

           console.error("Missing fields in change question request: " + data)
           return;
       }
       const roomId = data.roomId;
       io.to(roomId).emit(ServerEvents.CHANGE_REQUEST, { 
           userId,
           roomId
       });
       await changeQuestionStatus(redis, roomId, userId, true);
       console.log("change status 1 to true")
       const room = await getRoom(redis, roomId);
       // Check if both users have confirmed the change in Redis
       const changeQuestionIdUser1 = userId + "ChangeConfirmation"
       const changeQuestionIdUser2 = otherUserId + "ChangeConfirmation"
       const user1Confirmation = room[changeQuestionIdUser1]
       const user2Confirmation = room[changeQuestionIdUser2]
       console.log("user 1 status: " + user1Confirmation)
       console.log("user 2 status: " + user2Confirmation)
   }
   socket.on(ClientEvents.CHANGE_QUESTION, handleChangeQuestion);
}