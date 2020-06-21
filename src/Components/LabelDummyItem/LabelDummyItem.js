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


function random_rgba() {
    var o = Math.round, r = Math.random, s = 255;
    let randR=o(r()*s);
    let randG=o(r()*s);
    let randB=o(r()*s);
    return {
        regular:`rgba(${randR},${randG},${randB},0.5)`,
        onHover:`rgba(${randR},${randG},${randB},1)`
    };

}

const LabelDummyItem = (props) => {
    const [newLabelName, setNewLabelName] = useState('');
    const [bgColor, setbgColor] = useState(random_rgba());
    let dispatch = useDispatch();
    const currentLabelCountID = useSelector(state => state.LabelsCounterID);
    const newDummyLabelIsVisible = useSelector(state => state.Labels.dummyNewLabel);
    const currentImage = useSelector(state => state.Images.currentImage);

    return (
        <div className="main-labels-item" style={{
            backgroundColor:(props.currentMouseOut===props.keyID || props.currentHover!==props.keyID)?
                props.color.regular:
                props.color.onHover,
            border:(props.currentMouseOut===props.keyID || props.currentHover!==props.keyID)?
                'initial':
                '1px solid black',
            display: newDummyLabelIsVisible ? 'grid' : 'none'
        }}>
            <div className="main-labels-item-blank" >&nbsp;</div>
            <div style={{ display: "flex", flexDirection: "row", paddingLeft: "5px", alignItems: "center", height: "100%" }}>
                <input type="text" placeholder="Enter label's name"
                    value={newLabelName} onChange={e => setNewLabelName(e.target.value)} ></input>
                <img alt="" src={process.env.PUBLIC_URL + "/Images/complete.png"}
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                        let labelToAdd;
                        switch (props.tool) {
                            case "classification":
                                labelToAdd={
                                    text:newLabelName,
                                    id:props.keyID,
                                    bgColor: bgColor};
                                break;
                            case "boundingBox":
                                labelToAdd={
                                    text: newLabelName,
                                    id:props.keyID==="-1"? currentLabelCountID:props.keyID,
                                    bgColor: props.color,
                                    top_left:props.topLeft,
                                    width:props.width,
                                    height:props.height,
                                    rect:props.rect
                                };
                                break;
                            case "polygon":
                                labelToAdd={
                                    id:props.keyID==="-1"? currentLabelCountID:props.keyID,
                                    text:newLabelName,
                                    vertices:props.vertices,
                                    bgColor: props.color
                                };
                                break;

                        }

                        dispatch(actions.removePendingLabel(props.currentImage,props.keyID,props.tool));
                        dispatch(actions.addLabel(labelToAdd,currentImage,props.tool));
                        setNewLabelName('');
                        setbgColor(random_rgba());
                    }}></img>

                <img alt="" src={process.env.PUBLIC_URL + "Images/trashS.svg"}
                    onClick={() => {
                        // dispatch(actions.closeDummyLabel());
                        dispatch(actions.removePendingLabel(props.currentImage,props.keyID,props.tool));
                        setNewLabelName('');
                        setbgColor(random_rgba());
                    }}></img>
            </div>
        </div>
    )
}

export default LabelDummyItem;
