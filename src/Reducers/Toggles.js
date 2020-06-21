const initialState = {
  imagesVisible: true,
  labelsVisible: true,
  classificationLabelsIsVisible:true,
  boundingBoxLabelsIsVisible:false,
  polygonLabelsIsVisible:false,
  moveToolIsSelected: false,
  pointerToolIsSelected: true
};

const Toggles = (state = initialState, action) => {
  switch (action.type) {
    case 'TOGGLE_MENU':
      switch (action.menu) {
        case 'images':
          state.imagesVisible = !state.imagesVisible;
          break;
        case 'labels':
          state.labelsVisible = !state.labelsVisible;
          break;
        default:
      }
      return state;

    case 'TOGGLE_LABEL_CONTAINER':
       state[action.tool]=!state[action.tool];
      return state;

    case 'OPEN_LABELS_CONTAINER':
      return Object.assign({},state,
        {classificationLabelsIsVisible:false,
                  boundingBoxLabelsIsVisible:false,
                  polygonLabelsIsVisible:false},
        {[action.tool]:true}
        )

    case 'MOVE_TOOL_TOGGLE':
      return Object.assign({},state,{moveToolIsSelected: !state.moveToolIsSelected,
                                                    pointerToolIsSelected: !state.pointerToolIsSelected});

    default:
      return state
  }
}

export default Toggles