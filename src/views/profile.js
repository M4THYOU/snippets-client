import React, { Component } from "react";
import { Container } from "reactstrap";

// Components
import LessonPreview from "../components/lessons/lessonPreview";

// Functions/Enums
import {apiGet, isAuthenticated} from "../api/functions";
import {EndpointsEnum} from "../api/endpoints";

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            myLessons: [],
            sharedLessons: [],
        };
    }

    componentDidMount() {
        isAuthenticated()
            .then(data => {
                const isAuthorized = data.authorized;
                if (isAuthorized) {
                    const user = data.user;
                    this.setState({user});
                    this.getLessons();
                } else {
                    this.props.history.push('/login');
                }
            });
    }

    getLessons() {
        apiGet(EndpointsEnum.LESSONS)
            .then(res => res.json())
            .then(result => {
                let myLessons = [];
                let sharedLessons = [];
                result.data.forEach(lesson => {
                    if (+lesson.created_by_uid === +this.state.user.id) {
                        myLessons.push(lesson);
                    } else {
                        sharedLessons.push(lesson)
                    }
                });
                this.setState({myLessons, sharedLessons});
                console.log(this.state);
            })
            .catch(e => {
                console.error(e);
            })
    }

    getName(user) {
        return user.first_name + ' ' + user.last_name;
    }

    renderMyLessons() {
        return this.state.myLessons.map((lesson) => <LessonPreview key={ lesson.id } title={ lesson.title } lesson={ lesson } />);
    }
    renderSharedLessons() {
        // this.state.sharedLessons
    }

    render() {
        if (this.state.user) {
            return (
                <Container>
                    <h3>{ this.getName(this.state.user) }</h3>
                    <hr/>
                    <h4 className="left-align">My Lessons</h4>
                    <div className="lessons-container">
                        <LessonPreview key={0} title="New Lesson" placeholder/>
                        { this.renderMyLessons() }
                    </div>
                    <hr/>
                    <h4 className="left-align">Shared With Me</h4>
                    <div className="left-align">

                    </div>
                </Container>
            );
        } else {
            return (
                <p>Loading...</p>
            );
        }
    }

}

export default Profile;
