import {ACTION_TYPES} from "../actions";

function reducer1(type,payload){
    switch(type){
        case ACTION_TYPES.TEST_ACTION1:
            return {term:payload.data.a};
        case ACTION_TYPES.TEST_ACTION2:
            return {term:payload.data.a};
        case ACTION_TYPES.TEST_ACTION3:
            return {term:payload.a};
        default:
            return {};
    }
}

export default reducer1;