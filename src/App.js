import React, { Component } from "react";
import { createStore } from "redux";
import { devToolsEnhancer } from 'redux-devtools-extension';
import { Provider } from "react-redux";

import ActionTypes from './reducers/ActionTypes';
import appReducer from './reducers/appReducer';

import "./App.css";
import Map from "./Map";
import Toolbar from "./ToolUI";
import TurnControls from "./TurnUI";
// import NoiseTest from './NoiseTest.jsx';

const store = createStore(appReducer, devToolsEnhancer());


const panDirsHeld = { w: false, a: false, s: false, d: false };
function updatePanDir(key, down) {
  panDirsHeld[key] = !!down;

  const dx = 0 + panDirsHeld.d - panDirsHeld.a;
  const dy = 0 + panDirsHeld.s - panDirsHeld.w;
  store.dispatch({ type: ActionTypes.view.pan, dx, dy })
}

const handleKeyInput = (event) => {
  // if (event.code is a key that we control)
  event.preventDefault();
  console.debug('handling', {event});

  // TODO lowercase A-Z in event.key

  if (event.type === 'keydown') switch(event.key) {
    case '-':
      store.dispatch({type: ActionTypes.view.zoomOut});
      break;
    case '=':
      store.dispatch({type: ActionTypes.view.zoomIn});
      break;
  }
  if (event.type === 'keydown' && !event.repeat) switch(event.key) {
    case 'w':
    case 'a':
    case 's':
    case 'd':
      updatePanDir(event.key, true);
      break;
  }
  if (event.type === 'keyup') switch(event.key) {
    case 'w':
    case 'a':
    case 's':
    case 'd':
      updatePanDir(event.key, false);
      break;
  }
};

class App extends Component {
  componentDidMount() {
    window.document.body.addEventListener('keydown', handleKeyInput);
    window.document.body.addEventListener('keyup', handleKeyInput);

  }

  componentWillUnmount() {
    window.document.body.removeEventListener('keydown', handleKeyInput);
    window.document.body.removeEventListener('keyup', handleKeyInput);
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
