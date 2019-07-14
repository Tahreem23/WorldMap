import React, { Component } from 'react';
import './App.css';
import socketIOClient from "socket.io-client";
import WorldMap from './components/WorldMap.jsx'

class App extends Component {
  constructor() {
    super()
    this.state = {
      shots: [],
      numShots: 0,
      error: null
    }
    this.startTime = new Date();
    this.startTime = Math.round(this.startTime.getTime() / 1000);
    this.host = process.env.REACT_APP_HOST;
    const test_key = process.env.REACT_APP_TEST_KEY;
    if (test_key) {
      this.host = `${this.host}?test_key=${test_key}`
    }
    this.connectionOptions = {
      "force new connection": true,
      "reconnectionAttempts": "Infinity",
      "timeout": 10000,
      "transports": ["websocket"],
      path: process.env.REACT_APP_SOCKET_ROUTE
    }
    this.socket = socketIOClient(this.host, this.connectionOptions);
    this.socket.on('shotTaken', shot => this.handleShot(shot));
    this.socket.on('invalidOrigin', msg => this.handleOrigin(msg));

  }



  handleShot(shot) {
    shot = JSON.parse(shot);
    shot.isNew = true;
    let { shots, numShots } = this.state;
    numShots += 1;

    for (var i = 0; i < shots.length; i++) {
      shots[i].isNew = false;
    }

    shots.push(shot);
    // this.audio.play()
    this.setState({ shots, numShots })
  }

  handleOrigin(error) {
    console.log('got an error', error)
    this.setState({ error })
  }

  render() {

    return (
      <div id="map">
            <WorldMap data={this.state.shots}/>
        </div>
    );
  }
}

export default App;