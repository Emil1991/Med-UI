const initState = {
    container: [],
    currentImage:""
};


const Images = (state = initState, action) => {
    switch (action.type) {

        case "LOAD_IMAGES":
            return {
                container: state.container.concat(action.images)
            };
        case "IMAGE_CHANGE":
            return Object.assign({}, state, {
                currentImage: action.imageName });
        default:
            return state
    }
}

export default Images