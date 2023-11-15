import { ClientEvents, ServerEvents, ServerErrors } from "../utils/constants.js";
import { changeQuestionStatus, getRoom } from "../utils/redis.js";
import {qst} from "../app.js";


export const clientConfirmChange = async (io, socket, redis, userId) => {
   const handleChangeQuestion = async (data) => {
       const otherUserId = data.otherUserId;
       if (!otherUserId) {
           sendErrorToClient(io, socket, "Missing fields");

           console.error("Missing fields in change question request: " + data)
           return;
       }
       const roomId = data.roomId;

       // User 2 confirms the change
       // Set a flag in Redis to indicate the request is confirmed for User 2
       await changeQuestionStatus(redis, roomId, userId, true);
       console.log("change status 2 to true")

       const changeQuestionIdUser1 = userId + "ChangeConfirmation"
       const changeQuestionIdUser2 = otherUserId + "ChangeConfirmation"
       const room = await getRoom(redis, roomId);
       const oldQuestionId = room.questionId;
       // Check if both users have confirmed the change in Redis
       const user1Confirmation = room[changeQuestionIdUser1]
       const user2Confirmation = room[changeQuestionIdUser2]
       console.log("user 1 status: " + user1Confirmation)
       console.log("user 2 status: " + user2Confirmation)
       if (user1Confirmation && user2Confirmation) {
           // Get the new question ID
           await qst.getNewQuestion(oldQuestionId).then
           (async (newQuestionId) => {
               // Emit the new question ID to both users   
               io.to(roomId).emit(ServerEvents.QUESTION_CHANGED, { newQuestionId });
               // Reset the flags in Redis for the next change request
               await changeQuestionStatus(redis, roomId, userId, false);
               await changeQuestionStatus(redis, roomId, otherUserId, false);
               const room = await getRoom(redis, roomId);
               // Check if both users have changed back to false in Redis
               const user1Status = room[changeQuestionIdUser1]
               const user2Status = room[changeQuestionIdUser2]
               console.log("user 1 status after new question: " + user1Status)
               console.log("user 2 status after new question: " + user2Status)
           })
           .catch(async (err) => {
               io.to(roomId).emit(ServerErrors.NO_NEW_QUESTION, { 
                   userId,
                   roomId
               });
               await changeQuestionStatus(redis, roomId, userId, false);
               await changeQuestionStatus(redis, roomId, otherUserId, false);
           }); // Get the new question ID logic here

       } else {
           io.to(roomId).emit(ServerEvents.CANCEL_CHANGE_REQUEST, { 
               userId,
               roomId
           });
           await changeQuestionStatus(redis, roomId, userId, false);
           await changeQuestionStatus(redis, roomId, otherUserId, false);
       }
   }
   socket.on(ClientEvents.CONFIRM_CHANGE_QN, handleChangeQuestion);
}
