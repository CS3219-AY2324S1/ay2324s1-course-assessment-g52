// Import modules
import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import { Server } from "socket.io";
import { createServer, get } from "http";
import { createRedisClient, getRoom} from "./utils/redis.js";
import { ClientErrors, ClientEvents, ServerEvents } from "./utils/constants.js";
import { validateToken } from "./utils/firebase.js";
import { clientJoinRoom } from "./controllers/clientJoinRoom.js";
import { clientLeaveRoom } from "./controllers/clientLeaveRoom.js";
import { clientChangeQuestion } from "./controllers/clientChangeQuestion.js";
import { clientCancelChangeQuestion } from "./controllers/clientCancelChangeQuestion.js";
import admin from 'firebase-admin';
import serviceAccount from "./serviceAccount.json" assert { type: "json" };
import { clientGetRoom } from "./controllers/clientGetRoom.js";
import { clientSendMessage } from "./controllers/clientSendMessage.js";
import { clientUpdateCode } from "./controllers/clientUpdateCode.js";
import { clientUpdateLanguage } from "./controllers/clientUpdateLanguage.js";
import { clientConfirmChange } from "./controllers/clientConfirmChange.js";
import QuestionServiceInstance from "./utils/QuestionServiceInstance.js";
dotenv.config();

const app = express();
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*"
    }
});
const firebaseApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const redis = await createRedisClient();

const authentication = async (socket, next) => {
    if (process.env.IS_LOCAL) {
        return next();
    }
    if (socket.handshake.query && socket.handshake.query.token) {
        const token = socket.handshake.query.token;
        try {
            if (await validateToken(firebaseApp, token)) {
                if (!socket.handshake.query.userId) {
                    return next(new Error(ClientErrors.MISSING_USER_ID));
                }
                next();
            } else {
                return next(new Error(ClientErrors.INVALID_TOKEN));
            }
        } catch (err) {
            return next(new Error(ClientErrors.INVALID_TOKEN));
        }
    } else {
        return next(new Error(ClientErrors.MISSING_TOKEN));
    }
};

const connection = async (socket) => {
    const userId = socket.handshake.query.userId;
    clientJoinRoom(io, socket, redis, userId);
    clientLeaveRoom(io, socket, redis, userId);
    clientGetRoom(io, socket, redis, userId);
    clientSendMessage(io, socket, redis, userId);
    clientUpdateCode(io, socket, redis, userId);
    clientUpdateLanguage(io, socket, redis, userId);
    clientChangeQuestion(io, socket, redis, userId);
    clientCancelChangeQuestion(io, socket, redis, userId);
    clientConfirmChange(io, socket, redis, userId);
    socket.on('disconnect', () => { 
        console.log("User " + userId + " disconnected")
    })
};

export const qst = new QuestionServiceInstance();
await qst.connect();

io.use(authentication).on("connection", connection);

server.listen(3001, () => {
    console.log("Server listening on on http://localhost:3001");
});
