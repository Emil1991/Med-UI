import React from 'react'
import ReactTooltip from "react-tooltip";



const Export = (props) => {
    return (
        <>
            <a data-tip data-for={props.tool}
               href={props.jsonURL}
               download={`meditattion ${new Date().getDate()}/${new Date().getMonth()+1}/${new Date().getFullYear()}`}>
        <div className={props.flip?"main-toolbar-tool flipHorizontal":"main-toolbar-tool"}
        >

                <img alt="" src={process.env.PUBLIC_URL + `Images/${props.type}`}>
                </img>


        </div>
            </a>
            <ReactTooltip id={props.tool} type='light' effect='solid' place="bottom" delayShow={750}>
                <span><b>{props.tooltip}</b></span>
            </ReactTooltip>
            </>
    )
}

export default Export;
