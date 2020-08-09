import { SIGNUP, LOGIN, AUTHENTICATE, LOGOUT } from "../actions/auth";

const initialState = {
    userId: null,
    userName: null,
    userPhone: null,
    userGender: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case LOGOUT:
            return initialState;
        case AUTHENTICATE:
            return {
                userId: action.payload.userId,
                userName: action.payload.userName,
                userPhone: action.payload.userPhone,
                userGender: action.payload.userGender,
            };
        case SIGNUP:
            return {
                userId: action.payload.userId,
                userName: action.payload.userName,
                userPhone: action.payload.userPhone,
                userGender: action.payload.userGender,
            };
        case LOGIN:
            return {
                token: action.payload.token,
                userId: action.payload.userId,
            };
        default:
            return state;
    }
};