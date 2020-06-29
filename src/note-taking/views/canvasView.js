import React, { Component } from "react";

// Functions/Enums
import {apiGet, isAuthenticated} from "../../api/functions";
import NoteCanvas from "../components/noteCanvas";
import {EndpointsEnum} from "../../api/endpoints";
import {rawToRawString} from "../../components/latex-editor/utils/utils";

class CanvasView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            groupId: props.match.params.id,
        };
    }

    componentDidMount() {
        isAuthenticated()
            .then(data => {
                const isAuthorized = data.authorized;
                if (!isAuthorized) {
                    this.props.history.push('/');
                } else {
                    if (this.state.groupId) {
                        this.getLesson();
                    } else {
                        this.setState({isLoaded: true});
                    }
                }
            });
    }

    getLesson() {
        const groupId = this.state.groupId;
        apiGet(EndpointsEnum.LESSONS, groupId)
            .then(res => res.json())
            .then(result => {
                const lessons = result.data;
                if (result.data.length === 0) {
                    this.props.history.push('/');
                } else {
                    this.setState({isLoaded: true, lessons});
                }
            })
            .catch(e => {
                console.error(e);
            })
    }

    render() {
        if (this.state.isLoaded) {
            return (
                <NoteCanvas groupId={ this.state.groupId } lessons={ this.state.lessons } history={ this.props.history } />
            );
        } else {
            return (
                <p>Loading...</p>
            );
        }

    }

}

export default CanvasView;
