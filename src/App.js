import React from 'react';
import './App.css';
import {withRouter} from "react-router";
import { Route, Switch } from "react-router-dom";

// views
import Main from "./views/main";
import NewSnippet from "./views/new-snippet";
import ViewSnippet from "./views/view-snippet";

function App() {
  return (
    <div className="App">
      <Switch>
        <Route exact path="/" component={ Main } />
        <Route exact path="/new" component={ NewSnippet } />
        <Route exact path="/snippet/:id" component={ ViewSnippet } />
      </Switch>
    </div>
  );
}

export default withRouter(App);
