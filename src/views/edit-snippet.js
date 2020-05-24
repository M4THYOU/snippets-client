import React, { Component } from "react";
import {Container, Alert, Button} from "reactstrap";

// Components
import SnippetForm from "../components/snippetForm";

// Functions/Enums
import {EndpointsEnum} from "../api/endpoints";
import {buildSnippet, isValidSnippetForm} from "../utils/snippets";
import {apiCreate, apiGet, apiPatch} from "../api/functions";

class EditSnippet extends Component {

    constructor(props) {
        super(props);
        this.state = {
            error: null,
            shouldRenderForm: false,
            id: props.match.params.id,
            course: null,
            created_at: null,
            is_title_math: 0,
            notes: [],
            raw: [],
            snippet_type: null,
            title: null,
            updated_at: null,
            isAddingNote: false
        };
    }

    componentDidMount() {
        this.getSnippet();
    }

    // api
    getSnippet() {
        apiGet(EndpointsEnum.SNIPPETS, this.state.id)
            .then(res => res.json())
            .then(result => {
                const snippet = result.data;
                snippet['raw'] = JSON.parse(snippet.raw).raw_snippet;
                snippet['shouldRenderForm'] = true;
                this.setState(snippet);
            })
            .catch(e => {
                console.error(e);
            })
    }

    editSnippetHandler(e, values) {
        e.preventDefault();
        const title = values.title;
        const type = values.type;
        const course = values.course;
        const raw = values.raw;

        const validForm = isValidSnippetForm(title, type, course, raw);
        if (!validForm) {
            return;
        }
        const snippet = buildSnippet(raw);
        let data = {
            title,
            snippet_type: type,
            course,
            raw: snippet,
            is_title_math: 0
        };
        // if title is wrapped in backticks, it must be math.
        if (title[0] === "`" && title[title.length - 1] === "`") {
            data.title = data.title.substring(1, data.title.length-1);
            data.is_title_math = 1;
        }

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
                             isTitleMath={ this.state.is_title_math }
                             type={ this.state.snippet_type }
                             course={ this.state.course }
                             raw={ this.state.raw }
                             edit
                />
            );
        }
    }

    render() {
        return (
            <div>
                <h1>Edit Snippet</h1>
                <Container>
                    { this.renderFormError() }
                    { this.renderForm() }
                </Container>

            </div>
        );
    }

}

export default EditSnippet;
