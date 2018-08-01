import React, { Component } from "react";
import { createStore } from "redux";
import { Provider } from "react-redux";
import appReducer from "./reducers/appReducer";

import "./App.css";
import Map from "./Map";
import Toolbar from "./Toolbar";
import TurnControls from "./TurnControls";

const store = createStore(appReducer);

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <header>
            <h1>Hex Map Game</h1>
          </header>
          <main>
            <Map />
            <Toolbar />
            <TurnControls />
          </main>
        </div>
      </Provider>
    );
  }
}

export default App;
