import React, { Component } from "react";
import 'katex/dist/katex.min.css';
import {LatexStringsEnum} from "./latexStrings";
import TextButton from "./textButton";
import {LatexButtonLayout} from "./latexButtonLayout";
import TextButtonGroup from "./textButtonGroup";

class Keyboard extends Component {

    constructor(props) {
        super(props);
        this.state = {
            handler: props.handler
        };
    }

    renderButtonGroup() {
        return Object.keys(LatexButtonLayout).map((key, i) => {
            return <TextButtonGroup title={ key }
                                    items={ LatexButtonLayout[key] }
                                    handler={ (val) => this.state.handler(val) }
                                    key={ i }
            />
        });
    }

    renderButtons() {
        return Object.keys(LatexStringsEnum).map((key, i) => {
            return <TextButton handler={ (val) => this.state.handler(val) }
                               latex={ LatexStringsEnum[key] }
                               key={ i }
            />
        })
    }

    render() {
        return (
            <div className="keyboard-container">
                { this.renderButtons() }
                <hr/>
                { this.renderButtonGroup() }
            </div>
        );
    }

}

export default Keyboard;
