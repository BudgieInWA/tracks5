import React, { Component } from 'react';
import './App.css';

import Map from './Map';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header>
          <h1>Hex Map Game</h1>
        </header>
        <Map />
      </div>
    );
  }
}

export default App;
