import React, { Component } from "react";
import 'katex/dist/katex.min.css';
import TeX from '@matejmazur/react-katex';

class RawSnippet extends Component {

    // raw should be the raw_snippet value from an api request.
    constructor(props) {
        super(props);
        this.state = {
            raw: props.raw,
        };
    }

    renderRaw() {
        return this.props.raw.map((item, i) => {
            if (item.isMath) {
                return <TeX key={i} math={ item.value }/>;
            }
            return item.value;
        });
    }

    render() {
        return (
            <div>
              <p>{ this.renderRaw() }</p>
            </div>
        );
    }

}

export default RawSnippet;
