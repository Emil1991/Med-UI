import React, { useState,useEffect } from 'react'
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


const CanvasLabel = (props) => {
    const [newLabelName, setNewLabelName] = useState('');
    const [bgColor, setbgColor] = useState(getRandomColor);
    let dispatch = useDispatch();
    const currentLabelCountID = useSelector(state => state.LabelsCounterID);
    const newCanvasLabelIsVisible = useSelector(state => state.Labels.newCanvasLabel);
    const newCanvasCurds=useSelector(state=>state.Labels.canvasLabelCurds);

useEffect(()=>{
    // console.log(`new canvas curds x :${newCanvasCurds.x}`);
},[newCanvasCurds]);
    return (
        <div className="main-labels-item shadowCenter" style={{
            position:"absolute",
            backgroundColor: bgColor,
            borderRadius:"5px",
            borderBottom:"none",
            zIndex:"100",
            top:newCanvasCurds.top,
            left:newCanvasCurds.left,
            display: newCanvasLabelIsVisible ? 'grid' : 'none'
        }}>
            <div className="main-labels-item-blank" >&nbsp;</div>
            <div style={{ display: "flex", flexDirection: "row", paddingLeft: "5px", alignItems: "center", height: "100%" }}>
                {/* <span>{props.text}</span> */}
                <input type="text" placeholder="Enter label's name"
                    value={newLabelName} onChange={e => setNewLabelName(e.target.value)} ></input>
                <img alt="" src={process.env.PUBLIC_URL + "/Images/complete.png"}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        dispatch(actions.addLabel({ text: newLabelName, key: currentLabelCountID, bgColor: bgColor },"newCanvasLabel"))
                        setNewLabelName('');
                        setbgColor(getRandomColor);
                    }}></img>

                <img alt="" src={process.env.PUBLIC_URL + "Images/trashS.svg"}
                    onClick={() => {
                        dispatch(actions.closeCanvasLabel());
                        setNewLabelName('');
                        setbgColor(getRandomColor);
                    }}></img>
            </div>
        </div>
    )
}

export default CanvasLabel;
