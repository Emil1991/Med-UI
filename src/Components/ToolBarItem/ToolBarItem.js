import React from 'react'
import ReactTooltip from "react-tooltip";



const ToolBarItem = (props) => {
    return (
        <>
            <a data-tip data-for={props.tool}>
        <div className={props.flip?(props.isSelected?"main-toolbar-tool flipHorizontal selectorIsClicked":"main-toolbar-tool flipHorizontal")
            :(props.isSelected?"main-toolbar-tool selectorIsClicked":"main-toolbar-tool")}
        onClick={props.onClick}>
            <img alt="" src={process.env.PUBLIC_URL + `Images/${props.type}`}></img>
        </div>
            </a>
            <ReactTooltip id={props.tool} type='light' effect='solid' place="bottom" delayShow={750}>
                <span><b>{props.tooltip}</b></span>
            </ReactTooltip>
            </>
    )
}

export default ToolBarItem;
