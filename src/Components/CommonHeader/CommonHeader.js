import React from 'react'


const CommonHeader = (props) => {
    return (
        <div className="common-header">
            {props.children}
        </div>
    )
}

export default CommonHeader;
