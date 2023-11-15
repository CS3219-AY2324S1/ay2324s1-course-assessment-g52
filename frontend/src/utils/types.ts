export type QuestionComplexity = 'Easy' | 'Medium' | 'Hard' | null;
export const QuestionCategories = [
    "Arrays", "Bit Manipulation",
  "Strings", "Brainteaser", "Data Structures", "Algorithms", "Recursion", "Databases"
];

export type QuestionCategory = typeof QuestionCategories[number];

export type User = {
    id: string;
    username: string;
    email: string;
    role: string;
    createdAt: string;
    updatedAt: string;
}

export type Question = {
    id: string;
    title: string;
    description: string;
    category: QuestionCategory[];
    complexity: QuestionComplexity;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
}
export type Message = {
    userId: string;
    message: string;
    date: number;
}

export type Code = {
    [key: string]: {
        code: string;
        language: string;
    }
}
  
export type Room = {
    roomId: string;
    questionId: number;
    users: string[];
    messages: Message[];
    code: Code;
}
export const ClientEvents = {
    JOIN_ROOM: 'join-room',
    LEAVE_ROOM: 'leave-room',
    DELETE_ROOM: 'delete-room',
    GET_ROOM: 'get-room',
    MESSAGE: 'message',
    CODE: 'code',
    LANGUAGE: 'language',
    CHANGE_QUESTION: "change-question",
    CANCEL_CHANGE_QN: "cancel-change-question",
    CONFIRM_CHANGE_QN: "confirm-change-question"
}

export const ServerEvents = {
    JOINED_ROOM: 'joined-room',
    LEFT_ROOM: 'left-room',
    DELETE_ROOM: 'deleted-room',
    ROOM_STATE: 'room-state',
    MESSAGE: 'message',
    CODE: 'code',
    LANGUAGE: 'language',
    ERROR: 'error',
    CHANGE_REQUEST: "change-question-request",
    CANCEL_CHANGE_REQUEST: "cancel-change-question-request",
    QUESTION_CHANGED: "question-changed"
}

export const ServerErrors = {
    NO_NEW_QUESTION: "no-new-question"
}

export type UpdateQuestion = {
    id: string;
    title: string;
    description: string;
    category: QuestionCategory[];
    complexity: QuestionComplexity;
}

export type codeOutputType = {
    compile_output: string,
    memory: number,
    message: string,
    status: {id: number, description: string},
    stderr: string,
    stdout: string,
    time: string,
    token: string,
}