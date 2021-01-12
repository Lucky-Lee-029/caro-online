import React, { useContext, useEffect, useState } from 'react';
import { withRouter } from "react-router";

import './css/game.css';
import axios from 'axios';

import Board from './Board';
import Timer from './Timer';
import WinDialog from './Dialog';

import Config from '../../constants/configs';
import Status from './Status';
import UserCtx from '../../context/User';
import { nspRooms } from '../../socket';
import Card from '@material-ui/core/Card';
import Button from '@material-ui/core/Button';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import CardContent from '@material-ui/core/CardContent';
import TextField from '@material-ui/core/TextField';
import { CssBaseline, useRadioGroup } from '@material-ui/core';
import { ExitToApp } from '@material-ui/icons';

const Game = (props) => {
  const [chats, setChats] = useState([]);
  const [message, setMessage] = useState("");
  const [user, setUser] = useContext(UserCtx);
  const [currentSquare, setCurrentSquare] = useState({ x: 0, y: 0 });
  const [step, setStep] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [winner, setWinner] = useState(null);
  const [winCells, setWinCells] = useState([]);
  const [isStart, setIsStart] = useState(false);
  const [isYourTurn, setIsYourTurn] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [isRivalReady, setIsRivalReady] = useState(false);
  const [rivalGame, setRivalGame] = useState("");
  const [history, setHistory] = useState([{
    time: 0,
    x: null,
    y: null,
    squares: Array(Config.brdSize).fill(null).map(() => {
      return Array(Config.brdSize).fill(null)
    })
  }]);

  const getTime = () => {
    let date = new Date();
    return date.getTime();
  }

  useEffect(()=>{
    nspRooms.emit("join_game", user, props.location.state);
  },[])

  useEffect(()=>{
    nspRooms.on("rival_join", user=>{
      setRivalGame(user);
    })
  },[])

  useEffect(()=>{
    nspRooms.on("old_player", user=>{
      setRivalGame(user);
    })
  },[])

  useEffect(() => {
    // if(!nspOnlineUsers.hasListener("got_new_step")){
    nspRooms.on("got_new_step", (data) => {
      handleNewStep(data);
    });
    // }
  }, []);

  useEffect(() => {
    console.log("Listening rival");
    nspRooms.on("ready_client", () => {
      console.log("Rival ready!");
      setIsRivalReady(true);
    })
  }, [])

  useEffect(() => {
    nspRooms.on("new_chat", (data) => {
      console.log("new chat");
      setChats(currentChats => {
        return currentChats.concat(data);
      });
    });
  }, [])

  useEffect(() => {
    nspRooms.on("got_winner", () => {
        updateCup(-props.location.cup);
        setOpen(true);
    })
  }, []);

  useEffect(() => {
    setWinCells(checkWin(currentSquare.x, currentSquare.y, winner, step));
    console.log("-" + currentSquare.x + ", " + currentSquare.y + "," + ", " + winner + ", " + step);
  }, [winner]);

  useEffect(() => {
    console.log("STEP" + step);
    console.log("Data lenght: " + history.length);
    console.log(history);
    setStep(history.length - 1);
  }, [history]);
  useEffect(() => {
    if (isReady && isRivalReady) {
      setIsStart(true);
    }
  }, [isReady, isRivalReady])

  useEffect(()=>{
    nspRooms.on("lose",()=>{
      updateCup(-props.location.cup);
      setOpen(true);
      setWinner("rival");
    })
  },[]);

  const handleChatChange = (e) => {
    setMessage(e.target.value);
  }
  const handleSendChat = () => {
    const data = {
      content: message,
      id: 1,
      time: getTime(),
      name: user.profile.name
    }
    nspRooms.emit("chat", data, String(props.location.state));
  }

  const onTimeOut = () => {
    if (!isYourTurn) {
      let currentUser = (history.length % 2 === 0) ? Config.xPlayer : Config.oPlayer;
      nspRooms.emit("win_game", currentUser, String(props.location.state));
      setWinner("you");
      const model = getModel();
      console.log(model);
    }
  }


  const updateCup = async (cup)=>{
    console.log("Update: ", cup);
    let api = `http://localhost:8000/users_api/cup/` + user.profile._id;
    await axios.post(api, cup);
  }

  const saveGame = async (model)=>{
    await axios.post("http://localhost:8000/users_api/game", model);
  }

  // lưu model gửi lên db
  const getModel = () => {
    const model = {};
    model.cup = props.location.cup;
    model.history = history;
    model.chats = chats;
    model.winner = user._id;
    model.loser = rivalGame._id;
    model.timeEnd = getTime();
    return model;
  }


  const handelReady = () => {
    setIsReady(true);
    if (!isRivalReady) {
      setIsYourTurn(true);
    }
    nspRooms.emit("ready", String(props.location.state));
  }
  const handleLeave = ()=>{
    nspRooms.emit("leave_room", String(props.location.state), user);
    history.push('/');
  }
  const moves = [];
  const isPlayerX = true;
  return (
    <div className="App">
      <WinDialog 
        open={open} 
        winner={winner} 
        cup={props.location.cup} 
        room={props.location.state}>
      </WinDialog>
      <CssBaseline />
      <header className="App-header">
        <Status messages={winner ? ("Winner: " + winner) : (isYourTurn ? "Your turn" : "Waiting for players")} />
        <div className="board-game">
          <div>
            <Board winCells={winCells}
              squares={history[history.length - 1].squares}
              currentPlayer={currentPlayer}
              currentCell={currentSquare}
              handleClick={userClick} />
          </div>
          <br></br>
          <div>
            <Card className="card">
              <CardContent>
                <Table aria-label="custom pagination table">
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        Your info
                      </TableCell>
                      <TableCell>
                        {rivalGame===""? "Chờ đối thủ" : rivalGame.profile.name}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <div style={{marginTop: 20}}>
                      {
                        !isStart ? (
                          isReady ? (<Button className="isreadybtn">Waiting for players</Button>) :
                            (<Button className="isreadybtn"  variant="contained" color="primary" onClick={handelReady}>Ready</Button>)
                        ) : (null)
                      }
                      </div>
                    </TableRow>
                    <TableRow>
                      {
                        (isYourTurn && !winner && isStart) ? (
                          <Timer
                            time={props.location.time}
                            onTimeOut={onTimeOut}
                          />
                        ) : (
                            <TableCell>Wait</TableCell>
                          )
                      }
                      {
                        (!isYourTurn && !winner && isStart) ? (
                          <Timer
                            time={props.location.time}
                            onTimeOut={onTimeOut}
                          />
                        ) : (
                            <TableCell>Wait</TableCell>
                          )
                      }
                    </TableRow>
                  </TableBody>
                </Table>
                <Table>
                  <TableBody>
                    <TableRow>
                      Chat
                                        </TableRow>
                    {
                      chats.map((item) => {
                        return (
                          <TableRow>
                            <b>{item.name}:</b> {item.content}
                          </TableRow>
                        )
                      })
                    }
                  </TableBody>
                </Table>
                <TextField
                  variant="outlined"
                  margin="normal"
                  fullWidth
                  id="mess"
                  name="mess"
                  autoComplete="mess"
                  onChange={handleChatChange}
                />
                <Button variant="contained" color="primary" onClick={handleSendChat}>Send</Button>
              </CardContent>
            </Card>
            <Button
              onClick = {handleLeave}
              style={{marginTop: 10}}
              variant="contained"
              color="primary"
              endIcon={<ExitToApp />}
            >
              leave
            </Button>
          </div>
        </div>
      </header>
    </div>
  )

  function checkWin(row, col, user, stepNumber) {

    if (stepNumber === 0) {
      return null;
    }

    const current = history[stepNumber];
    const squares = current.squares.slice();

    let coorX = row;
    let coorY = col;

    let countCol = 1;
    let countRow = 1;
    let countMainDiagonal = 1;
    let countSkewDiagonal = 1;
    let isBlock;
    const rival = (user === Config.xPlayer) ? Config.oPlayer : Config.xPlayer;

    // Check col
    isBlock = true;
    let winCells = [];
    coorX -= 1;
    while (coorX >= 0 && squares[coorX][coorY] === user) {
      countCol += 1;
      winCells.push([coorX, coorY]);
      coorX -= 1;
    }
    if (coorX >= 0 && squares[coorX][coorY] !== rival) {
      isBlock = false;
    }
    coorX = row;
    winCells.push([coorX, coorY]);
    coorX += 1;
    while (coorX <= Config.brdSize - 1 && squares[coorX][coorY] === user) {
      countCol += 1;
      winCells.push([coorX, coorY]);
      coorX += 1;
    }
    if (coorX <= Config.brdSize - 1 && squares[coorX][coorY] !== rival) {
      isBlock = false;
    }
    coorX = row;
    if (isBlock === false && countCol >= 5) return winCells;

    // Check row
    isBlock = true;
    winCells = [];
    coorY -= 1;
    while (coorY >= 0 && squares[coorX][coorY] === user) {
      countRow += 1;
      winCells.push([coorX, coorY]);
      coorY -= 1;
    }
    if (coorY >= 0 && squares[coorX][coorY] !== rival) {
      isBlock = false;
    }
    coorY = col;
    winCells.push([coorX, coorY]);
    coorY += 1;
    while (coorY <= Config.brdSize - 1 && squares[coorX][coorY] === user) {
      countRow += 1;
      winCells.push([coorX, coorY]);
      coorY += 1;
    }
    if (coorY <= Config.brdSize - 1 && squares[coorX][coorY] !== rival) {
      isBlock = false;
    }
    coorY = col;
    if (isBlock === false && countRow >= 5) return winCells;

    // Check main diagonal
    isBlock = true;
    winCells = [];
    coorX -= 1;
    coorY -= 1;
    while (coorX >= 0 && coorY >= 0 && squares[coorX][coorY] === user) {
      countMainDiagonal += 1;
      winCells.push([coorX, coorY]);
      coorX -= 1;
      coorY -= 1;
    }
    if (coorX >= 0 && coorY >= 0 && squares[coorX][coorY] !== rival) {
      isBlock = false;
    }
    coorX = row;
    coorY = col;
    winCells.push([coorX, coorY]);
    coorX += 1;
    coorY += 1;
    while (coorX <= Config.brdSize - 1 && coorY <= Config.brdSize - 1 && squares[coorX][coorY] === user) {
      countMainDiagonal += 1;
      winCells.push([coorX, coorY]);
      coorX += 1;
      coorY += 1;
    }
    if (coorX <= Config.brdSize - 1 && coorY <= Config.brdSize - 1 && squares[coorX][coorY] !== rival) {
      isBlock = false;
    }
    coorX = row;
    coorY = col;
    if (isBlock === false && countMainDiagonal >= 5) return winCells;

    // Check skew diagonal
    isBlock = true;
    winCells = [];
    coorX -= 1;
    coorY += 1;
    while (coorX >= 0 && coorY >= 0 && squares[coorX][coorY] === user) {
      countSkewDiagonal += 1;
      winCells.push([coorX, coorY]);
      coorX -= 1;
      coorY += 1;
    }
    if (coorX >= 0 && coorY >= 0 && squares[coorX][coorY] !== rival) {
      isBlock = false;
    }
    coorX = row;
    coorY = col;
    winCells.push([coorX, coorY]);
    coorX += 1;
    coorY -= 1;
    while (coorX <= Config.brdSize - 1 && coorY <= Config.brdSize - 1 && squares[coorX][coorY] === user) {
      countSkewDiagonal += 1;
      winCells.push([coorX, coorY]);
      coorX += 1;
      coorY -= 1;
    }
    if (coorX <= Config.brdSize - 1 && coorY <= Config.brdSize - 1 && squares[coorX][coorY] !== rival) {
      isBlock = false;
    }
    if (isBlock === false && countSkewDiagonal >= 5) return winCells;

    return null;
  }

  function userClick(row, col) {
    // prevent click in rival turn
    if (!isYourTurn) {
      return;
    };
    if (winner) {
      return;
    }
    // set current uset
    let currentUser = (history.length % 2 !== 0) ? Config.xPlayer : Config.oPlayer;
    if (step > 0) {
      if (history[step].squares[row][col] !== null)
        return;
    }
    setCurrentPlayer(1 - currentPlayer);
    // set new history
    let currentHis = history;
    setCurrentSquare({ x: row, y: col });
    let newState = {
      time: getTime(),
      x: row,
      y: col,
      squares: history[step].squares
    };
    newState.squares[row][col] = currentUser;
    currentHis.push(newState);
    setHistory(currentHis);
    // emit event play
    nspRooms.emit("play_new_step", newState, String(props.location.state));
    // emit event win game
    if (checkWin(row, col, currentUser, step)) {
      console.log("WON");
      nspRooms.emit("win_game", currentUser, String(props.location.state));
      console.log("-" + row + ", " + col + "," + ", " + currentUser + ", " + step);
      const model = getModel();
      console.log(model);
      setWinner("you");
      saveGame(model);
      // setWinCells(checkWin(row, col, currentUser, step));
    }
    // set new step
    setStep(step + 1);
    setIsYourTurn((turn) => {
      return false;
    })
    // setCountDown(time);
  }
  function handleNewStep(data) {
    let currentUser = (history.length % 2 !== 0) ? Config.xPlayer : Config.oPlayer;
    let currentHis = history;
    console.log(history);
    setCurrentPlayer(1 - currentPlayer);
    setCurrentSquare({ x: data.x, y: data.y });
    let newState = data;
    console.log("current user: " + currentUser);
    newState.squares[data.x][data.y] = currentUser;
    const newHis = currentHis.concat(newState);
    setHistory(currentHis => {
      return currentHis.concat(newState);
    });
    setIsYourTurn((turn) => {
      return true;
    });
    // setCountDown(time);
  }
}
export default Game;