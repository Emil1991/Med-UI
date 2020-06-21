import React from 'react'
import {useSelector} from 'react-redux'
import Labels from '../Labels/Labels'
import Canvas from '../Canvas/Canvas'
import Images from '../Images/Images'

const Main = () => {
    const labelsIsVisible=useSelector(state=>state.Toggles.labelsVisible);
    const imagesIsVisible=useSelector(state=>state.Toggles.imagesVisible);
    let mainClassName='main';
    if(labelsIsVisible && imagesIsVisible)
        mainClassName='main'
    else if(labelsIsVisible)
        mainClassName='main wLabels'
    else if(imagesIsVisible)
        mainClassName='main wImages'
    else
        mainClassName='main solo'

        return (
        <div className={mainClassName}>
            <Labels isOpen="true"></Labels>
            <Canvas></Canvas>
            <Images isOpen="true"></Images>
        </div>
    )
}

export default Main;
