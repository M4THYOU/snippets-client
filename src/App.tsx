import * as React from 'react'
import './App.scss';
import {withRouter} from "react-router";
import { Route, Switch, Redirect } from "react-router-dom";

// views
import { Main } from "./views/main";
import { NewSnippet } from "./views/new-snippet";
import { ViewSnippet } from "./views/view-snippet";
import { EditSnippet } from "./views/edit-snippet";
import { Login } from "./views/login";
import { Register } from "./views/register";
import { Profile } from "./views/profile";
import { ConfirmEmail } from "./views/confirm-email";

// Components
import { NavigationBar } from "./components/utils/navigationBar";

function App() {
  return (
    <div className="App">
        <NavigationBar />
        <Switch>
            <Route exact path="/" component={ Main } />

            <Route exact path="/login" component={ Login } />
            <Route exact path="/register" component={ Register } />
            <Route exact path="/register/:id" component={ ConfirmEmail } />
            <Route exact path="/my-profile" component={ Profile } />

            <Route exact path="/new" component={ NewSnippet } />
            <Route exact path="/snippet/:id" component={ ViewSnippet } />
            <Route exact path="/snippet/:id/edit" component={ EditSnippet } />

            <Redirect to="/" />
        </Switch>
    </div>
  );
}

export default withRouter(App);
