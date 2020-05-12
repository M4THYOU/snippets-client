import React from 'react';
import './App.css';
import {withRouter} from "react-router";
import { Route, Switch } from "react-router-dom";

// views
import Main from "./views/main";
import New from "./views/new";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={ Main } />
        <Route exact path="/new" component={ New } />
      </Switch>
    </div>
  );
}

export default withRouter(App);
