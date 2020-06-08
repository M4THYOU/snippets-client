import React, { Component } from "react";
import {
    InputGroup,
    InputGroupAddon,
    Button,
    Input,
    InputGroupButtonDropdown,
    DropdownToggle,
    DropdownMenu,
    DropdownItem
} from 'reactstrap';

// Components
import RawSnippet from "./partials/rawSnippet";

// Functions
import {parseRawString, insertIntoString} from "./utils/utils";
import {LatexStringsEnum} from "./utils/latexStrings";
import TextButton from "./partials/textButton";

class SearchBar extends Component {

    constructor(props) {
        super(props);
        this.inputRef = React.createRef();

        const initRaw = this.props.raw || [];
        this.state = {
            rawString: '',
            raw: initRaw,
            handler: props.searchHandler,

            isDropdownOpen: false,
            isKeyboardShown: false
        };
    }

    rawChange(val) {
        const raw = parseRawString(val);
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

    searchHandler(e) {
        e.preventDefault();
        const raw = this.state.raw;
        if (raw.length === 0) {
            return;
        }
        this.state.handler(this.state.raw);
    }

    showKeyboardHandler(e) {
        e.preventDefault();
        this.setState({isKeyboardShown: !this.state.isKeyboardShown});
    }

    toggleDropDownHandler() {
        this.setState({isDropdownOpen: !this.state.isDropdownOpen});
    }

    // Rendering
    renderButtons() {
        if (this.state.isKeyboardShown) {
            return Object.keys(LatexStringsEnum).map((key, i) => {
                return <TextButton handler={(val) => this.buttonClickHandler(val)}
                                   latex={LatexStringsEnum[key]}
                                   key={i}
                />
            });
        }
    }

    renderKeyboardToggleText() {
        if (this.state.isKeyboardShown) {
            return 'Hide Math Keyboard';
        } else {
            return 'Show Math Keyboard';
        }
    }

    render() {
        return (
            <div>
                <RawSnippet raw={ this.state.raw } />
                <InputGroup>
                    <InputGroupButtonDropdown
                        addonType="prepend"
                        isOpen={this.state.isDropdownOpen}
                        toggle={() => this.toggleDropDownHandler()}
                    >
                        <DropdownToggle split outline />
                        <DropdownMenu>
                            <DropdownItem onClick={ (e) => this.showKeyboardHandler(e) }>{ this.renderKeyboardToggleText() }</DropdownItem>
                        </DropdownMenu>
                    </InputGroupButtonDropdown>
                    <Input type="text"
                           value={ this.state.rawString }
                           onChange={ (e) => this.rawChange(e.target.value) }
                           innerRef={ this.inputRef }
                    />
                    <InputGroupAddon addonType="append">
                        <Button color="primary" onClick={ (e) => this.searchHandler(e) }>Find Snippet</Button>
                    </InputGroupAddon>
                </InputGroup>
                { this.renderButtons() }
            </div>
        );
    }

}

export default SearchBar;
