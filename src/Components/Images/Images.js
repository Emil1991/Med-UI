import React from 'react'
import { useSelector } from 'react-redux'
import CommonHeader from '../CommonHeader/CommonHeader'
import CommonTitle from '../CommonTitle/CommonTitle'
import ImagesContainer from '../ImagesContainer/ImagesContainer'

const Images = (props) => {
    const imagesIsVisible = useSelector(state => state.Toggles.imagesVisible);

    return (
        <div className={imagesIsVisible?"main-images":"main-images hide"}>
            <CommonHeader></CommonHeader>
            <CommonTitle text="Images"></CommonTitle>
            <ImagesContainer></ImagesContainer>
        </div>
    )
}

export default Images;
