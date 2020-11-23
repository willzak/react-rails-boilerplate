import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { useRouteMatch } from "react-router-dom";

export default function Square(props) {
  let type = "square " + props.direction + "-square";

  return (
    <div class={type}>
       <Link to = {`/tiles/${props.id}`}>
      <h4>{props.name}</h4>
      </Link>
    </div>
  )
}