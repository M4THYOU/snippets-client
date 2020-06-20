import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'bootstrap/dist/css/bootstrap.css';
import { BrowserRouter } from "react-router-dom";
import { Route, Switch } from "react-router-dom";
import CanvasView from "./note-taking/views/canvasView";

ReactDOM.render(
    <BrowserRouter>
        <Switch>
            <Route exact path="/canvas" component={ CanvasView } />
            <App />
        </Switch>
    </BrowserRouter>,
    document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
