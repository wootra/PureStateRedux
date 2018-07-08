import axios from "axios";
const TEST_ACTION1 = "TEST_ACTION1";
const TEST_ACTION2 = "TEST_ACTION2";
const TEST_ACTION3 = "TEST_ACTION3";

//in this sample, I used 2 actions which uses mock server in the postman application.
//in the postman application, I made a 2 APIs that response 
// {"a":1} by GET request of /test/term/1
// {"a":2} by GET request of /test/term/2
export const action1 = function(term){
    let url = "https://ce360567-b6f8-4cd1-9c36-ccb3d4c409db.mock.pstmn.io";
    return {
        type:TEST_ACTION1,
        payload: axios.get(url+"/test/term/"+term)
    };
}
export const action2 = function(term){
    let url = "https://ce360567-b6f8-4cd1-9c36-ccb3d4c409db.mock.pstmn.io";
    return {
        type:TEST_ACTION2,
        payload: axios.get(url+"/test/term/"+term)
    };
}
export const action3 = function(term){
    return {
        type:TEST_ACTION3,
        payload: {a:"pure obj"}
    };
}
export const ACTION_TYPES = {TEST_ACTION1, TEST_ACTION2, TEST_ACTION3};

const ACTIONS = {
    action1, action2, action3,
    TEST_ACTION1, TEST_ACTION2, TEST_ACTION3
};
export default ACTIONS;