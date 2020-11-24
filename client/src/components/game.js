import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import axios from 'axios';
import Board from "./gameBoard";
import SideBar from "./sideBar";

export default function Game(props) {
  const [game, setGame] = useState(0)
  const [board, setBoard] = useState(0)
  const [players, setPlayers] = useState([])
  const [positions, setPositions] = useState([])
  const [tiles, setTiles] = useState([])
  const [chance, setChance] =useState(0)
  const [chanceUsed, setChanceUsed] = useState([])

  const drawChance = function(player) {
    setChanceUsed((current) => current + 1)
  }

  const rollDice = function(number, player) {
    // setChanceUsed((current) => current + 1)

    let ran = 0;

    const interval = setInterval(() => {
      ran++;

      setPositions((current) => {
        const newPositions = [...current]
        newPositions[player] = {...newPositions[player], current_tile: ((newPositions[player].current_tile + 1) % 24), done: (ran === number) ? true : false }
        return newPositions
      })

      if (ran === number) {
          window.clearInterval(interval);
      }
    }, 300);
  }

  useEffect(() => {
    axios.get(`/api/games`)
    .then((response) => {
      setGame(response.data[0].id)
    })
  }, [])

  useEffect(() => {
    if (players.length > 0) {
      axios.get(`/api/boards/${board}/players/${players[0].player.id}/draw_chance`)
      .then((response) => {
        setChance(response.data)
        console.log(response.data)
      })
    }
  }, [chanceUsed])

  useEffect(() => {
    if (game !== 0) {
      axios.get(`/api/games/${game}`)
      .then(() => {
        return axios.get(`/api/games/${game}/current_board`)
      })
      .then((response) => {
        if (!response.data) return axios.post(`/api/boards`, {game_id: game})
        return response
      })
      .then((response) => {
        if (!response.data) return
        setBoard(response.data.id);
      })
    }
  }, [game])

  useEffect(() => {
    if (board !== 0) {
      axios.get(`/api/boards/${board}/current_tiles`)
      .then((response) => {
        // handle success
        setPlayers(response.data);
      })
    }
  }, [board])

  useEffect(() => {
    if (board !== 0) {
      axios.get(`/api/boards/${board}/board_tiles`)
      .then((response) => {
        // handle success
        setTiles(response.data.map(tile => {
          return {
            tile: tile,
            id: tile.tile.id,
            name: tile.tile.name,
            colour: tile.color.hexcode,
            description: tile.tile.description,
            recommendation: tile.recommendations.map(rec => rec.book.name)
          }
        }));
      })
    }
  }, [board])

  useEffect(() => {
    const startPositions = []
    for (const player in players) {
      let p = { player: { ...players[player] } }
      let current_tile = 0
      if (players[player].current_tile) for (let i = 0; i < tiles.length; i++) if (tiles[i].id === current_tile.board_tile_id) current_tile = i
      p.current_tile = current_tile
      startPositions.push(p)
    }
    setPositions(startPositions)
  }, [players, tiles])

  return (
    <section className="game-view">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <div className="side-console">
        <div className='title' >MONOPOREAD</div>
        <SideBar chance={chance} players={players} rollDice={rollDice} board={board} />
      </div>
      <div className="game-play">
        <Router>
          <Board drawChance={drawChance} tiles={tiles} players={positions} board={board} />
        </Router>
      </div>
    </section>
  )
}
