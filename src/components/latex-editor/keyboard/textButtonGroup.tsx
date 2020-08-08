import React, { Component } from "react";
import {Button} from "reactstrap";
import 'katex/dist/katex.min.css';

interface Props {
    title: string;
    items: { [ type: string ]: any };
    isOpen: boolean;
    handler: any;
    openHandler: any;
}
interface State {
    title: string;
    items: { [type: string]: any };
    handler: any;
    openHandler: any;
}

class TextButtonGroup extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            title: props.title,
            items: props.items,
            handler: props.handler, // only for the sub buttons of this group
            openHandler: props.openHandler,
        };
    }

    handleClick(e) {
        e.preventDefault();
        this.state.openHandler(this.state.title);
    }

    render() {
        if (this.props.isOpen) {
            return (
                <Button className="title-button" onClick={ (e) => this.handleClick(e) } aria-label="Cancel">
                    { this.state.title } <span aria-hidden>&or;</span>
                </Button>
            );
        } else {
            return (
                <Button className="title-button no-hover" onClick={ (e) => this.handleClick(e) } aria-label="Cancel" outline>
                    { this.state.title } <span aria-hidden>&gt;</span>
                </Button>
            );
        }
    }

}

export default TextButtonGroup;
