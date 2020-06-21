import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import actions from '../../Actions'

const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};


const CustomLabelsContainer = (props) => {
    const [newLabelName, setNewLabelName] = useState('');
    const [bgColor, setbgColor] = useState(getRandomColor);
    let dispatch = useDispatch();
    const currentLabelCountID = useSelector(state => state.LabelsCounterID);
    const newDummyLabelIsVisible = useSelector(state => state.Labels.dummyNewLabel);
    const selectedImage=useSelector(state=>state.Images.currentImage);

    return (
        <>
        <div style={{borderBottom:"1px solid #eeeeee"}}>
            <div className="common-labels-container"
                 onClick={()=>{ selectedImage!='' &&
                 dispatch(actions.toggleCustomLabelContainer(props.annotator + 'LabelsIsVisible'))
                 }}>
                <span >{props.text}&nbsp;({props.numberOfChildren})</span>
                {props.isOpen &&
                <span style={{position:"absolute",right:"11px",fontSize:"14px"}}>&nbsp;&#x25B2;</span>
                }
                {!props.isOpen && <span style={{position:"absolute",right:"11px",fontSize:"14px"}}>&nbsp;&#x25BC;</span>}
            </div>
            {props.isOpen &&
            <div style={{display:"grid",gridTemplateColumns:"10px 1fr"}}>
                <div className="blankColumn"></div>
                <div style={{width:"92.5%"}}>
                    {props.children}
                </div>
            </div>
            }
        </div>


            </>
    )
}

export default CustomLabelsContainer;
