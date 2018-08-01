import React, { Component } from "react";
import { Provider } from "react-redux";
import "./App.css";

import Map from "./Map";
import Toolbar from "./Toolbar";
import TurnControls from "./TurnControls";

class App extends Component {
  render() {
    const { store } = this.props;
    return (
      <Provider store={store}>
        <div className="App">
          <header>
            <h1>Hex Map Game</h1>
          </header>
          <main>
            <Map {...store.getState()} dispatch={store.dispatch} />
            <Toolbar />
            <TurnControls />
          </main>
        </div>
      </Provider>
    );
  }
}

export default App;
