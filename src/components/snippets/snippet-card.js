import React, { Component } from "react";
import { Card, Button, CardTitle, CardSubtitle, CardHeader, CardBody } from 'reactstrap';

// Components
import RawSnippet from "../rawSnippet";

class SnippetCard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            course: props.course,
            created_at: props.created_at,
            id: props.id,
            raw: JSON.parse(props.raw),
            type: props.type,
            title: props.title,
            updated_at: props.updated_at,
        };

    }

    snippetButtonOnClick() {
        this.props.history.push('/snippet/' + this.state.id);
    }

    render() {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>{ this.state.title }</CardTitle>
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
