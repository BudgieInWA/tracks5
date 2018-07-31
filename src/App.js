import React, { Component } from 'react';
import './App.css';

import Map from './Map';
import Toolbar from './Toolbar';

class App extends Component {
  render() {
    const { store } = this.props;
    return (
      <div className="App">
        <header>
          <h1>Hex Map Game</h1>
        </header>
        <main>
          <Toolbar {...store.getState()} dispatch={store.dispatch} />
          <Map {...store.getState()} dispatch={store.dispatch} />
        </main>
      </div>
    );
  }
}

export default App;
