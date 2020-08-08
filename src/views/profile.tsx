import React, { Component } from "react";
import {Button, Container, Modal, ModalBody, ModalFooter} from "reactstrap";

// Components
import LessonPreview from "../components/lessons/lessonPreview";

// Functions/Enums
import {apiDelete, apiGet, apiPost, isAuthenticated} from "../api/functions";
import {Endpoint} from "../api/endpoints";
import {validateEmail} from "../utils/utils";
import {IUser} from "../interfaces/users";
import {ILesson} from "../interfaces/lessons";

interface Props {
    history: any;
}

interface State {
    user?: IUser;
    myLessons: ILesson[];
    sharedLessons: ILesson[];
    selectedLesson?: ILesson;
    isShareModal: boolean;
    email?: string;
}

export class Profile extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            myLessons: [],
            sharedLessons: [],
            isShareModal: false,
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
        apiGet(Endpoint.LESSONS)
            .then(res => res.json())
            .then(result => {
                let myLessons: ILesson[] = [];
                let sharedLessons: ILesson[] = [];
                result.data.forEach((lesson: ILesson) => {
                    if (!!this.state.user && lesson.created_by_uid && +lesson.created_by_uid === +this.state.user.id) {
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
        apiDelete(Endpoint.LESSONS, this.state.selectedLesson)
            .then(res => res.json())
            .then(_ => window.location.reload())
            .catch(e => console.error(e));
    }

    sendShare() {
        const email = this.state.email;
        if (!this.state.selectedLesson) { return; }
        if (!validateEmail(email)) { return; }

        const data = {
            email,
            group_id: this.state.selectedLesson
        }

        apiPost(Endpoint.INVITATIONS, data)
            .then(res => res.json())
            .then(result => {
                console.log(result);
            })
            .catch(e => console.error(e));
    }

    selectLesson(groupId, isShare= false) {
        this.setState({selectedLesson: groupId, isShareModal: isShare});
    }

    closeModal() {
        this.setState({selectedLesson: undefined});
    }

    getName(user) {
        return user.first_name + ' ' + user.last_name;
    }

    inputChange(e, field) {
        this.setState({[field]: e.target.value} as Pick<State, keyof State>);
    }

    renderMyLessons() {
        return this.state.myLessons.map((lesson) =>
                <LessonPreview key={ lesson.id }
                               title={ lesson.title || '' }
                               lesson={ lesson }
                               selectHandler={ (groupId, isShare) => this.selectLesson(groupId, isShare) }
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

                    <Modal isOpen={ !!this.state.selectedLesson && !this.state.isShareModal } backdrop={ 'static' } fade={ false } >
                        <ModalBody>
                            <p>Are you sure you want to delete this lesson?</p>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={ () => this.closeModal() }>Cancel</Button>
                            <Button color="danger" onClick={ () => this.deleteLesson() }>Delete</Button>
                        </ModalFooter>
                    </Modal>

                    {/*
                    <Modal isOpen={ !!this.state.selectedLesson && this.state.isShareModal } backdrop={ 'static' } fade={ false } >
                        <ModalHeader toggle={ () => this.closeModal() }>Share Lesson</ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <p>Enter an email address</p>
                                <Input type="email" name="email" id="email"
                                       value={this.state.title}
                                       onChange={(e) => this.inputChange(e, 'email')}
                                />
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={ () => this.closeModal() }>Cancel</Button>
                            <Button color="primary" onClick={ () => this.sendShare() }>Share</Button>
                        </ModalFooter>
                    </Modal>
                    */}
                </Container>
            );
        } else {
            return (
                <p>Loading...</p>
            );
        }
    }

}
