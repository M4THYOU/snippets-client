import React, {Component} from "react";
import {Button, Container, FormGroup, Input, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";

// Components
import LessonPreview from "../components/lessons/lessonPreview";

// Functions/Enums
import {apiDelete, apiGet, apiPost, isAuthenticated} from "../api/functions";
import {Endpoint} from "../api/endpoints";
import {validateEmail} from "../utils/utils";
import {IUser} from "../interfaces/users";
import {ILessonWithRole} from "../interfaces/lessons";
import {URoleType} from "../interfaces/db";

interface Props {
    history: any;
}

interface State {
    user?: IUser;
    myLessons: ILessonWithRole[];
    sharedLessons: ILessonWithRole[];
    selectedLesson?: ILessonWithRole;
    isShareModal: boolean;
    email?: string;

    isSavingModal: boolean;
}

export class Profile extends Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = {
            myLessons: [],
            sharedLessons: [],
            isShareModal: false,
            isSavingModal: false
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
                let myLessons: ILessonWithRole[] = [];
                let sharedLessons: ILessonWithRole[] = [];
                result.data.forEach((lesson: ILessonWithRole) => {
                    if (lesson.role_type === URoleType.LESSON_OWNER) {
                        myLessons.push(lesson);
                    } else {
                        sharedLessons.push(lesson);
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

        this.setState({isSavingModal: true});
        apiPost(Endpoint.INVITATIONS, data)
            .then(res => res.json())
            .then(result => {
                this.setState({email: '', isShareModal: false, selectedLesson: undefined, isSavingModal: false});
                console.log(result);
            })
            .catch(e => console.error(e));
    }

    selectLesson(groupId, isShare= false) {
        this.setState({selectedLesson: groupId, isShareModal: isShare});
    }

    closeModal() {
        this.setState({selectedLesson: undefined, email: '', isSavingModal: false});
    }

    getName(user) {
        return user.first_name + ' ' + user.last_name;
    }

    inputChange(e, field) {
        this.setState({[field]: e.target.value} as Pick<State, keyof State>);
    }

    // rendering
    renderMyLessons() {
        return this.state.myLessons.map((lesson) =>
                <LessonPreview key={ lesson.id }
                               title={ lesson.title || '' }
                               lesson={ lesson }
                               selectHandler={ (groupId, isShare) => this.selectLesson(groupId, isShare) }
                />);
    }
    renderSharedLessons() {
        return this.state.sharedLessons.map((lesson) =>
            <LessonPreview key={ lesson.id }
                           title={ lesson.title || '' }
                           lesson={ lesson }
                           selectHandler={ (groupId, isShare) => this.selectLesson(groupId, isShare) }
            />);
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
                        { this.renderSharedLessons() }
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

                    <Modal isOpen={ !!this.state.selectedLesson && this.state.isShareModal } backdrop={ 'static' } fade={ false } >
                        <ModalHeader toggle={ () => this.closeModal() }>Share Lesson</ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                    <p>Enter an email address</p>
                                    <Input type="email" name="email" id="email"
                                           disabled={ this.state.isSavingModal }
                                           onChange={(e) => this.inputChange(e, 'email')}
                                    />
                                </FormGroup>
                            </ModalBody>
                        <ModalFooter>
                            <Button color="secondary" onClick={ () => this.closeModal() }>Cancel</Button>
                            <Button color="primary" onClick={ () => this.sendShare() } disabled={ this.state.isSavingModal }>Share</Button>
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
