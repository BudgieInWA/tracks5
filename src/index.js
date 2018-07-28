import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import registerServiceWorker from './registerServiceWorker';

import './index.css';
import App from './App';
import appReducer from './appReducer';

const store = createStore(appReducer);

function render() {
  ReactDOM.render(<App store={store} />, document.getElementById('root'));
}

render();
const unsubscribe = store.subscribe(render);
registerServiceWorker();
