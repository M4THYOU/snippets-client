import React, { Component } from "react";

// Components
import TextButton from "./partials/textButton";
import TextArea from "./partials/textArea";

// Utils
import {LatexStringsEnum} from "./utils/latexStrings"
import {insertIntoString, parseRawString, rawToRawString} from "./utils/utils";

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

    isMathAtIndex(index, s) {
        const arr = parseRawString(s);

        let sLen = s.length;
        let currentIsMath = false;
        for (let i = 0; i < arr.length; i++) {
            const isMath = arr[i].isMath;
            const value = arr[i].value;
            let valLen = value.length;

            if (isMath) {
                valLen += 2;
            }

            if (sLen <= valLen) {
                return isMath;
            }

            currentIsMath = isMath;
            sLen -= valLen;
        }

        return currentIsMath;
    }

    insertAtCursor(oldVal, newVal) {
        const index = this.inputRef.current.selectionStart
        let newString;
        const isAtEnd = (index === 0) || (index === oldVal.length);

        if (oldVal.slice(-1) === '`' && isAtEnd) {
            oldVal = oldVal.substring(0, oldVal.length-1);
            newVal = newVal.substring(1);
        }

        if (index === 0) {
            newString = oldVal + newVal;
        } else {
            const isMath = this.isMathAtIndex(index, oldVal);
            if (isMath) {
                newVal = newVal.slice(1,-1);
            }
            newString = insertIntoString(oldVal, index, newVal);
        }

        this.rawChange(newString);
    }

    buttonClickHandler(latex) {
        const oldVal = this.state.rawString;
        this.insertAtCursor(oldVal, latex);
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
