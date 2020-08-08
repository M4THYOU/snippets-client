import React, { Component } from "react";
import { Card, Button, CardSubtitle, CardHeader, CardBody } from 'reactstrap';

// Components
import { RawSnippet } from "../latex-editor/partials/rawSnippet";
import {CourseType, DATETIME, IRawSnippet, SnippetType} from "../../interfaces/snippets";

interface Props {
    history: any;
    id: number;
    title: string;
    raw: string;
    snippet_type: SnippetType;
    course: CourseType;
    created_at: DATETIME;
    updated_at: DATETIME;
}
interface State {
    id: number;
    title: IRawSnippet;
    raw: IRawSnippet;
    type: SnippetType;
    course: CourseType;
    created_at: DATETIME;
    updated_at: DATETIME;
}

export class SnippetCard extends Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            course: props.course,
            created_at: props.created_at,
            id: props.id,
            raw: JSON.parse(props.raw),
            type: props.snippet_type,
            title: JSON.parse(props.title),
            updated_at: props.updated_at,
        };

    }

    snippetButtonOnClick() {
        this.props.history.push('/snippet/' + this.state.id);
    }

    renderTitle () {
        return (<RawSnippet raw={ this.state.title.raw_snippet }/>);
    }

    render() {
        return (
            <Card>
                <CardHeader>
                    { this.renderTitle() }
                    <hr />
                    <CardSubtitle>{ this.state.course }</CardSubtitle>
                </CardHeader>
                <CardBody>
                    <RawSnippet raw={ this.state.raw.raw_snippet }/>
                    <Button onClick={ () => this.snippetButtonOnClick() }>More</Button>
                </CardBody>
            </Card>
        );
    }

}
