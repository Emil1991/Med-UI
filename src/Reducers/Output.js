import {ADD_LABEL} from "../Constatns";

const initialState = {
    currentSelector: "classification",
    container:{}

}

const Output = (state = initialState, action) => {
    switch (action.type) {
        case "SELECTOR_CHANGE":
            return Object.assign({}, state, {
                currentSelector: action.newSelector
            });

        case ADD_LABEL:
            if(!(action.imageID in state.container && state.container[action.imageID][action.tool] &&
                state.container[action.imageID][action.tool].length>0)){
                return Object.assign({}, state, {
                    container:Object.assign({},state.container,
                        {[action.imageID]:Object.assign({},state.container[action.imageID],
                                {[action.tool]:[action.label]})})
                });
            }else{
                return Object.assign({}, state, {
                    container:Object.assign({},state.container,
                        {[action.imageID]:Object.assign({},state.container[action.imageID],
                                {[action.tool]:state.container[action.imageID][action.tool].concat([action.label])})})
                });
            }

        case "REMOVE_LABEL":
            return {
                ...state,
                container:{ ...state.container,[action.imageID]:
                        {...state.container[action.imageID],[action.tool]:state.container[action.imageID][action.tool]
            .filter((label)=>label.id!==action.id)}}
            }


        default:
            return state
    }
}

export default Output