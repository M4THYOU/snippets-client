import React, { Component } from "react";

// Components
import TextButton from "./partials/textButton";
import TextArea from "./partials/textArea";

// Utils
import {LatexStringsEnum} from "./utils/latexStrings"
import {insertAtCursor, insertIntoString, parseRawString, rawToRawString} from "./utils/utils";

class Editor extends Component {

    constructor(props) {
        super(props);
        this.inputRef = React.createRef();

        const initRaw = this.props.raw || [];
        this.state = {
            rawString: '',
            raw: initRaw,
            handler: props.inputHandler
        };
    }

    componentDidMount() {
        if (this.state.raw.length > 0) {
            const rawString = rawToRawString(this.state.raw);
            this.setState({rawString});
        }
    }

    // parsing text
    rawChange(val) {
        const raw = parseRawString(val);
        this.state.handler(val, raw);
        this.setState({rawString: val, raw});
    }

    insertion(oldVal, newVal) {
        const index = this.inputRef.current.selectionStart;
        const newString = insertAtCursor(oldVal, newVal, index);

        this.rawChange(newString);

        let insertAt = newString.length
        if (index > 0) {
            insertAt = index + newVal.length - 2;
        }
        this.inputRef.current.focus();
        setTimeout(() => {
            this.inputRef.current.selectionStart = this.inputRef.current.selectionEnd = insertAt;
        }, 1);
    }

    buttonClickHandler(latex) {
        const oldVal = this.state.rawString;
        this.insertion(oldVal, latex);
    }

    renderButtons() {
        return Object.keys(LatexStringsEnum).map((key, i) => {
            return <TextButton handler={ (val) => this.buttonClickHandler(val) }
                               latex={ LatexStringsEnum[key] }
                               key={ i }
            />
        })
    }

    render() {
        return (
            <div>
                <TextArea textChangeHandler={ (e) => this.rawChange(e.target.value) }
                          raw={ this.state.raw }
                          rawString={ this.state.rawString }
                          reference={ this.inputRef }
                />
                { this.renderButtons() }
            </div>
        );
    }

}

export default Editor;
