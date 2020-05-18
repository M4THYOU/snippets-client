import React, { Component } from "react";
import { Card, Button, CardTitle, CardSubtitle, CardHeader, CardBody } from 'reactstrap';

// Components
import RawSnippet from "../latex-editor/partials/rawSnippet";

class SnippetCard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            course: props.course,
            created_at: props.created_at,
            id: props.id,
            is_title_math: props.is_title_math,
            raw: JSON.parse(props.raw),
            type: props.type,
            title: props.title,
            updated_at: props.updated_at,
        };

    }

    snippetButtonOnClick() {
        this.props.history.push('/snippet/' + this.state.id);
    }

    renderTitle () {
        if (this.state.is_title_math) {
            const math = [{
                isMath: true,
                value: this.state.title
            }];
            return (
                <RawSnippet raw={ math } />
            );
        } else {
            return (
                <CardTitle>{ this.state.title }</CardTitle>
            );
        }
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

export default SnippetCard;
