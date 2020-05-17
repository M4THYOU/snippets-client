import React, { Component } from "react";
import { Container, Alert } from "reactstrap";

// Components
import SnippetForm from "../components/snippetForm";

// Functions/Enums
import {apiCreate} from "../api/functions";
import {EndpointsEnum} from "../api/endpoints";
import {buildSnippet} from "../utils/db";

class New extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null
        };
    }

    isValidSnippetForm(title, type, course, raw) {
        if (!title) {
            alert('Please enter a title.');
            return false;
        }
        if (!type) {
            alert('Please select a type.');
            return false;
        }
        if (!course) {
            alert('Please select a course.');
            return false;
        }
        if (raw.length === 0) {
            alert('Please enter a snippet!');
            return false;
        }
        return true;
    }

    createSnippetHandler(e, values) {
        e.preventDefault();
        const title = values.title;
        const type = values.type;
        const course = values.course;
        const raw = values.raw;
        const notes = values.notes;

        const validForm = this.isValidSnippetForm(title, type, course, raw);
        if (!validForm) {
            return;
        }

        const snippet = buildSnippet(raw);
        let data = {
            title,
            snippet_type: type,
            course,
            raw: snippet
        };
        if (!!notes) {
            data['notes'] = notes;
        }

        apiCreate(EndpointsEnum.SNIPPETS, data)
            .then(res => {
                if (res.ok) {
                    return res.json();
                } else {
                    const err = res.statusText;
                    this.setState({error: err});
                }
            })
            .then(result => {
                if (result) {
                    console.log(result);
                    this.props.history.push('/');
                }
            })
            .catch(e => {
                this.setState({error: e.toString()});
            });
    }

    renderFormError() {
        if (this.state.error) {
            return (
                <Alert color="danger">
                    { this.state.error }
                </Alert>
            );
        }
    }

    render() {
        return (
            <div>
                <h1>Create New Snippet</h1>
                <Container>
                    { this.renderFormError() }
                    <SnippetForm handler={ (e, values) => this.createSnippetHandler(e, values) }/>
                </Container>
            </div>
        );
    }

}

export default New;
