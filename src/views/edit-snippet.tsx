import React, { Component } from "react";
import {Container, Alert } from "reactstrap";

// Components
import { SnippetForm } from "../components/snippetForm";

// Functions/Enums
import {Endpoint} from "../api/endpoints";
import {buildSnippet, isValidSnippetForm} from "../utils/snippets";
import {apiGet, apiPatch, isAuthenticated} from "../api/functions";
import {rawToRawString} from "../components/latex-editor/utils/utils";
import {INote} from "../interfaces/notes";
import {IUser} from "../interfaces/users";
import {DATETIME, IRawPart} from "../interfaces/snippets";
import {CourseType, SnippetType} from "../interfaces/db";

interface Props {
    history: any;
}

interface State {
    id: number;
    isLoaded: boolean;
    error?: string;

    isAddingNote: boolean;
    shouldRenderForm: boolean;

    notes: INote[];
    raw: IRawPart[];

    user?: IUser;
    title?: string;
    course?: CourseType;
    snippet_type?: SnippetType;
    created_at?: DATETIME;
    updated_at?: DATETIME;
}

export class EditSnippet extends Component<Props, State> {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            shouldRenderForm: false,
            id: props.match.params.id,
            notes: [],
            raw: [],
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
        apiGet(Endpoint.SNIPPETS, this.state.id)
            .then(res => res.json())
            .then(result => {
                const snippet = result.data;
                const snippetUid = +snippet.created_by_uid;
                if (!this.state.user || snippetUid !== +this.state.user.id) {
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

        apiPatch(Endpoint.SNIPPETS, this.state.id, data)
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
                             edit={ true }
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
