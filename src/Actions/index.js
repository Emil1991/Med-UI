import { ADD_LABEL, DELETE_LABEL, TOGGLE_MENU } from '../Constatns/index'


const actions = {
  toggleMenu: menu => ({
    type: TOGGLE_MENU,
    menu
  }),
  toggleCustomLabelContainer:tool=>({
    type:"TOGGLE_LABEL_CONTAINER",
    tool
  }),
  openLabelsContainer:tool=>({
    type:"OPEN_LABELS_CONTAINER",
    tool
  }),
  addDummyLabel: () => ({
    type: 'ADD_NEW_DUMMY_LABEL'
  }),
  closeDummyLabel: () => ({
    type: 'CLOSE_DUMMY_LABEL'
  })
  ,
  addCanvasLabel: (id) => ({
    type: 'ADD_NEW_CANVAS_LABEL',
    id
  }),
  closeCanvasLabel: () => ({
    type: 'CLOSE_CANVAS_LABEL'
  })
  ,
  addLabel: (label,imageID,tool,props={}) => ({
    type: ADD_LABEL,
    label,
    imageID,
    tool,
    props
  }),
  deleteLabel: labelKey => ({
    type: DELETE_LABEL,
    payload: labelKey
  }),
  searchLabel: query => ({
    type: 'SEARCH_LABEL',
    payload: query
  }),
  selectorChange: (oldSelector, newSelector) => ({
    type: 'SELECTOR_CHANGE',
    oldSelector,
    newSelector
  }),
  loadImages: (images) => ({
    type: 'LOAD_IMAGES',
    images
  }),
  loadLabels: (labels,tool="classification") => ({
    type: 'LOAD_LABELS',
    labels,
    tool
  }),
  imageChange: (imageName) => ({
    type: 'IMAGE_CHANGE',
    imageName
  }),
  setCanvasLabelCurds:(top,left)=>({
    type:'CANVAS_LABELS_CURDS',
    top,
    left
  }),
  addPendingLabel:(label,imageID,tool)=>({
    type:'ADD_PENDING_LABEL',
    label,
    imageID,
    tool
  }),
  removeLabel:(imageID,id,tool)=>({
    type:'REMOVE_LABEL',
    imageID,
    id,
    tool
  }),
  removePendingLabel:(imageID,id,tool)=>({
    type:'REMOVE_PENDING_LABEL',
    imageID,
    id,
    tool
  }),
  removeLoadedLabel:(tool,id)=>({
    type:'REMOVE_LOADED_LABEL',
    tool,
    id
  }),
  increaseLabelsId:()=>({
    type:'INC_LABEL_ID'
  }),
  currentHoverId:(tool,id)=>({
    type:'CURRENT_HOVER_ID',
    tool,
    id
  }),
  currentMouseOutId:(tool,id)=>({
    type:'CURRENT_MOUSEOUT_ID',
    tool,
    id
  }),
  moveToolToggle:()=>({
    type:'MOVE_TOOL_TOGGLE'
  })
}

export default actions;