import React from 'react'
import { useDispatch,useSelector } from 'react-redux'
import actions from '../../Actions/index'





const AddLabelBtn = (props) => {
    // console.log("currentID:",currentLabelCountID);
    const dispatch = useDispatch();
    const classificationLabelsId=useSelector((state)=>state.Labels.currentNewLabelID);
    const currentImage = useSelector((state) => state.Images.currentImage);
    return (
        <div className="main-labels-add-btn"
             onClick={()=>{
                 dispatch(actions.addPendingLabel({
                         id:classificationLabelsId
                     },
                     currentImage,"classification"));
                 dispatch(actions.increaseLabelsId());
             }}>
            <span>Add new classification</span>
            <img alt="" src={process.env.PUBLIC_URL + "Images/plusS.svg"}></img>
        </div>
    )
}

export default AddLabelBtn;