import React, { Component } from "react";
import {Button} from "reactstrap";
import 'katex/dist/katex.min.css';
import TextButton from "./textButton";
import {LatexStringsEnum} from "./latexStrings";

class TextButtonGroup extends Component {

    constructor(props) {
        super(props);
        this.state = {
            title: props.title,
            items: props.items,
            handler: props.handler, // only for the sub buttons of this group

            isOpen: false
        };
    }

    handleClick(e) {
        e.preventDefault();
        console.log('click');
        this.setState({isOpen: !this.state.isOpen});
        // const returnVal = '`' + this.state.latex + '`';
        // this.state.handler(returnVal);
    }

    renderCharacter() {
        if (this.state.isOpen) {
            return (<span aria-hidden>&or;</span>);
        } else {
            return (<span aria-hidden>&gt;</span>);
        }
    }

    renderEachButton() {
        return Object.keys(this.state.items).map((key, i) => {
            return <TextButton handler={ (val) => this.state.handler(val) }
                               latex={ this.state.items[key] }
                               key={ i }
            />
        })
    }

    renderButtons() {
        if (this.state.isOpen) {
            return (
                <div className="sub-buttons">
                    { this.renderEachButton() }
                </div>
            );
        }
    }

    render() {
        return (
            <div className="buttongroup-wrapper">
                <Button onClick={ (e) => this.handleClick(e) } aria-label="Cancel">
                    { this.state.title } { this.renderCharacter() }
                </Button>
                { this.renderButtons() }
            </div>
        );
    }

}

export default TextButtonGroup;
