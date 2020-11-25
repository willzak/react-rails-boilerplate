import React, {useState, useEffect} from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import axios from 'axios';
import Board from "./gameBoard";
import SideBar from "./sideBar";

export default function Game(props) {
  const [game, setGame] = useState(0)
  const [board, setBoard] = useState(0)
  const [players, setPlayers] = useState([])
  const [currentPlayer, setCurrentPlayer] = useState(0)
  const [tiles, setTiles] = useState([])
  const [chance, setChance] =useState(0)
  const [chanceUsed, setChanceUsed] = useState(-1)

  const drawChance = function(player) {
    setChanceUsed(player)
  }

  const rollDice = function(number, player) {
    let ran = 0;

    const interval = setInterval(() => {
      ran++;
      
      setPlayers((current) => {
        const newPlayers = [...current]
        newPlayers[player] = {...newPlayers[player], player: {...newPlayers[player].player, position: ((newPlayers[player].player.position + 1) % 24), done: (ran === number) ? true : false } }
        if (ran === number) axios.put(`/api/games/${game}/players/${newPlayers[player].player.id}`, { position: newPlayers[player].player.position })
        return newPlayers
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
    if (players.length > 0 && chanceUsed !== -1) {
      console.log(players[chanceUsed])
      axios.get(`/api/boards/${board}/players/${players[chanceUsed].player.id}/draw_chance`)
      .then((response) => {
        setChance(response.data)
        setChanceUsed(-1)
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
      axios.get(`/api/boards/${board}/players`)
      .then((response) => {
        setPlayers(response.data);
      })
    }
  }, [board])

  useEffect(() => {
    if (board !== 0) {
      axios.get(`/api/boards/${board}/board_tiles`)
      .then((response) => {
        setTiles(response.data.map(tile => {
          return {
            tile: tile,
            id: tile.id,
            name: tile.tile.name,
            colour: tile.color.hexcode,
            description: tile.tile.description,
            recommendation: tile.recommendations.map(rec => rec.book.name)
          }
        }));
      })
    }
  }, [board])

  return (
    <section className="game-view">
      <meta name="viewport" content="width=device-width, initial-scale=1.0"></meta>
      <div className="side-console">
        <div className='title' >MONOPOREAD</div>
        <SideBar currentPlayer={currentPlayer} setCurrentPlayer={setCurrentPlayer} rollDice={rollDice} chance={chance} players={players} board={board} />
      </div>
      <div className="game-play">
        <Router>
          <Board drawChance={drawChance} currentPlayer={currentPlayer} tiles={tiles} players={players} board={board} />
        </Router>
      </div>
    </section>
  )
}
