import _ from 'lodash';
import React, { Component } from "react";
import { createStore } from "redux";
import { devToolsEnhancer } from 'redux-devtools-extension';
import { Provider } from "react-redux";

import ActionTypes from './reducers/ActionTypes';
import appReducer from './reducers/appReducer';

import * as Inputs from './Inputs';

import "./App.css";
import Map from "./Map";
import Toolbar from "./ToolUI";
import TurnControls from "./TurnUI";
// import NoiseTest from './NoiseTest.jsx';

const store = createStore(appReducer, devToolsEnhancer());


class App extends Component {
  componentDidMount() {
    //TODO move binding into Inputs
    this.inputHandler = Inputs.getHandler({ dispatch: store.dispatch });
    _.each(Inputs.eventTypes, type => window.document.body.addEventListener(type, this.inputHandler));
  }

  componentWillUnmount() {
    _.each(Inputs.eventTypes, type => window.document.body.removeEventListener(type, this.inputHandler));
  }

  render() {
    return (
      <Provider store={store}>
        <div className="App">
          <header>
            <ul>
              <li>Zoom with <kbd>-</kbd> <kbd>+</kbd>{/* or <kbd>Scroll Wheel</kbd>*/}.</li>
              <li>Pan with <kbd>w</kbd> <kbd>a</kbd> <kbd>s</kbd> <kbd>d</kbd>{/* or <kbd>↑</kbd><kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd> or <kbd>Right Click</kbd>*/}.</li>
              <li>Choose a tool with <kbd>Click</kbd> on the toolbar{/* or <kbd>1</kbd> <kbd>2</kbd> <kbd>3</kbd>...*/}</li>
              <li>See how it behaves :)</li>

            </ul>
          </header>
          <main>
            <Map />
            <Toolbar />
            <TurnControls />
            {/*<NoiseTest />*/}
          </main>
        </div>
      </Provider>
    );
  }
}

export default App;
