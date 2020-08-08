import React, { Component } from "react";
import 'katex/dist/katex.min.css';
import {LatexStrings} from "./latexStrings";
import { TextButton } from "./textButton";
import { LatexButtonLayout } from "./latexButtonLayout";
import TextButtonGroup from "./textButtonGroup";

interface Props {
    handler: any;
}
interface State {
    handler: any;
    buttonGroupsOpen: any; // not a clue what this actually is
}

export class Keyboard extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            handler: props.handler,
            buttonGroupsOpen: Object.fromEntries(Object.keys(LatexButtonLayout).map(key => [key, false]))
        };
    }

    buttonGroupStateChangeHandler(key) {
        this.setState(prevState => {
            let buttonGroupsOpen = Object.assign({}, prevState.buttonGroupsOpen);
            buttonGroupsOpen[key] = !prevState.buttonGroupsOpen[key];
            return { buttonGroupsOpen };
        })
    }

    renderObjButtons(obj) {
        return Object.keys(obj).map((key, i) => {
            return <TextButton handler={ (val) => this.state.handler(val) }
                               latex={ obj[key] }
                               key={ i }
            />
        });
    }

    renderButtonGroup() {
        return Object.keys(LatexButtonLayout).map((key, i) => {
            return <TextButtonGroup title={ key }
                                    items={ LatexButtonLayout[key] }
                                    openHandler={ (key) => this.buttonGroupStateChangeHandler(key) }
                                    isOpen={ this.state.buttonGroupsOpen[key] }
                                    handler={ (val) => this.state.handler(val) }
                                    key={ i }
            />
        });
    }

    renderButtonGroupButtons() {
        // eslint-disable-next-line array-callback-return
        return Object.keys(LatexButtonLayout).map((key, i) => {
            if (this.state.buttonGroupsOpen[key]) {
                return this.renderObjButtons(LatexButtonLayout[key]);
            }
        });
    }

    renderButtons() {
        return this.renderObjButtons(LatexStrings);
    }

    render() {
        return (
            <div className="keyboard-container">
                { this.renderButtonGroup() }
                <div>
                    { this.renderButtonGroupButtons() }
                </div>
            </div>
        );
    }

}
