import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { LABEL_TYPE, ReactCanvasAnnotation } from "react-canvas-annotation";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from 'uuid'
import actions from "../../Actions/index";
import CanvasLabel from "../CanvasLabel/CanvasLabel";
import CommonHeader from "../CommonHeader/CommonHeader";
import SelectorItem from "../SelectorItem/SelectorItem";
import Selectors from "../Selectors/Selectors";
import ToolBarItem from "../ToolBarItem/ToolBarItem";
import Export from "../Exprot/Export"
import CanvasSuggestion from "../CanvasSuggestion/CanvasSuggestion";

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

const labelsDataDefault = {
  labelRects: [],
    labelPolygons: []
};

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

//  data example:
// {
//   labelRects: [
//     {
//       id: "Rect-Example",
//       rect: {
//         x: 697.2371134020618,
//         y: 454.26804123711344,
//         width: 717.0309278350516,
//         height: 492.1237113402062,
//       },
//     },
//   ],
//   labelPolygons: [
//     {
//       id: `Poly-Example`,
//       vertices: [
//         { x: 623.7525773195875, y: 440.9072164948454 },
//         { x: 1331.8762886597938, y: 305.07216494845363 },
//         { x: 1641.4020618556701, y: 732.6185567010309 },
//         { x: 882.0618556701031, y: 790.5154639175258 },
//       ],
//     },
//   ]
// }


const ZOOM_STEP = 0.1;

