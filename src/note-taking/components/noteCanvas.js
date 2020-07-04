import React, { Component } from "react";
import {CanvasModesEnum, PenStatesEnum} from "../utils/enums";
import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    MAX_PEN_WIDTH,
    MIN_PEN_WIDTH,
    PEN_SIZE_CHANGE_RATE, UNDO_REDO_COUNT
} from "../utils/constants";
import {Input, Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, FormGroup} from 'reactstrap';

import '../styles/noteCanvas.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faEraser,
    faMinus,
    faPen,
    faPlus, faRedo,
    faSave, faTrashAlt, faUndo, faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import {apiGet, apiPatch, apiPost} from "../../api/functions";
import {EndpointsEnum} from "../../api/endpoints";
import {getBlankPage, getCanvasDefaults} from "../utils/functions";
import PagePreview from "./pagePreview";

class NoteCanvas extends Component {

    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.state = getCanvasDefaults(this.props.lessons);
        this.getCourses();
    }

    componentDidMount() {
        this.reload();
    }

    draw(e) {
        this.setState({
            mode: CanvasModesEnum.DRAW
        });
    }

    erase(e) {
        this.setState({
            mode: CanvasModesEnum.ERASE
        });
    }

    // there needs to be a param for this!
    // setting state immediately before calling this func doesn't work bc time delay I guess.
    drawFromPoints(points) {
        this.ctx.clearRect(0,0, this.canvasWidth(), this.canvasHeight());
        this.ctx.fillRect(0,0, this.canvasWidth(), this.canvasHeight());
        if (points.length === 0) { return; }

        for (let i = 0; i < points.length; i++) {
            const pt = points[i];

            this.ctx.lineWidth = pt.s;
            this.ctx.strokeStyle = pt.c;

            if (pt.m === CanvasModesEnum.ERASE) {
                this.ctx.strokeStyle = '#ffffff';
            } else if (pt.m === CanvasModesEnum.BEGIN) {
                this.ctx.beginPath();
            }

            this.ctx.lineTo(pt.x,pt.y);
            this.ctx.stroke();
        }

    }

    newHistoryPoints(e, mode) {
        const points = this.state.points.slice();
        const point = {
            x: e.nativeEvent.offsetX,
            y: e.nativeEvent.offsetY,
            s: this.state.lineWidth, // size
            c: this.state.penColour, // colour
            m: mode
        }
        points.push(point);
        return points;
    }

    drawing(e) {
        if (this.state.pen === PenStatesEnum.DOWN) {
            this.ctx.beginPath();
            this.ctx.lineWidth = this.state.lineWidth;
            this.ctx.lineCap = 'round';

            if (this.state.mode === CanvasModesEnum.DRAW) {
                this.ctx.strokeStyle = this.state.penColour;
            }
            if (this.state.mode === CanvasModesEnum.ERASE) {
                this.ctx.strokeStyle = '#ffffff';
            }

            const x = e.nativeEvent.offsetX;
            const y = e.nativeEvent.offsetY;

            this.ctx.moveTo(this.state.penCoords[0], this.state.penCoords[1]);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();

            const points = this.newHistoryPoints(e, this.state.mode);

            this.setState({
                penCoords: [x, y],
                points
            });
        }
    }

    penDown(e) {
        const points = this.newHistoryPoints(e, CanvasModesEnum.BEGIN);
        this.setState({
            pen: PenStatesEnum.DOWN,
            penCoords: [e.nativeEvent.offsetX, e.nativeEvent.offsetY],
            points,
            redoStack: []
        });
    }

    penUp(e) {
        const points = this.newHistoryPoints(e, CanvasModesEnum.END);
        // update the page with current points.
        const pages = this.state.pages.slice();
        const page = pages[this.state.selectedPageIndex];
        page.canvas = this.canvasFromPoints(points);
        this.setState({
            pen: PenStatesEnum.UP,
            points,
            pages
        });
    }

    penSizeUp() {
        if (this.state.lineWidth < MAX_PEN_WIDTH) {
            this.setState({
                lineWidth: this.state.lineWidth + PEN_SIZE_CHANGE_RATE
            });
        }
    }

    penSizeDown() {
        if (this.state.lineWidth > MIN_PEN_WIDTH) {
            this.setState({
                lineWidth: this.state.lineWidth - PEN_SIZE_CHANGE_RATE
            });
        }
    }

    setColour(e) {
        const c = e.target.value;
        this.setState({
            penColour: c
        });
    }

    undo() {
        const points = this.state.points.slice();
        const redoStack = this.state.redoStack.slice();
        for (let i = 0; (i < UNDO_REDO_COUNT) && (points.length > 0); i++) {
            const lastPoint = points.pop();
            redoStack.push(lastPoint);
        }
        this.setState({ points, redoStack });
        this.drawFromPoints(points);
    }
    redo() {
        const points = this.state.points.slice();
        const redoStack = this.state.redoStack.slice();
        for (let i = 0; (i < UNDO_REDO_COUNT) && (redoStack.length > 0); i++) {
            const undonePoint = redoStack.pop();
            points.push(undonePoint);
        }
        this.setState({ points, redoStack });
        this.drawFromPoints(points);
    }

    reload() {
        this.reset();
        if (this.state.pages.length > 0) {
            const i = this.state.selectedPageIndex;
            this.drawPageAtIndex(i);
        } else {
            const pages = [getBlankPage(0, null)];
            this.setState({pages});
        }

    }

    drawPageAtIndex(i) {
        const page = this.state.pages[i];
        const points = JSON.parse(page.canvas).raw_canvas;
        const redoStack = [];
        this.setState({ points, redoStack });
        this.drawFromPoints(points);
    }

    reset() {
        this.setState(getCanvasDefaults(this.props.lessons));

        this.ctx = this.ref.current.getContext('2d');

        this.ctx.fillStyle='white';
        this.ctx.clearRect(0,0, this.canvasWidth(), this.canvasHeight());
        this.ctx.fillRect(0,0, this.canvasWidth(), this.canvasHeight());
    }

    save() {
        if (this.props.groupId) {
            this.updateLesson();
        } else {
            this.toggleModal();
        }
    }

    myProfile() {
        this.save();
        window.location.href = '/my-profile/'
    }

    saveLesson() {
        const title = this.state.title;
        const course = this.state.course;
        if (!title) {
            alert('Please enter a title.');
            return;
        }
        if (!course) {
            alert('Please select a course.');
            return;
        }

        const pages = this.state.pages.slice();
        const data = {
            title,
            course,
            pages
        };

        this.setState({isSaving: true});
        apiPost(EndpointsEnum.LESSONS, data)
            .then(res => res.json())
            .then(result => {
                if (result) {
                    window.location.href = '/canvas/' + result.data.group_id;
                }
            })
            .catch(e => {
                this.setState({isSaving: false});
                console.error(e);
            });
    }

    updateLesson() {
        const pages = this.state.pages.slice();
        const groupId = this.props.groupId;
        const patchPages = pages.map(page => {
            return {
                canvas: page.canvas,
                group_order: page.group_order,
                group_id: groupId,
                created_at: page.created_at
            }
        });

        const title = this.state.title;
        const course = this.state.course;
        if (!title || !course) {
            alert('Please try again.');
            return;
        }

        const data = {
            title,
            course,
            pages: patchPages
        };

        this.setState({isSaving: true});
        apiPatch(EndpointsEnum.LESSONS, groupId, data)
            .then(res => res.json())
            .then(result => {
                this.setState({isSaving: false});
                console.log(result);
            })
            .catch(e => {
                console.error(e);
            })
    }

    getCourses() {
        apiGet(EndpointsEnum.COURSES)
            .then(res => res.json())
            .then(result => {
                let course = this.state.course;
                if (result.data[0] && !course) {
                    course = result.data[0].code;
                }
                if (!this.state.course) {
                    this.setState({courses: result.data, course});
                }
            })
            .catch(e => {
                console.error(e);
            })
    }

    canvasFromPoints(points) {
        const obj = { raw_canvas: points };
        return JSON.stringify(obj);
    }

    canvasHeight() {
        return CANVAS_HEIGHT;
        // return window.innerHeight;
    }
    canvasWidth() {
        return CANVAS_WIDTH;
        // assumes the tools on left take up 15% of the page.
        // const totalW = window.innerWidth;
        // return totalW * 0.85;
    }

    existingPageClick(e, selectedOrder) {
        e.preventDefault();
        const currentSelectedIndex = this.state.selectedPageIndex;
        const selectedPageIndex = selectedOrder - 1;
        if (+selectedPageIndex === +currentSelectedIndex) {
            return;
        }
        this.setState({selectedPageIndex});
        this.drawPageAtIndex(selectedPageIndex);
    }
    newPageClick(e) {
        e.preventDefault();
        const pages = this.state.pages.slice();
        const page = getBlankPage(this.state.pages.length, +this.props.groupId);
        pages.push(page);
        this.setState({pages});
    }

    toggleModal() {
        this.setState({isModalOpen: !this.state.isModalOpen});
    }

    inputChange(e, field) {
        this.setState({[field]: e.target.value});
    }

    renderPages() {
        return this.state.pages.map((lesson) => {
            if (+this.state.selectedPageIndex === +lesson.group_order - 1) {
                return <PagePreview key={ lesson.group_order } title={ lesson.title } lesson={ lesson } handler={ (e, id) => this.existingPageClick(e, id) } selected />
            } else {
                return <PagePreview key={ lesson.group_order } title={ lesson.title } lesson={ lesson } handler={ (e, id) => this.existingPageClick(e, id) } />
            }
        });
    }
    renderCourseOptions() {
        return this.state.courses.map((course) => <option key={course.id}>{course.code}</option>);
    }

    renderSpinner() {
        if (this.state.isSaving) {
            return (
                <div className="spinner-overlay">
                    <div className="spinner">
                    </div>
                </div>
            );
        }
    }

    render() {
        const h = this.canvasHeight();
        const w = this.canvasWidth();
        return (
                <div className="wrapper">
                    <div className="tools">
                        <div>
                            <Input
                                type="color"
                                name="color"
                                id="colorPicker"
                                placeholder="color placeholder"
                                onInput={ (e) => this.setColour(e) }
                            />
                        </div>
                        <div>
                            <button onClick={ (e) => this.draw(e) } className="button"><FontAwesomeIcon icon={ faPen } /></button>
                            <button onClick={ (e) => this.erase(e) } className="button"><FontAwesomeIcon icon={ faEraser } /></button>
                        </div>
                        <div>
                            <button onClick={ () => this.penSizeDown() } className="button"><FontAwesomeIcon icon={ faMinus } /></button>
                            <button onClick={ () => this.penSizeUp() } className="button"><FontAwesomeIcon icon={ faPlus } /></button>
                        </div>
                        <div>
                            <button onClick={ () => this.undo() } className="button"><FontAwesomeIcon icon={ faUndo } /></button>
                            <button onClick={ () => this.redo() } className="button"><FontAwesomeIcon icon={ faRedo } /></button>
                        </div>
                        <div>
                            <button onClick={ () => this.save() } className="button full-width"><FontAwesomeIcon icon={ faSave } /></button>
                        </div>
                        <div className="to-bottom">
                            <button onClick={ () => this.myProfile() } className="button full-width"><FontAwesomeIcon icon={ faUserCircle } /></button>
                            <button onClick={ () => this.reset() } className="button full-width"><FontAwesomeIcon icon={ faTrashAlt } /></button>
                        </div>
                    </div>

                    <div className="canvas-div">
                        <canvas ref={ this.ref } width={ w } height={ h }
                                onMouseMove={ (e) => this.drawing(e) }
                                onMouseDown={ (e) => this.penDown(e) }
                                onMouseUp={ (e) => this.penUp(e) }
                        >
                        </canvas>
                    </div>
    
                    <div className="bottom-div">
                        { this.renderPages() }
                        <PagePreview key={0} title="New Lesson" handler={ (e) => this.newPageClick(e) } placeholder/>
                    </div>
    
                    <Modal isOpen={ this.state.isModalOpen } toggle={ () => this.toggleModal() } backdrop={ 'static' } fade={ false } >
                        <ModalHeader toggle={ () => this.toggleModal() }>Save New Lesson</ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="title">Title</Label>
                                <Input type="text" name="title" id="title"
                                       value={this.state.title}
                                       onChange={(e) => this.inputChange(e, 'title')}
                                />
                            </FormGroup>
                            <FormGroup>
                                <Label for="course">Course</Label>
                                <Input type="select" value={this.state.course} onChange={ (e) => this.inputChange(e, 'course')} name="course" id="course">
                                    { this.renderCourseOptions() }
                                </Input>
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={ () => this.saveLesson() }>Save</Button>{' '}
                            <Button color="secondary" onClick={ () => this.toggleModal() }>Cancel</Button>
                        </ModalFooter>
                    </Modal>

                    { this.renderSpinner() }
                </div>
        );
    }

}

export default NoteCanvas;
