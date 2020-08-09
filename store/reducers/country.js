import { MAKE_VISIBLE, MAKE_HIDDEN } from "../actions/country";

const INTIALSTATE = {
    isVisible: false
};

export default filterReducer = (state = INTIALSTATE, action) => {    
    switch (action.type) {
        case MAKE_VISIBLE:
            return {
                isVisible: true
            };
        case MAKE_HIDDEN:
            return {
                isVisible: false
            };
        default:
            return state;
    }
};