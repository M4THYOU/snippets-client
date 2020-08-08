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
import { RawSnippet } from "./partials/rawSnippet";
import { Keyboard } from "./keyboard/keyboard";

// Functions
import {parseRawString, insertAtCursor} from "./utils/utils";
import {IRawPart} from "../../interfaces/snippets";

interface Props {
    raw?: IRawPart[];
    searchHandler: any;
}
interface State {
    rawString: string;
    raw: IRawPart[];
    handler: any;

    isDropdownOpen: boolean;
    isKeyboardShown: boolean;
}

export class SearchBar extends Component<Props, State> {

    private readonly inputRef: React.RefObject<HTMLInputElement>;

    constructor(props: Props) {
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

    insertion(oldVal, newVal) {
        if (!this.inputRef.current) {
            console.error('Null ref');
            return;
        }
        const index = this.inputRef.current.selectionStart;
        const newString = insertAtCursor(oldVal, newVal, index);
        this.rawChange(newString);

        let insertAt = newString.length
        if (index && index > 0) {
            insertAt = index + newVal.length - 1;
        }
        this.inputRef.current.focus();
        setTimeout(() => {
            if (!!this.inputRef.current) {
                this.inputRef.current.selectionStart = this.inputRef.current.selectionEnd = insertAt;
            }
        }, 1);
    }

    buttonClickHandler(latex) {
        const oldVal = this.state.rawString;
        this.insertion(oldVal, latex);
    }

    searchKeyDown(e) {
        if (e.key === 'Enter') {
            this.searchHandler(e);
        }
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
    renderKeyboard() {
        if (this.state.isKeyboardShown) {
            return (
                <Keyboard handler={ (val) => this.buttonClickHandler(val) } />
            );
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
                           onKeyDown={ (e) => this.searchKeyDown(e) }
                    />
                    <InputGroupAddon addonType="append">
                        <Button color="primary" onClick={ (e) => this.searchHandler(e) }>Find Snippet</Button>
                    </InputGroupAddon>
                </InputGroup>
                { this.renderKeyboard() }
            </div>
        );
    }

}
