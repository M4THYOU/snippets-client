import React, { Component } from "react";
import { Card, CardText } from 'reactstrap';

class NoteCard extends Component {

    constructor(props) {
        super(props);

        this.state = {
            id: props.id,
            text: props.text,
            deleteHandler: props.deleteHandler,
            isHovered: false
        };

    }

    cardMouseEnterHandler() {
        this.setState({isHovered: true});
    }
    cardMouseLeaveHandler() {
        this.setState({isHovered: false});
    }
    deleteHandler(e) {
        e.preventDefault();
        this.state.deleteHandler(e, this.state.id);
    }

    renderX() {
        if (this.state.isHovered) {
            return (
                <a className="box-close" id="box-close"
                   onMouseEnter={ () => this.cardMouseEnterHandler() }
                   onClick={ (e) => this.deleteHandler(e) }
                >x</a>
            );
        }
    }

    render() {
        return (
            <div>
                { this.renderX() }
                <Card body inverse color="warning" className="note"
                      onMouseEnter={ () => this.cardMouseEnterHandler() }
                      onMouseLeave={ () => this.cardMouseLeaveHandler() }
                >
                    <CardText>{ this.state.text }</CardText>
                </Card>
            </div>
        );
    }

}

export default NoteCard;
