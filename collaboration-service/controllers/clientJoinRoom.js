import { ClientEvents, ServerEvents } from "../utils/constants.js";
import { makeRoomId, sendErrorToClient } from "../utils/utils.js";
import { 
    createRoom,
    getRoom,
} from "../utils/redis.js";

export const clientJoinRoom = async (io, socket, redis, userId) => {
    const handleJoinRoom = async (data) => {
        const otherUserId = data.otherUserId;
        const questionId = data.questionId;
        if (!otherUserId || !questionId) {
            sendErrorToClient(io, socket, "Missing fields");

            console.error("Missing fields in join room request: " + data)
            return;
        }
        const roomId = makeRoomId(userId, otherUserId, questionId);
        const room = await getRoom(redis, roomId) 

        // If room exists,
        if (room) {
            socket.join(roomId);
            io.to(roomId).emit(ServerEvents.JOINED_ROOM, {
                userId,
                room
            });

            console.log("Room already exists for users " + userId + " and " + otherUserId + " for question " + questionId);
        } else {
            await createRoom(redis, roomId, {
                users: [userId, otherUserId],
                code: {
                    [userId]: {
                        code: "",
                        language: "javascript" // Default Javascript
                    },
                    [otherUserId]: {
                        code: "",
                        language: "javascript" // Default Javascript
                    },
                },
                id: roomId,
                questionId
            });
            const room = await getRoom(redis, roomId);
            if (room) {
                socket.join(roomId);
                io.to(roomId).emit(ServerEvents.JOINED_ROOM, {
                    userId,
                    room
                });
                
                console.log("Created room " + roomId + " for users " + userId + " and " + otherUserId + " for question " + questionId);
            } else {
                socket.emit(ServerEvents.ERROR, {
                    error: "Error creating room"
                });

                console.error("Error creating room for users " + userId + " and " + otherUserId + " for question " + questionId);
            }
            
        }
    }
    socket.on(ClientEvents.JOIN_ROOM, handleJoinRoom);
}