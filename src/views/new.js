import React, { Component } from "react";
import { Container } from "reactstrap";

// Components
import SnippetForm from "../components/snippetForm";

class New extends Component {

    constructor(props) {
        super(props);
        this.state = {
            //
        };
    }

    createSnippetHandler(e, values) {
        e.preventDefault();

        console.log(values);
    }

    render() {
        return (
            <div>
                <h1>Create New Snippet</h1>
                <Container>
                    <SnippetForm handler={ (e, values) => this.createSnippetHandler(e, values) }/>
                </Container>
            </div>
        );
    }

}

export default New;
