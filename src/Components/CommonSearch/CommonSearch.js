import React,{useState} from 'react'
import {useDispatch} from 'react-redux'
import actions from '../../Actions'

const CommonSearch = (props) => {
    const [searchQuery,setSearchQuery]=useState('');

    let dispatch=useDispatch();

    return (
        <div className="common-search">
            <img alt="" src={process.env.PUBLIC_URL + "Images/searchS.svg"}></img>
            <input value={searchQuery} type="text" placeholder="Search a label"
                onChange={(e)=>{
                    dispatch(actions.searchLabel(e.target.value));
                    setSearchQuery(e.target.value);
                }}></input>
            <img className="common-search-delete" alt="" src={process.env.PUBLIC_URL + "Images/cancelS.svg"}
                onClick={()=>{
                    dispatch(actions.searchLabel(''));
                    setSearchQuery('');   
                }}></img>
        </div>
    )
}

export default CommonSearch;