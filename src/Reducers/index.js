import { combineReducers } from 'redux'
import Toggles from './Toggles'
import Tools from './Tools'
import Images from './Images'
import Labels from './Labels'
import LabelsCounterID from './LabelsCounterID'
import Output from './Output'
// import visibilityFilter from './visibilityFilter'

export default combineReducers({
 Images,Labels,LabelsCounterID,Toggles,Tools,Output
})