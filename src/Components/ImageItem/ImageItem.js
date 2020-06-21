import React from 'react'
import {useSelector,useDispatch} from 'react-redux'
import Completed from '../Completed/Completed'
import actions from '../../Actions'

const ImageItem = (props) => {
    const dispatch=useDispatch();
    const currentSelector=useSelector(state=>state.Tools.currentSelector);
    // const currentImage=useSelector(state=>state.Tools[currentSelector].currentImage);
    const thisImageName=props.name.substring(0,props.name.lastIndexOf('.'));

    return (
        <div className={props.isSelected? "main-images-item selectedImage":"main-images-item"} onClick={()=>{
            // if(thisImageName!==currentImage){
            // console.log(`currentImage ${props.currentImage}`);
            // console.log(`thisImage ${thisImageName}`);
                if(!props.isSelected){
                dispatch(actions.imageChange(thisImageName));
            }else{
                    // console.log('image is Selected!!')
                }
        }}>
            <img completed={props.completed} alt="" src={process.env.PUBLIC_URL + props.source}></img>
            <div style={{alignSelf:"center",marginTop:"2px"}}>{props.name}</div>
            {props.completed==="true" && <Completed></Completed>}
        </div>
    )
}

export default ImageItem;