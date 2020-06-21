import React from 'react'
import ReactTooltip from "react-tooltip";
import { useSelector, useDispatch } from 'react-redux';

import actions from '../../Actions/index'
import Selectors from "../Selectors/Selectors";


const SelectorItem = (props) => {
    const dispatch = useDispatch();
    const currentSelector = useSelector(state => state.Tools.currentSelector);
    const classificationLabelsIsVisible= useSelector(state => state.Toggles.classificationLabelsIsVisible);
    const boundingBoxLabelsIsVisible= useSelector(state => state.Toggles.boundingBoxLabelsIsVisible);
    const polygonLabelsIsVisible= useSelector(state => state.Toggles.polygonLabelsIsVisible);
    return (
        <>
        <a data-tip data-for={props.selector}>
        <div className={props.isSelected?"main-toolbar-selectors-selector selectorIsClicked":"main-toolbar-selectors-selector"}
        onClick={() => {
            if (currentSelector !== props.selector){
                dispatch(actions.selectorChange(currentSelector, props.selector));
                dispatch(actions.openLabelsContainer(props.selector+'LabelsIsVisible'));
            }

        }}>
            <img alt="" src={process.env.PUBLIC_URL + `Images/${props.type}`}></img>
        </div>
        </a>
        <ReactTooltip id={props.selector} type='light' effect='solid' place="bottom" delayShow={750}>
        <span><b>{props.tooltip}</b></span>
    </ReactTooltip>
            </>
    )
}

export default SelectorItem;
