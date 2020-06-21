import React, { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useDropzone } from 'react-dropzone';
import actions from '../../Actions/index'





const AddFileBtn = (props) => {
    // console.log("currentID:",currentLabelCountID);
    const [files, setFiles] = useState([]);
    const dispatch = useDispatch();
    const { getRootProps, getInputProps } = useDropzone({
        accept: props.accept,
        onDrop: acceptedFiles => {
            acceptedFiles = files.concat(
                acceptedFiles.map((file,fileIndex) => Object.assign(file, {
                    preview: URL.createObjectURL(file),index:fileIndex
                })));
            // dispatch(actions.loadFiles(files));
            if (props.accept.indexOf("json") >= 0){
                fetch(acceptedFiles[0].preview)
                    .then(res => res.json())
                    .then(
                        result => {
                                dispatch(actions.loadLabels(result));
                            }
                    );
                // dispatch(actions.loadLabels(acceptedFiles));
            }
            else 
                dispatch(actions.loadImages(acceptedFiles));
            // setFiles(acceptedFiles);
        }
    });


    return (
        <div {...getRootProps({ className: 'main-images-dropZone' })}
             // style={{top:props.index*50}}
             // style={{width:"50%",borderRight:"1px solid  #eeeeee"}}
             style={{width:"50%"}}
        >
            <input {...getInputProps()} />
            {/* <p>Drag 'n' drop some files here, or click to select files</p> */}
            <span>{props.text}</span>
            <img alt="" src={process.env.PUBLIC_URL + "Images/addPhotoS.svg"}></img>

        </div>
    )
}

export default AddFileBtn;