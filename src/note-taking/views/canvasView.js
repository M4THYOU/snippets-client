import React, { Component } from "react";

// Functions/Enums
import {isAuthenticated} from "../../api/functions";
import NoteCanvas from "../components/noteCanvas";

class CanvasView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
        };
    }

    componentDidMount() {
        isAuthenticated()
            .then(data => {
                const isAuthorized = data.authorized;
                if (!isAuthorized) {
                    this.props.history.push('/');
                } else {
                    this.setState({isLoaded: true});
                }
            });
    }

    render() {
        if (this.state.isLoaded) {
            return (
                <NoteCanvas />
            );
        } else {
            return (
                <p>Loading...</p>
            );
        }

    }

}

export default CanvasView;
