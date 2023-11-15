import { createClient } from 'redis';

const stringify = data => JSON.stringify(data);
const jsonify = s => JSON.parse(s);
const roomKey = (key) => "r(" + key + ")";

const DEFAULT_ROOM_DETAILS = {
    messages: [],
}

export const createRedisClient = async () => {
    const redisClient = createClient({ 
        url: process.env.IS_LOCAL ? '' : 'redis://redis'
     });
    await redisClient.connect();
    return redisClient;
}

export const createRoom = async (redisClient, roomId, roomDetails) => {
    console.log("Creating room " + roomKey(roomId))
    return redisClient.set(roomKey(roomId), stringify({
        ...DEFAULT_ROOM_DETAILS,
        ...roomDetails,
    }));
}

export const getRoom = async (redisClient, roomId) => {
    return jsonify(await redisClient.get(roomKey(roomId)));
}

export const addMessage = async (redisClient, roomId, userId, message) => {
    const room = await getRoom(redisClient, roomId);
    const newRoomDetails = {
        ...room,
        messages: [
            ...room.messages,
            {
                message,
                userId,
                date: Date.now()
            }
        ]
    }
    return redisClient.set(roomKey(roomId), stringify(newRoomDetails));
}

export const updateCode = async (redisClient, roomId, userId, code) => {
    const room = await getRoom(redisClient, roomId);
    const newRoomDetails = {
        ...room,
        code: {
            ...room.code,
            [userId]: {
                code,
                language: room.code[userId].language
            }
        }
    }
    return redisClient.set(roomKey(roomId), stringify(newRoomDetails));
}

export const updateLanguage = async (redisClient, roomId, userId, language) => {
    const room = await getRoom(redisClient, roomId);
    const newRoomDetails = {
        ...room,
        code: {
            ...room.code,
            [userId]: {
                code: "",
                language
            }
        }
    }
    return redisClient.set(roomKey(roomId), stringify(newRoomDetails));
}

export const changeQuestionStatus = async (redisClient, roomId, userId, status) => {
    const room = await getRoom(redisClient, roomId);
    const changeQuestionId = userId + "ChangeConfirmation"
    const newRoomDetails = {
        ...room,
        [changeQuestionId]: status
    }
    return redisClient.set(roomKey(roomId), stringify(newRoomDetails));
}