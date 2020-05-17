import React, { Component } from "react";
import { Container } from "reactstrap";

// Components
import RawSnippet from "../components/rawSnippet";

// Functions/Enums
import {apiGet} from "../api/functions";
import {EndpointsEnum} from "../api/endpoints";

class ViewSnippet extends Component {

    constructor(props) {
        super(props);

        this.state = {
            course: null,
            created_at: null,
            id: props.match.params.id,
            notes: [],
            raw: [],
            type: null,
            title: null,
            updated_at: null,
        };
    }

    componentDidMount() {
        this.getSnippet();
    }

    getSnippet() {
        apiGet(EndpointsEnum.SNIPPETS, this.state.id)
            .then(res => res.json())
            .then(result => {
                const snippet = result.data;
                snippet['raw'] = JSON.parse(snippet.raw).raw_snippet;
                this.setState(snippet);
            })
            .catch(e => {
                console.error(e);
            })
    }

    render() {
        return (
            <Container>
                <h1>{ this.state.title }</h1>
                <hr />
                <RawSnippet raw={this.state.raw}/>
                <hr />
                <h3>Notes</h3>
            </Container>
        );
    }

}

export default ViewSnippet;
