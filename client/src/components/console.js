import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import TileInfo from "./tileInfo.js"

export default function Console(props) {
  const tileData = [
    {
      id: 1,
      name: "Read A Poetry Book",
      colour: "pink",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin molestie.",
        recommendation: ["BookA", "BookB", "BookC"]
    },
    {
      id: 2,
      name: "Read A Sci-Fi Book",
      colour: "pink",
      description:
        "Mauris finibus, massa eu tempor volutpat, magna dolor euismod dolor.",
      recommendation: ["Book1", "Book2", "Book3"]
    },
    {
      id: 3,
      colour: "orange",
      name: "Read A Horror Book",
      description:
        "Bloop Mauris finibus, massa eu tempor volutpat, magna dolor euismod dolor.",
      recommendation: ["BookI", "BookII", "BookIII"]
    },
    {
      id: 4,
      colour: "orange",
      name: "Read A Fantasy Book",
      description:
        "Blah Mauris finibus, massa eu tempor volutpat, magna dolor euismod dolor.",
      recommendation: ["BookD", "BookE", "BookF"]
    },
  ];
  return (
    <div class="console">
       <Route path="/tiles/:tileId"><TileInfo data={tileData} /></Route>
    </div>
  )
}