import React, { Component } from "react";
import { Card, CardText } from 'reactstrap';
import RawSnippet from "../latex-editor/partials/rawSnippet";

class NoteCard extends Component {

    constructor(props) {
        super(props);

        this.state = {
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
        this.state.deleteHandler(e, this.props.id);
    }

    renderX() {
        if (this.state.isHovered) {
            return (
                <a className="box-close" id="box-close"
                   onMouseEnter={ () => this.cardMouseEnterHandler() }
                   onMouseLeave={ () => this.cardMouseLeaveHandler() }
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
                    <RawSnippet raw={ this.props.text.raw } />
                </Card>
            </div>
        );
    }

}

export default NoteCard;
