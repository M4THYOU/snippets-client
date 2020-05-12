import React, { Component } from "react";
import { Link } from "react-router-dom";

class Main extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //
        };
    }

    render() {
        return (
            <div>
                <h1>Snippets</h1>
                <Link to="/new">New Snippet</Link>
            </div>
        );
    }

}

export default Main;
