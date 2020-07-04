import React, { Component } from "react";
import {Button, Container, Modal, ModalBody, ModalFooter} from "reactstrap";

// Components
import LessonPreview from "../components/lessons/lessonPreview";

// Functions/Enums
import {apiDelete, apiGet, isAuthenticated} from "../api/functions";
import {EndpointsEnum} from "../api/endpoints";

class Profile extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
            myLessons: [],
            sharedLessons: [],
            selectedLesson: null,
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
            })
            .catch(e => {
                console.error(e);
            })
    }

    deleteLesson() {
        if (!this.state.selectedLesson) { return; }

        console.log('delete with group_id:', this.state.selectedLesson);
        apiDelete(EndpointsEnum.LESSONS, this.state.selectedLesson)
            .then(res => res.json())
            .then(_ => window.location.reload())
            .catch(e => console.error(e));
    }

    selectLesson(groupId) {
        this.setState({selectedLesson: groupId});
    }

    closeModal() {
        this.setState({selectedLesson: null});
    }

    getName(user) {
        return user.first_name + ' ' + user.last_name;
    }

    renderMyLessons() {
        return this.state.myLessons.map((lesson) =>
                <LessonPreview key={ lesson.id }
                               title={ lesson.title }
                               lesson={ lesson }
                               selectHandler={ (groupId) => this.selectLesson(groupId) }
                />);
    }
    renderSharedLessons() {
        // this.state.sharedLessons
    }

    render() {
        if (this.state.user) {
            return (
                <Container>
                    <h3>{ this.getName(this.state.user) }</h3>
                    <p>{ this.state.user.email }</p>
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

                    <Modal isOpen={ !!this.state.selectedLesson } backdrop={ 'static' } fade={ false } >
                        <ModalBody>
                            <p>Are you sure you want to delete this lesson?</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={ () => this.closeModal() }>Cancel</Button>
                            <Button color="danger" onClick={ () => this.deleteLesson() }>Delete</Button>
                        </ModalFooter>
                    </Modal>
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
