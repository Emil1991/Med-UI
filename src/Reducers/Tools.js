import {ADD_LABEL} from "../Constatns";

const initialState = {
    currentSelector: "classification",
    boundingBox: {
        isSelected: false,
        labels: {},
        userLabels:{},
        pendingLabels:{}
    },
    polygon: {
        isSelected: false,
        labels: {},
        userLabels:{},
        pendingLabels:{}
    },
    classification: {
        isSelected: true,
        labels: {},
        userLabels:{},
        pendingLabels:{}
    }
}

const Tools = (state = initialState, action) => {
    switch (action.type) {
        case "LOAD_LABELS":
            let newUserLabels={};
            for(let image in action.labels){
                if(!(image in state[state.currentSelector].userLabels)){
                    newUserLabels[image]=[];
                }
            }
            return Object.assign({}, state, {
                [state.currentSelector]: Object.assign({}, state[state.currentSelector],
                    { labels: Object.assign({},state[state.currentSelector].labels,action.labels),
                                userLabels:Object.assign({},state[state.currentSelector].userLabels,newUserLabels)})
            });
        case "SELECTOR_CHANGE":
            return Object.assign({}, state, {
                currentSelector: action.newSelector,
                [action.newSelector]: Object.assign({}, state[action.newSelector], { isSelected: true }),
                [action.oldSelector]: Object.assign({}, state[action.oldSelector], { isSelected: false })
            });

        case ADD_LABEL:
            if(!(action.imageID in state[action.tool].userLabels)){
                return Object.assign({}, state, {
                    [action.tool]: Object.assign({}, state[action.tool],
                        { userLabels: Object.assign({},state[action.tool].userLabels,
                                {[action.imageID]:[action.label]}) })
                });
            }else{
                return Object.assign({}, state, {
                    [action.tool]: Object.assign({}, state[action.tool],
                        { userLabels: Object.assign({},state[action.tool].userLabels,
                                {[action.imageID]:state[action.tool].userLabels[action.imageID].concat([action.label])}) })
                });
            }

        case "ADD_PENDING_LABEL":
            if(!(action.imageID in state[action.tool].pendingLabels)){
                return Object.assign({}, state, {
                    [action.tool]: Object.assign({}, state[action.tool],
                        { pendingLabels: Object.assign({},state[action.tool].pendingLabels,
                                {[action.imageID]:[action.label]}) })
                });
            }else{
                return Object.assign({}, state, {
                    [action.tool]: Object.assign({}, state[action.tool],
                        { pendingLabels: Object.assign({},state[action.tool].pendingLabels,
                                {[action.imageID]:state[action.tool].pendingLabels[action.imageID].concat([action.label])}) })
                });
            }


        case "REMOVE_LABEL":
            return {
                ...state,
                [action.tool]:{...state[action.tool],
                    userLabels:{
                        ...state[action.tool].userLabels,
                        [action.imageID]:[ ...state[action.tool].userLabels[action.imageID]
                            .filter((label)=>label.id!==action.id)]}}
            }
        case "REMOVE_PENDING_LABEL":

            return {
                ...state,
                [action.tool]:{...state[action.tool],
                    pendingLabels:{
                        ...state[action.tool].pendingLabels,
                        [action.imageID]:[ ...state[action.tool].pendingLabels[action.imageID]
                            .filter((label)=>label.id!==action.id)]}}
            }

        case "REMOVE_LOADED_LABEL":
            return{
                ...state,
                [action.tool]:{...state[action.tool],
                labels:state[action.tool].labels.filter(label=>label.index!==action.id)
                }
            }

        default:
            return state
    }
}

export default Tools