import React, { Component } from "react";
import "./App.css";
import socketIOClient from "socket.io-client";
import WorldMap from "./components/WorldMap.jsx";
import WorldMapSelection from "./components/WorldMapSelection";
//I am going to stateup code
class App extends Component {
  constructor() {
    super();
    this.state =
    {
      shots: [],
      numShots: 0,
      error: null,
      settings:
          {  pulseDuration: 500,
        maxVisibilityHours:1,
        historicData:0
          },

      modalActive: false
      }
      this.pulseDuration = '';
      this.historicDate=''
      this.maxVisibilityHours=''


      this.submitClick = this.submitClick.bind(this);
      this.openModal = this.openModal.bind(this);
      this.closeModal = this.closeModal.bind(this);

    this.startTime = new Date();
    this.startTime = Math.round(this.startTime.getTime() / 1000);
    this.host = process.env.REACT_APP_HOST;

    const test_key = process.env.REACT_APP_TEST_KEY;
    if (test_key) {
      this.host = `${this.host}?test_key=${test_key}`;
    }
    this.connectionOptions = {
      "force new connection": true,
      reconnectionAttempts: "Infinity",
      timeout: 10000,
      transports: ["websocket"],
      path: process.env.REACT_APP_SOCKET_ROUTE
    };
    this.socket = socketIOClient(this.host, this.connectionOptions);
    this.socket.on("shotTaken", shot => this.handleShot(shot));
    this.socket.on("invalidOrigin", msg => this.handleOrigin(msg));
  }

  handleShot(shot) {
    shot = JSON.parse(shot);
    var d = new Date();
    shot.isNew =true;
    shot.timeAddon = d.setHours(d.getHours() - this.state.maxVisibilityHours);

    let { shots, numShots } = this.state;
    numShots += 1;

    for (var i = 0; i < shots.length; i++) {
      shots[i].isNew = false;
    }

    shots.push(shot);
    // this.audio.play()
    this.setState({ shots, numShots });
  }

  handleOrigin(error) {
    console.log("got an error", error);
    this.setState({ error });
  }
//World map selection code ##########

  submitClick() {

    this.setState({
      settings:{  pulseDuration: this.pulseDuration.value,
        maxVisibilityHours:this.maxVisibilityHours.value,
        historicData:this.historicDate.value}
    });
  //  this.setState({maxVisibilityHours:this.pulseDuration.value});
  //  this.setState({historicData:this.historicData.value});
this.setState({ modalActive: false })

  //  console.log(this.pulseDuration.value);
    //this.pulse = document.getElementById("pulseDuration").value;
  }


  openModal = () => {
    this.setState({ modalActive: true });
  }

  closeModal = () => {
    //console.log("check");
    this.setState({ modalActive: false });
  }



  render() {
    return(
      <div>
        <button onClick={this.openModal}>Open modal</button>

        <div>
            {this.state.modalActive && (
              <div id="openModal" className="modalDialog">
                <div>

                  <a title='Close' onClick={this.closeModal} className="close">X</a>
                    <form>
                      <div className="form-group">
                        <label>Pulse duration</label>
                        <input
                          id="pulseDuration" ref = {e1 => this.pulseDuration = e1}
                          type="text"
                          name="pulseDuration"
                          onChange={this.handleChange}
                        />
                      </div>
                      <div className="form-group">
                        <label>Max visibility hours</label>
                        <input id="maxVisibilityHours" ref={e2=>this.maxVisibilityHours=e2} type="text" name="maxVisibilityHours" />
                      </div>
                      <div className="form-group">
                        <label>Historic Data</label>
                        <input id="historicData" ref={e2=>this.historicDate=e2} type="text" name="historicData" />
                      </div>
                      <button onClick={this.submitClick} type="button">
                        Submit
                      </button>
                    </form>

                </div>
              </div>

            )}
        </div>
         <WorldMapSelection
          pulseDuration={this.state.settings.pulseDuration}
          maxVisibilityHours={this.state.settings.MaxVisibilityHours}
          historicData={this.state.settings.historicData}
          shots={this.state.shots} />;
    </div>
  );
  }
}

export default App;
