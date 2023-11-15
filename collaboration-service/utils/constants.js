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

export const ClientErrors = {
    MISSING_TOKEN: 'Missing JWT',
    INVALID_TOKEN: "Invalid JWT",
    MISSING_USER_ID: "Missing User ID",
}

export const ServerErrors = {
    NO_NEW_QUESTION: "no-new-question"
}