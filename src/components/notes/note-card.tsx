import React, { Component } from "react";
import { Card } from 'reactstrap';
import { RawSnippet } from "../latex-editor/partials/rawSnippet";
import {IRawNote} from "../../interfaces/notes";

interface Props {
    id: number;
    text: IRawNote;
    isMine: boolean;
    deleteHandler: any;
}
interface State {
    isMine: boolean;
    isHovered: boolean;
    deleteHandler: any;
}

export class NoteCard extends Component<Props, State> {

    constructor(props: Props) {
        super(props);

        this.state = {
            deleteHandler: props.deleteHandler,
            isMine: props.isMine,
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
        if (this.state.isHovered && this.state.isMine) {
            return (
                // eslint-disable-next-line no-script-url,jsx-a11y/anchor-is-valid
                <a className="box-close"
                   onMouseEnter={ () => this.cardMouseEnterHandler() }
                   onMouseLeave={ () => this.cardMouseLeaveHandler() }
                   onClick={ (e) => this.deleteHandler(e) }
                >x</a>
            );
        }
    }

    render() {
        return (
            <div className="note">
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
