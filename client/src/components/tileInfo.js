import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import './tileInfo.css'
import Form from './bookForm.js'
import Description from "./tileDescription.js"

export default function TileInfo( {data}, props ) {

  const  {tileId}  = useParams(); 

  const tile = data.find((t) => t.id === Number(tileId));
  let tileData; 

  const [showForm, setShowForm] = useState(false)
  const [showInfo, setShowInfo] = useState(true)
  const [showButton, setShowButton] = useState(true)
  
  const onClick = () => {
    setShowInfo(false);
    setShowButton(false); 
    setShowForm(true);
   }

  if (tile) {
    tileData = (
      <div className="indvidual-tile" >
        <div className="individual-tile-header" style={ {background: `${tile.colour}`} } >
        <h2> This is ID: {tileId}</h2>
        <h1> {tile.name}</h1>
        </div>
        { showInfo ? <Description 
          description = {tile.description} 
          books = {tile.books} 
          firstbookrec = {tile.recommendation[0]} 
          secondbookrec = {tile.recommendation[1]} 
          thirdbookrec = {tile.recommendation[2]} 
          /> : null }
        { showButton ? <button onClick = {onClick}>Completed!</button> : null }
        { showForm ? <Form /> : null }
      </div>
    )
  } else {
    tileData = <h4>Sorry! That tile doesn't exist</h4>
  }
return (
  <>
  <div>
    {tileData}
  </div>
  </>
); 

};