const Canvas = () => {
  const dispatch = useDispatch();
  const moveToolIsSelected=useSelector((state)=> state.Toggles.moveToolIsSelected);
  const pointerToolIsSelected=useSelector((state)=> state.Toggles.pointerToolIsSelected);
  const labelsIsVisible = useSelector((state) => state.Toggles.labelsVisible);
  const imagesIsVisible = useSelector((state) => state.Toggles.imagesVisible);
  const classificationLabelsIsVisible = useSelector(
    (state) => state.Toggles.classificationLabelsIsVisible
  );
  const boundingBoxLabelsIsVisible = useSelector(
    (state) => state.Toggles.boundingBoxLabelsIsVisible
  );
  const polygonLabelsIsVisible = useSelector(
    (state) => state.Toggles.polygonLabelsIsVisible
  );
  const boundingBoxIsSelected = useSelector(
    (state) => state.Tools.boundingBox.isSelected
  );
  const polygonIsSelected = useSelector(
    (state) => state.Tools.polygon.isSelected
  );
  const classificationIsSelected = useSelector(
    (state) => state.Tools.classification.isSelected
  );
  const currentSelector = useSelector((state) => state.Tools.currentSelector);
  const currentImage = useSelector((state) => state.Images.currentImage);
  const classificationLabelsId=useSelector((state)=>state.Labels.currentNewLabelID);
  // console.log(`currentImage:${currentImage}`);

  const loadedBoundingBoxLabels=useSelector(state=>state.Tools.boundingBox.labels);
  const [boundingBoxSuggestions,setBoundingBoxSuggestion]=useState([]);
  const loadedPolygonLabels=useSelector(state=>state.Tools.polygon.labels);
  const [polygonSuggestions,setPolygonSuggestion]=useState([]);

  const boundingBoxLabels=useSelector(state=>state.Tools.boundingBox.userLabels);
  // console.log(`boundingBoxLabels.currentImage: ${JSON.stringify(boundingBoxLabels[currentImage])}`)

  const boundingBoxPendingLabels=useSelector(state=>state.Tools.boundingBox.pendingLabels);
  // console.log(`boundingBoxPending.currentImage: ${JSON.stringify(boundingBoxPendingLabels[currentImage])}`)

  const polygonLabels=useSelector(state=>state.Tools.polygon.userLabels);
  const polygonPendingLabels=useSelector(state=>state.Tools.polygon.pendingLabels);


  const rawOutput=useSelector(state=>state.Output.container);
  useEffect(()=>{
  for(let image in rawOutput){
    if (rawOutput[image].classification)  rawOutput[image].classification=
        rawOutput[image].classification.map(label=>label?.text);
    if (rawOutput[image].boundingBox) rawOutput[image].boundingBox=
        rawOutput[image].boundingBox.map(label=>{
      return {text:label?.text,top_left:label.top_left,width:label.width,height:label.height};
    });
    if (rawOutput[image].polygon)  rawOutput[image].polygon=rawOutput[image].polygon.map(label=>{
      return {text:label?.text,vertices:label.vertices};
    });
  }
    // console.log(`the final out put: ${JSON.stringify(rawOutput)}`);
  setOutput(rawOutput);
  },[rawOutput]);


  useEffect(()=>{
    let  bbLabelsToRemoveFromCanvas=[];
    let isItInPendingLabels=false;
    let isItInUserLabels=false;
    let isItInSuggestion=false;
  labels.labelRects.forEach(bbLabel=>{
    isItInPendingLabels=boundingBoxPendingLabels[currentImage]?.filter(label=>label.id===bbLabel.id).length>0;
    isItInUserLabels=boundingBoxLabels[currentImage]?.filter(label=>label.id===bbLabel.id).length>0;
    isItInSuggestion=boundingBoxSuggestions[currentImage]?.filter(label=>label.id===bbLabel.id).length>0;
    if(!isItInPendingLabels && !isItInUserLabels && !isItInSuggestion)
      bbLabelsToRemoveFromCanvas.push(bbLabel.id);
    isItInPendingLabels=false;
    isItInUserLabels=false;
    isItInSuggestion=false;
  });
  let newRectLabelLength={...labels,labelRects:labels.labelRects.filter(label=>!bbLabelsToRemoveFromCanvas.includes(label.id))}.labelRects.length;
  setLabels({...labels,labelRects:labels.labelRects.filter(label=>!bbLabelsToRemoveFromCanvas.includes(label.id))});
  setLabelsRectLength(newRectLabelLength);
  },[boundingBoxLabels,boundingBoxPendingLabels]);

  useEffect(()=>{
    let  polLabelsToRemoveFromCanvas=[];
    let isItInPendingLabels=false;
    let isItInUserLabels=false;
    let isItInSuggestion=false;
    labels.labelPolygons.forEach(polLabel=>{
      isItInPendingLabels=polygonPendingLabels[currentImage]?.filter(label=>label.id===polLabel.id).length>0;
      isItInUserLabels=polygonLabels[currentImage]?.filter(label=>label.id===polLabel.id).length>0;
      isItInSuggestion=polygonSuggestions[currentImage]?.filter(label=>label.id===polLabel.id).length>0;

      if(!isItInPendingLabels && !isItInUserLabels && !isItInSuggestion)
        polLabelsToRemoveFromCanvas.push(polLabel.id);
      isItInPendingLabels=false;
      isItInUserLabels=false;
      isItInSuggestion=false;
    });
    let newPolyLength={...labels,labelPolygons:labels.labelPolygons.filter(label=>!polLabelsToRemoveFromCanvas.includes(label.id))}.labelPolygons.length;
    setLabels({...labels,labelPolygons:labels.labelPolygons.filter(label=>!polLabelsToRemoveFromCanvas.includes(label.id))});
    setLabelsPolygonLength(newPolyLength);
    },[polygonLabels,polygonPendingLabels]);


  // let imageFile = useSelector((state) => state.Images.container?.[0]);
  let imageFiles = useSelector((state) => state.Images.container);
  const [firstImageUpload,setFirstImageUpload]=useState(true);
  const [imageFile, setImageFile] = useState("");
  useEffect(() => {
    for (let image in imageFiles) {
      // console.log(`image:${imageFiles[image].name}`);
      // console.log(
      //   `image sub${imageFiles[image].name.substring(
      //     0,
      //     imageFiles[image].name.indexOf(".")
      //   )}`
      // );
      if(firstImageUpload){
        dispatch(actions.imageChange(
            imageFiles[image].name.substring(
            0,
            imageFiles[image].name.indexOf(".")
        )));
        setFirstImageUpload(false);
        break;
      }
      if (
        imageFiles[image].name.substring(
          0,
          imageFiles[image].name.indexOf(".")
        ) === currentImage
      ) {
        // imageFile=imageFiles[image];
        setImageFile(imageFiles[image]);
        break;
      }
    }
  }, [imageFiles, currentImage]);

  let selectedImage;
  let canvasDOM;
  let canvasWidth;
  let canvasHeight;
  let [imageWidthFactor,setImageWidthFactor]=useState(0);
  let [imageHeightFactor,setImageHeightFactor]=useState(0);

  useEffect(() => {
    if (imageFile !== "") {
      // console.log(`image file prev:${imageFile.preview}`);
      selectedImage = new Image();
      selectedImage.src = imageFile.preview;
      selectedImage.onload = () => {
        canvasDOM = document.getElementsByClassName("main-canvas")[0];
        canvasWidth = canvasDOM.offsetWidth;
        canvasHeight = canvasDOM.offsetHeight;
        setImageWidthFactor(imageWidthFactor = canvasWidth / selectedImage.width);
        setImageHeightFactor(canvasHeight / selectedImage.height);
      };
    }
  }, [imageFile]);


  let defaultSelector = LABEL_TYPE.RECTANGLE;

  const [newLabelCurds, setNewLabelCurds] = useState({ top: 60, left: 0 });
  const [labels, setLabels] = useState(labelsDataDefault);
  const [labelsSuggestions,setLabelsSuggestions]=useState([]);
  const [polygonLabelsSuggestions,setPolygonLabelsSuggestions]=useState([]);
  const [labelsRectLength, setLabelsRectLength] = useState(0);
  const [labelsPolygonLength, setLabelsPolygonLength] = useState(0);
  const [annotationType, setAnnotationType] = useState(defaultSelector);
  const [isImageDrag, toggleDragMode] = useReducer((p) => !p, false);
  const [output,setOutput]=useState({});
  const [jsonURL,setJsonURL]=useState("");

  const [zoom, setZoom] = useState(1);

  useEffect(()=>{
    handleExport();
  },[output])


  useEffect(() => {
    switch (currentSelector) {
      case "polygon":
        setAnnotationType(LABEL_TYPE.POLYGON);
        break;
      default:
        setAnnotationType(LABEL_TYPE.RECTANGLE);
        break;
    }
  }, [currentSelector]);

  useEffect(()=>{
    let boundingBoxSuggestionsToAssign={};
    for (let image in loadedBoundingBoxLabels){
      boundingBoxSuggestionsToAssign[image]=loadedBoundingBoxLabels[image].map((label,labelIndex) => {
        return {
          id:uuidv4(),
          isSuggestion:true,
          rect: {
            x: label["top_left"][1],
            y: label["top_left"][0],
            width: label["width"],
            height: label["height"],
          },
        };
      });
    }
    // console.log(`loaded bb labels: ${JSON.stringify(loadedBoundingBoxLabels)}`)
    // console.log(`sugg to assign: ${JSON.stringify(boundingBoxSuggestionsToAssign)}`)
    setBoundingBoxSuggestion(boundingBoxSuggestionsToAssign);
  },[loadedBoundingBoxLabels]);

  //add bb sugges to total labels
  useEffect(()=>{
    if(boundingBoxSuggestions[currentImage]){
      setLabels(oldLabels=>Object.assign({},{labelPolygons: oldLabels.labelPolygons},
          {labelRects: [...boundingBoxSuggestions[currentImage],...boundingBoxLabels[currentImage]]}));
    }
  },[boundingBoxSuggestions]);

  useEffect(()=>{
    if(loadedPolygonLabels){
      // Object.keys(loadedPolygonLabels).forEach(key => delete loadedPolygonLabels[key]; break;);
      delete loadedPolygonLabels.undefined;
      // console.log(`loaded polygon: ${JSON.stringify(loadedPolygonLabels)}`)

      setPolygonSuggestion(loadedPolygonLabels);
    }

  },[loadedPolygonLabels]);

  //add bb sugges to total labels
  useEffect(()=>{
    if(polygonSuggestions[currentImage]){
      setLabels(oldLabels=>Object.assign({},oldLabels,
          {labelPolygons: [...polygonSuggestions[currentImage],...polygonLabels[currentImage]]}));
    }
  },[polygonSuggestions]);

  useEffect(() => {
    if(!boundingBoxSuggestions[currentImage])
      boundingBoxSuggestions[currentImage]=[];
    if(!boundingBoxLabels[currentImage])
      boundingBoxLabels[currentImage]=[];
    if(!boundingBoxPendingLabels[currentImage])
      boundingBoxPendingLabels[currentImage]=[];

    if(!polygonSuggestions[currentImage])
      polygonSuggestions[currentImage]=[];
    if(!polygonLabels[currentImage])
      polygonLabels[currentImage]=[];
    if(!polygonPendingLabels[currentImage])
      polygonPendingLabels[currentImage]=[];

    let newLabelsState=Object.assign(
        {},
        { labelPolygons: labelsDataDefault.labelPolygons
              .concat(polygonSuggestions[currentImage],polygonLabels[currentImage],polygonPendingLabels[currentImage]) },
        { labelRects: labelsDataDefault.labelRects
              .concat(boundingBoxSuggestions[currentImage],boundingBoxLabels[currentImage],boundingBoxPendingLabels[currentImage]) }
    );

    // console.log(`labels before setState : ${JSON.stringify(
    //     Object.assign(
    //         {},
    //         { labelPolygons: labelsDataDefault.labelPolygons
    //               .concat(polygonSuggestions[currentImage],polygonLabels[currentImage],polygonPendingLabels[currentImage]) },
    //         { labelRects: labelsDataDefault.labelRects
    //               .concat(boundingBoxSuggestions[currentImage],boundingBoxLabels[currentImage],boundingBoxPendingLabels[currentImage]) }
    //     )
    // )}`)

        setLabels(
    Object.assign(
        {},
        { labelPolygons: labelsDataDefault.labelPolygons
              .concat(polygonSuggestions[currentImage],polygonLabels[currentImage],polygonPendingLabels[currentImage]) },
        { labelRects: labelsDataDefault.labelRects
              .concat(boundingBoxSuggestions[currentImage],boundingBoxLabels[currentImage],boundingBoxPendingLabels[currentImage]) }
    )
        );

        setLabelsRectLength(newLabelsState.labelRects.length);
        setLabelsPolygonLength(newLabelsState.labelPolygons.length);

  }, [currentImage, currentSelector]);



  // render suggestions on labels change
  useEffect(()=>{
    if(boundingBoxSuggestions[currentImage]){
      let labelsSugges=[];
      // console.log(`rect labels : ${JSON.stringify(labels)}`)
      labels.labelRects.forEach(label=>{
        // console.log(`label : ${JSON.stringify(label)}`);
        if(label.isSuggestion){
          labelsSugges.push(<CanvasSuggestion key={label.id} id={label.id}
                                              top={imageWidthFactor*label.rect.y + "px"}
                                              left={imageWidthFactor*label.rect.x+ label.rect.width/2 + "px"}
                                              tool={currentSelector}
                                              setLabels={setLabels}
                                              setBoundigBoxSuggestions={setBoundingBoxSuggestion}
                                              currentImage={currentImage}/>);
        }

      });
      setLabelsSuggestions(labelsSugges);
    }

  },[labels]);

  // render polygon suggestions on labels change
  useEffect(()=>{

    if(polygonSuggestions[currentImage]){
      let polygonLabelsSugges=[];
      // console.log(`rect labels : ${JSON.stringify(labels)}`)
      labels.labelPolygons.forEach(label=>{
        // console.log(`plabel : ${JSON.stringify(label)}`);
        if(label.isSuggestion){
          polygonLabelsSugges.push(<CanvasSuggestion key={label.id} id={label.id}
                                              top={imageWidthFactor*label["vertices"][0]["y"] + "px"}
                                              left={imageWidthFactor*label["vertices"][0]["x"]+ "px"}
                                              tool={currentSelector}
                                              setLabels={setLabels}
                                                     setPolygonSuggestion={setPolygonSuggestion}
                                              currentImage={currentImage}/>);
        }

      });
      setPolygonLabelsSuggestions(polygonLabelsSugges);
    }
  },[labels]);

  // can be used on icons
  const zoomAction = useMemo(
    () => ({
      default: () => setZoom(1),
      maxZoom: () => setZoom(2),
      zoom: (isZoomIn = true) => () =>
        setZoom((prev) => prev + (isZoomIn ? 1 : -1) * ZOOM_STEP),
    }),
    []
  );

  const handleCanvasOnChange = (data) => {
    // console.log("data", data);
    // console.log(`LabelRects length:${data["labelRects"].length}`);
    // console.log(`current pol length:${labelsPolygonLength}`);
    // console.log(`LabelPolygons length:${data["labelPolygons"].length}`);
    if (labelsRectLength < data["labelRects"].length) {
      if (!labelsIsVisible) {
        dispatch(
            actions.setCanvasLabelCurds(
                imageHeightFactor *
                data.labelRects[data.labelRects.length - 1].rect.y,
                0.9 *
                imageWidthFactor *
                data.labelRects[data.labelRects.length - 1].rect.x
            )
        );
      }else{
        if (!boundingBoxLabelsIsVisible) {
          // console.log("opening bb labels container");
          dispatch(actions.openLabelsContainer("boundingBoxLabelsIsVisible"));
        }
      }
       dispatch(actions.addPendingLabel({
              id:data.labelRects[data.labelRects.length - 1].id,
              top_left:[data.labelRects[data.labelRects.length - 1].rect.y,data.labelRects[data.labelRects.length - 1].rect.x],
              height:data.labelRects[data.labelRects.length - 1].rect.height,
              width:data.labelRects[data.labelRects.length - 1].rect.width,
         color:random_rgba(),
             rect:{
                x:data.labelRects[data.labelRects.length - 1].rect.x,
               y:data.labelRects[data.labelRects.length - 1].rect.y,
               width:data.labelRects[data.labelRects.length - 1].rect.width,
               height:data.labelRects[data.labelRects.length - 1].rect.height
              }
           },
            currentImage,currentSelector));
      setLabelsRectLength((prevState) => prevState + 1);
    } else if (labelsPolygonLength < data["labelPolygons"].length) {
      // console.log("new pol");

      if (!polygonLabelsIsVisible) {
        // console.log("opening pol labels container");
        dispatch(actions.openLabelsContainer("polygonLabelsIsVisible"));
      }
      // dispatch(actions.addCanvasLabel(data.labelPolygons[data.labelPolygons.length - 1].id));
      dispatch(actions.addPendingLabel({
        id:data.labelPolygons[data.labelPolygons.length - 1].id,color:random_rgba(),
          vertices:data.labelPolygons[data.labelPolygons.length-1].vertices}
        ,currentImage,currentSelector));
      setLabelsPolygonLength((prevState) => prevState + 1);
    }
  };
  const handleCanvasOnHover=(id)=>{
    dispatch(actions.currentHoverId(currentSelector,id));
  };

  const handleCanvasOnMouseOut=(id)=>{
    dispatch(actions.currentMouseOutId(currentSelector,id));
  };

  const handleExport=()=>{
    let jsonse = JSON.stringify(output);
    let blob = new Blob([jsonse], {type: "application/json"});
    setJsonURL(URL.createObjectURL(blob));
  }
  return (
    <div className="main-canvas">
      <CommonHeader>
        <div className="main-toolbar">
          {/*<Export*/}
          {/*  tool="redo"*/}
          {/*  flip="true"*/}
          {/*  type="redo.svg"*/}
          {/*  tooltip="Undo"*/}
          {/*></Export>*/}
          {/*<Export tool="undo" type="redo.svg" tooltip="Redo"></Export>*/}
          <ToolBarItem
            tool="zoomin"
            type="zoomIn.svg"
            tooltip="Zoom In"
            isSelected={false}
            onClick={zoomAction.zoom(true)}
          ></ToolBarItem>
          <ToolBarItem
            tool="zoomout"
            flip="true"
            type="zoomOut.svg"
            tooltip="Zoom Out"
            isSelected={false}
            onClick={zoomAction.zoom(false)}
          ></ToolBarItem>
          <ToolBarItem tool="move" type="hand.svg" tooltip="Move" isSelected={moveToolIsSelected}
          onClick={()=>{
            toggleDragMode(prevState=>!prevState);
            dispatch(actions.moveToolToggle());
          }}></ToolBarItem>
          <ToolBarItem
            tool="pointer"
            type="cursor.svg"
            tooltip="Pointer"
            isSelected={pointerToolIsSelected}
            onClick={()=>{
              toggleDragMode(prevState=>!prevState);
              dispatch(actions.moveToolToggle());
            }}
          ></ToolBarItem>
          <Export
              tool="export"
              type="export.svg"
              tooltip="Export Output"
              jsonURL={jsonURL}
          ></Export>
          <Selectors>
            <SelectorItem
              selector="boundingBox"
              isSelected={boundingBoxIsSelected}
              type="bounding-box.svg"
              tooltip="Bounding Box"
            ></SelectorItem>
            <SelectorItem
              selector="polygon"
              isSelected={polygonIsSelected}
              type="polygon.svg"
              tooltip="Segmentation"
            ></SelectorItem>
            <SelectorItem
              selector="classification"
              isSelected={classificationIsSelected}
              type="pin.svg"
              tooltip="Classification"
            ></SelectorItem>
          </Selectors>
        </div>
      </CommonHeader>
      {/* https://denvash.github.io/react-canvas-annotation/ */}
      {/* https://github.com/denvash/react-canvas-annotation */}

      {currentSelector==="classification" &&  isImageDrag===false && <div style={{position:"absolute",height:"100%",width:"100%",zIndex:1000000}}
                  onClick={()=>{
                    dispatch(actions.addPendingLabel({
                            id:classificationLabelsId
                        },
                        currentImage,"classification"));
                    dispatch(actions.increaseLabelsId());
                  }}></div>}

      {imageFile !== "" && (

            <ReactCanvasAnnotation
                zoom={zoom}
                imageFile={imageFile}
                labels={labels}
                onChange={(data) => {
                  handleCanvasOnChange(data);
                  // console.log(`onChange`, data);
                }}
                annotationType={annotationType}
                isImageDrag={isImageDrag}
                onHover={(id) => handleCanvasOnHover(id)}
                onClick={(id)=>console.log(id)}
                onMouseOut={(id) => handleCanvasOnMouseOut(id)}
            />



      )}


      {!labelsIsVisible && <CanvasLabel tool={currentSelector}/>}
      {currentSelector==="boundingBox" && labelsSuggestions }
      {currentSelector==="polygon" && polygonLabelsSuggestions }


      <button
        className={
          labelsIsVisible
            ? "toggle-labels flipHorizontal rotate90"
            : "toggle-labels rotate90 labelsPad  "
        }
        onClick={() => dispatch(actions.toggleMenu("labels"))}
      >
        {labelsIsVisible && <span>&#9660;</span>}
        {!labelsIsVisible && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div>&#9650;</div>
            <div style={{ fontSize: "1.2em" }}>Labels</div>
          </div>
        )}
      </button>
      <button
        className={
          imagesIsVisible ? "toggle-images rotate90 " : "toggle-images rotate90"
        }
        onClick={() => dispatch(actions.toggleMenu("images"))}
      >
        {imagesIsVisible && <span>&#9650;</span>}
        {!imagesIsVisible && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ fontSize: "1.2em" }}>Images</div>
            <div>&#9660;</div>
          </div>
        )}
      </button>

    </div>
  );
};

export default Canvas;
