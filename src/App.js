import React, { Component } from 'react';
import './App.css';

import Map from './Map';

class App extends Component {
  render() {
    const { store } = this.props;
    return (
      <div className="App">
        <header>
          <h1>Hex Map Game</h1>
        </header>
        <Map {...store.getState()} dispatch={store.dispatch} />
      </div>
    );
  }
}

export default App;
