import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import WorldMap from './components/WorldMap.jsx'

class App extends Component {
  render() {
    return (
        <div id="map">
            <WorldMap />
        </div>
    );
  }
}

export default App;
