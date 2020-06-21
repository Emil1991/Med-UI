import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import CommonHeader from '../CommonHeader/CommonHeader'
import CommonTitle from '../CommonTitle/CommonTitle'
import CommonSearch from '../CommonSearch/CommonSearch'
import LabelsContainer from '../LabelsContainer/LabelsContainer'
import AddLabelBtn from '../AddLabelBtn/AddLabelBtn'
import LabelItem from '../LabelItem/LabelItem'
import LabelDummyItem from '../LabelDummyItem/LabelDummyItem'
import CustomLabelsContainer from "../CustomLabelsContainer/CustomLabelsContainer";
import { v4 as uuidv4 } from 'uuid';
// import actions from '../../Actions'

const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

const Labels = (props) => {
    let dispatch = useDispatch();
    const [labels, setLabels] = useState({});
    const [loaded, setLoaded] = useState(false);
    const labelsIsVisible = useSelector(state => state.Toggles.labelsVisible);
    // const labelsContainer = useSelector(state => state.Labels.container);
    const currentSelector = useSelector(state => state.Tools.currentSelector);
    // console.log("currentSelector", currentSelector);
    // const currentImage = useSelector(state => state.Tools[currentSelector].currentImage);
    const currentImage = useSelector(state => state.Images.currentImage);
    // console.log("currentImage", currentImage);
    const searchQuery = useSelector(state => state.Labels.searchQuery);
    const loadedLabels = useSelector(state => state.Tools["classification"].labels);
    const userLabels = useSelector(state => state.Tools[currentSelector].userLabels);
    // console.log("loadedLabels", loadedLabels);
    // console.log("userLabels", userLabels);
    const classificationLabelsIsVisible= useSelector(state => state.Toggles.classificationLabelsIsVisible);
    const boundingBoxLabelsIsVisible= useSelector(state => state.Toggles.boundingBoxLabelsIsVisible);
    const polygonLabelsIsVisible= useSelector(state => state.Toggles.polygonLabelsIsVisible);
    // console.log(`class labels is visible: ${classificationLabelsIsVisible}`);
    // console.log(`bb labels is visible: ${boundingBoxLabelsIsVisible}`);
    // console.log(`pol labels is visible: ${polygonLabelsIsVisible}`);
    const currentNewLabelID=useSelector(state=>state.Labels.currentNewLabelID);
    const classificationLabels=useSelector(state=>state.Tools.classification.userLabels);
    const classificationPendingLabels=useSelector(state=>state.Tools.classification.pendingLabels);
    const boundingBoxLabels=useSelector(state=>state.Tools.boundingBox.userLabels);
    const boundingBoxPendingLabels=useSelector(state=>state.Tools.boundingBox.pendingLabels);
    const polygonLabels=useSelector(state=>state.Tools.polygon.userLabels);
    const polygonPendingLabels=useSelector(state=>state.Tools.polygon.pendingLabels);
    const currentHover=useSelector(state=>state.Labels.currentHover);
    const currentMouseOut=useSelector(state=>state.Labels.currentMouseOut);

    useEffect(()=>{
        // console.log(`bb pending :${JSON.stringify(boundingBoxPendingLabels)}`);
    },[boundingBoxPendingLabels])

    useEffect(()=>{
        // console.log(`hovered on :${JSON.stringify(currentHover)}`);
    },[currentHover])

    useEffect(()=>{
        // console.log(`mouseOut from :${JSON.stringify(currentMouseOut)}`);
    },[currentMouseOut])


// useEffect(()=>{
// },[boundingBoxLabels]);
    let loadedLabelsToDisplay = [];
    let classificationLabelsToDisplay=[];
    let boundingBoxLabelsToDisplay=[];
    let polygonLabelsToDisplay=[];

    // const [classificationPendingLabelsToDisplay,setClassificationPendingLabelsToDisplay]=useState([]);
    // const [boundingBoxPendingLabelsToDisplay,setBoundingBoxPendingLabelsToDisplay]=useState([]);
    // const [polygonPendingLabelsToDisplay,setPolygonPendingLabelsToDisplay]=useState([]);

    const classificationPendingLabelsToDisplay=[];
    const boundingBoxPendingLabelsToDisplay=[];
    const polygonPendingLabelsToDisplay=[];


    if (currentImage != '' && Object.keys(loadedLabels).length > 0 && loadedLabels[currentImage]) {
        loadedLabels[currentImage].forEach(label => {
            // console.log("loaded label:", label);
            if (label.indexOf(searchQuery) >= 0) {
                loadedLabelsToDisplay.unshift(
                    <LabelItem key={label} serial={label} text={label} currentImage={currentImage} loaded
                               bgColor={getRandomColor()} tool={currentSelector}
                            currentHover={currentHover.tool===currentSelector?currentHover.id:-10}
                               currentMouseOut={currentMouseOut.tool===currentSelector?currentMouseOut.id:-20}></LabelItem>
                )
            }
        });

    }
    if(currentImage!=="" && classificationLabels[currentImage]){
        classificationLabels[currentImage].forEach(label => {
            if (label.text.indexOf(searchQuery) >= 0) {
                classificationLabelsToDisplay.unshift(
                    <LabelItem key={label.id} serial={label.id} text={label.text} currentImage={currentImage}
                               bgColor={label.bgColor} tool="classification"
                    currentHover={currentHover.tool==="classification"?currentHover.id:-10}
                               currentMouseOut={currentMouseOut.tool==="classification"?currentMouseOut.id:-20}></LabelItem>
                )
            }
        });
    }

    if(currentImage!=="" && classificationPendingLabels[currentImage]){
        classificationPendingLabels[currentImage].forEach(label => {
            classificationPendingLabelsToDisplay.unshift(
                <LabelDummyItem key={label.id} tool="classification" keyID={label.id} currentImage={currentImage}
                                currentHover={currentHover.tool==="classification"?currentHover.id:-10}
                                currentMouseOut={currentMouseOut.tool==="classification"?currentMouseOut.id:-20}
                                topLeft="" width="" height="" rect=""
                                vertices=""></LabelDummyItem>
            )
        });
    }

    if(currentImage!=="" && boundingBoxLabels[currentImage]){
        boundingBoxLabels[currentImage].forEach(label => {
            // console.log("label:", label);
            if (label.text.indexOf(searchQuery) >= 0) {
                boundingBoxLabelsToDisplay.unshift(
                    <LabelItem key={label.id} serial={label.id} text={label.text} currentImage={currentImage}
                               currentHover={currentHover.tool==="boundingBox"?currentHover.id:-10}
                               currentMouseOut={currentMouseOut.tool==="boundingBox"?currentMouseOut.id:-20}
                               bgColor={label.bgColor} tool="boundingBox" ></LabelItem>
                )
            }
        });
    }

    if(currentImage!=="" && boundingBoxPendingLabels[currentImage]){
        boundingBoxPendingLabels[currentImage].forEach(label => {
                boundingBoxPendingLabelsToDisplay.unshift(
                    <LabelDummyItem key={uuidv4()} tool="boundingBox" keyID={label.id} currentImage={currentImage}
                                    currentHover={currentHover.tool==="boundingBox"?currentHover.id:-10}
                                    currentMouseOut={currentMouseOut.tool==="boundingBox"?currentMouseOut.id:-20}
                                    topLeft={label.top_left} width={label.width} height={label.height} rect={label.rect}
                                      color={label.color}  vertices=""></LabelDummyItem>
                )
        });
    }

    if(currentImage!=="" && polygonLabels[currentImage]){
        polygonLabels[currentImage].forEach(label => {
            // console.log("label:", label);
            if (label.text.indexOf(searchQuery) >= 0) {
                polygonLabelsToDisplay.unshift(
                    <LabelItem key={label.id} serial={label.id} text={label.text} currentImage={currentImage}
                               currentHover={currentHover.tool==="polygon"?currentHover.id:-10}
                               currentMouseOut={currentMouseOut.tool==="polygon"?currentMouseOut.id:-20}
                               bgColor={label.bgColor} tool="polygon" ></LabelItem>
                )
            }
        });
    }

    if(currentImage!=="" && polygonPendingLabels[currentImage]){
        polygonPendingLabels[currentImage].forEach(label => {
            polygonPendingLabelsToDisplay.unshift(
                <LabelDummyItem key={uuidv4()} tool="polygon" keyID={label.id} currentImage={currentImage}
                                currentHover={currentHover.tool==="polygon"?currentHover.id:-10}
                                currentMouseOut={currentMouseOut.tool==="polygon"?currentMouseOut.id:-20}
                                topLeft="" width="" height="" color={label.color} vertices={label.vertices}></LabelDummyItem>
            )
        });
    }


    return (
        <div className={labelsIsVisible ? 'main-labels' : 'main-labels hide'}>
            <CommonHeader>
                <img alt="" src={process.env.PUBLIC_URL + "Images/logo.png"}/>
                {/*<span className="common-header-logo" style={{color:"#EEEEEE"}}>*/}
                {/*    MEDITATTION*/}
                {/*</span>*/}

            </CommonHeader>
            <CommonTitle text="Labels"></CommonTitle>
            <CommonSearch></CommonSearch>
            {/*<AddLabelBtn></AddLabelBtn>*/}
            <LabelsContainer>
                <CustomLabelsContainer key="-1" annotator="classification" text="Classification"
                                       isOpen={currentImage != '' && classificationLabelsIsVisible}
                                       numberOfChildren={loadedLabelsToDisplay.length + classificationLabelsToDisplay.length+classificationPendingLabelsToDisplay.length}>
                    <AddLabelBtn/>
                    {loadedLabelsToDisplay}
                    {classificationPendingLabelsToDisplay}
                    {classificationLabelsToDisplay}
                </CustomLabelsContainer>
                <CustomLabelsContainer key="-2" annotator="polygon" text="Segmentation"
                                       isOpen={currentImage != '' && polygonLabelsIsVisible}
                                       numberOfChildren={polygonLabelsToDisplay.length + polygonPendingLabelsToDisplay.length}>
                    {/*<LabelDummyItem keyID={currentNewLabelID}></LabelDummyItem>*/}
                    {polygonPendingLabelsToDisplay}
                    {polygonLabelsToDisplay}
                </CustomLabelsContainer>
                <CustomLabelsContainer key="-3" annotator="boundingBox" text="Bounding Box"
                                       isOpen={currentImage != '' && boundingBoxLabelsIsVisible}
                                       numberOfChildren={boundingBoxLabelsToDisplay.length +boundingBoxPendingLabelsToDisplay.length}>
                    {/*<LabelDummyItem keyID={currentNewLabelID}></LabelDummyItem>*/}
                    {boundingBoxPendingLabelsToDisplay}
                    {boundingBoxLabelsToDisplay}
                </CustomLabelsContainer>


            </LabelsContainer>
        </div>
    )

    // <div className="main-labels">



}

export default Labels;
