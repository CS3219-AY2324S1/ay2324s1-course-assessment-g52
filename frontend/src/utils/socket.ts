import { io } from 'socket.io-client';

const URL = import.meta.env.VITE_COLLABORATION_SOCKET_URL;

export const socket = (userId: string, token: string) => io(
    URL, 
    { 
        query: {
            userId,
            token
        }
    }
);
