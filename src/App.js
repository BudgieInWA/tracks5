import React, { Component } from "react";
import { Provider } from "react-redux";
import "./App.css";

import Map from "./Map";
import Toolbar from "./Toolbar";

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
            <Toolbar />
            <Map {...store.getState()} dispatch={store.dispatch} />
          </main>
        </div>
      </Provider>
    );
  }
}

export default App;
