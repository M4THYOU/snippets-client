import React, { Component } from "react";
import {Container, Alert } from "reactstrap";

// Components
import SnippetForm from "../components/snippetForm";

// Functions/Enums
import {EndpointsEnum} from "../api/endpoints";
import {buildSnippet, isValidSnippetForm} from "../utils/snippets";
import {apiGet, apiPatch, isAuthenticated} from "../api/functions";
import {rawToRawString} from "../components/latex-editor/utils/utils";

class EditSnippet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            error: null,
            shouldRenderForm: false,
            id: props.match.params.id,
            course: null,
            created_at: null,
            notes: [],
            raw: [],
            snippet_type: null,
            title: null,
            updated_at: null,
            isAddingNote: false
        };
    }

    componentDidMount() {
        isAuthenticated()
            .then(data => {
                const isAuthorized = data.authorized;
                if (isAuthorized) {
                    const user = data.user;
                    this.setState({isLoaded: true, user});
                    this.getSnippet();
                } else {
                    this.props.history.push('/login');
                }
            });
    }

    // api
    getSnippet() {
        apiGet(EndpointsEnum.SNIPPETS, this.state.id)
            .then(res => res.json())
            .then(result => {
                const snippet = result.data;
                const snippetUid = +snippet.created_by_uid;
                const uid = +this.state.user.id
                if (snippetUid !== uid) {
                    this.props.history.push('/');
                }

                snippet['raw'] = JSON.parse(snippet.raw).raw_snippet;
                snippet['shouldRenderForm'] = true;

                snippet['title'] = rawToRawString(JSON.parse(snippet.title).raw_snippet);
                this.setState(snippet);
            })
            .catch(e => {
                console.error(e);
            })
    }

    editSnippetHandler(e, values) {
        e.preventDefault();
        const rawTitle = values.rawTitle;
        const type = values.type;
        const course = values.course;
        const raw = values.raw;

        const validForm = isValidSnippetForm(rawTitle, type, course, raw);
        if (!validForm) {
            return;
        }
        const snippet = buildSnippet(raw);
        const title = buildSnippet(rawTitle);
        let data = {
            title,
            snippet_type: type,
            course,
            raw: snippet,
        };

        apiPatch(EndpointsEnum.SNIPPETS, this.state.id, data)
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
                    this.props.history.push('/');
                }
            })
            .catch(e => {
                this.setState({error: e.toString()});
            });

    }

    // rendering
    renderFormError() {
        if (this.state.error) {
            return (
                <Alert color="danger">
                    { this.state.error }
                </Alert>
            );
        }
    }

    renderForm() {
        if (this.state.shouldRenderForm) {
            return (
                <SnippetForm handler={ (e, values) => this.editSnippetHandler(e, values) }
                             title={ this.state.title }
                             type={ this.state.snippet_type }
                             course={ this.state.course }
                             raw={ this.state.raw }
                             edit
                />
            );
        }
    }

    render() {
        if (this.state.isLoaded) {
            return (
                <div>
                    <h1>Edit Snippet</h1>
                    <Container>
                        {this.renderFormError()}
                        {this.renderForm()}
                    </Container>

                </div>
            );
        } else {
            return (
                <p>Loading...</p>
            );
        }
    }

}

export default EditSnippet;
