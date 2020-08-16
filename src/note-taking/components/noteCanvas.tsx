import React, { Component } from "react";
import {CanvasMode, PenState} from "../utils/enums";
import {
    CANVAS_HEIGHT,
    CANVAS_WIDTH, ICanvasDefault,
    MAX_PEN_WIDTH,
    MIN_PEN_WIDTH,
    PEN_SIZE_CHANGE_RATE, UNDO_REDO_COUNT
} from "../utils/constants";
import {Input, Modal, ModalHeader, ModalBody, ModalFooter, Button, Label, FormGroup} from 'reactstrap';

import '../styles/noteCanvas.scss';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faEraser,
    faMinus,
    faPen,
    faPlus, faRedo,
    faSave, faTrashAlt, faUndo, faUserCircle,
} from "@fortawesome/free-solid-svg-icons";
import {apiGet, apiPatch, apiPost} from "../../api/functions";
import {Endpoint} from "../../api/endpoints";
import {getBlankPage, getCanvasDefaults} from "../utils/functions";
import { PagePreview } from "./pagePreview";
import {ILesson} from "../../interfaces/lessons";

interface Props {
    history: any;
    lessons: ILesson[];
    groupId: number;
}

export class NoteCanvas extends Component<Props, ICanvasDefault> {

    private readonly ref: React.RefObject<HTMLCanvasElement>;
    private ctx: CanvasRenderingContext2D | null;
    private touchAction: string = 'none';

    constructor(props: Props) {
        super(props);
        this.ref = React.createRef();
        this.state = getCanvasDefaults(this.props.lessons);
        this.getCourses();
    }

    componentDidMount() {
        this.reload();
    }

// drawing helpers. //
    drawFromPoints(points) {
        if (!this.ctx) {
            console.error('Null Context');
            return;
        }
        this.ctx.clearRect(0,0, this.canvasWidth(), this.canvasHeight());
        this.ctx.fillRect(0,0, this.canvasWidth(), this.canvasHeight());
        if (points.length === 0) { return; }

        for (let i = 0; i < points.length; i++) {
            const pt = points[i];
            this.ctx.lineWidth = pt.s;
            this.ctx.strokeStyle = pt.c;

            if (pt.m === CanvasMode.ERASE) {
                this.ctx.strokeStyle = '#ffffff';
            } else if (pt.m === CanvasMode.BEGIN) {
                this.ctx.beginPath();
            }
            this.ctx.lineTo(pt.x,pt.y);
            this.ctx.stroke();
        }
    }

    // MOUSE
    newHistoryPoints(x: number, y: number, mode: CanvasMode) {
        const points = this.state.points.slice();
        const point = {
            x,
            y,
            s: this.state.lineWidth, // size
            c: this.state.penColour, // colour
            m: mode
        }
        points.push(point);
        return points;
    }

// Mouse drawing //
     private startDrawing(x: number, y: number) {
        const points = this.newHistoryPoints(x, y, CanvasMode.BEGIN);
        this.setState({
            pen: PenState.DOWN,
            penCoords: [x, y],
            points,
            redoStack: []
        });
    }
    private endDrawing(x: number, y: number) {
        const points = this.newHistoryPoints(x, y, CanvasMode.END);
        const pages = this.state.pages.slice();
        const page = pages[this.state.selectedPageIndex];
        page.canvas = this.canvasFromPoints(points);
        this.setState({
            pen: PenState.UP,
            points,
            pages
        });
    }
    private drawing(x: number, y: number) {
        if (!this.ctx) {
            console.error('Null Context');
            return;
        }
        if (this.state.pen === PenState.DOWN) {
            this.ctx.beginPath();
            this.ctx.lineWidth = this.state.lineWidth;
            this.ctx.lineCap = 'round';

            if (this.state.mode === CanvasMode.DRAW) {
                this.ctx.strokeStyle = this.state.penColour;
            }
            if (this.state.mode === CanvasMode.ERASE) {
                this.ctx.strokeStyle = '#ffffff';
            }

            this.ctx.moveTo(this.state.penCoords[0], this.state.penCoords[1]);
            this.ctx.lineTo(x, y);
            this.ctx.stroke();

            const points = this.newHistoryPoints(x, y, this.state.mode);

            this.setState({
                penCoords: [x, y],
                points
            });
        }
    }

    penDown(e) {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;
        this.startDrawing(x, y);
    }
    penUp(e) {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;
        this.endDrawing(x, y);
    }
    penDrawing(e) {
        const x = e.nativeEvent.offsetX;
        const y = e.nativeEvent.offsetY;
        this.drawing(x, y);
    }

// Touch drawing //
    touchDown(e) {
        const rect = e.target.getBoundingClientRect();
        const x = e.targetTouches[0].clientX - rect.x;
        const y = e.targetTouches[0].clientY - rect.y;
        this.startDrawing(x, y);
    }
    touchUp(e) {
        const rect = e.target.getBoundingClientRect();
        // NOTE: need to use `changedTouches` here for some reason. `targetTouches` is empty array
        const x = e.changedTouches[0].clientX - rect.x;
        const y = e.changedTouches[0].clientY - rect.y;
        this.endDrawing(x, y);
    }
    touchDrawing(e) {
        if (e.targetTouches.length > 1) {
            this.touchAction = 'pan-x pan-y';
        } else {
            this.touchAction = 'none';
            const rect = e.target.getBoundingClientRect();
            const x = e.targetTouches[0].clientX - rect.x;
            const y = e.targetTouches[0].clientY - rect.y;
            this.drawing(x, y);
        }
    }

// Utility bar stuff //
    draw(e) {
        this.setState({
            mode: CanvasMode.DRAW
        });
    }

    erase(e) {
        this.setState({
            mode: CanvasMode.ERASE
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
        this.setState(getCanvasDefaults(this.props.lessons));
        if (this.state.pages.length > 0) {
            const i = this.state.selectedPageIndex;
            this.drawPageAtIndex(i);
        } else {
            const pages = [getBlankPage(0)];
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

    // clears the current canvas. Not the state though.
    reset() {
        if (!this.ref.current) {
            console.error('Null Canvas');
            return;
        }

        this.ctx = this.ref.current.getContext('2d');

        if (!this.ctx) {
            console.error('Null Context');
            return;
        }
        this.ctx.fillStyle='white';
        this.ctx.clearRect(0,0, this.canvasWidth(), this.canvasHeight());
        this.ctx.fillRect(0,0, this.canvasWidth(), this.canvasHeight());
    }

    clearPage() {
        this.reset();

        const pages = this.state.pages.slice();
        pages[this.state.selectedPageIndex].canvas = '{"raw_canvas": []}';
        this.setState({pages});
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

// API calls //
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
        apiPost(Endpoint.LESSONS, data)
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
        apiPatch(Endpoint.LESSONS, groupId, data)
            .then(res => res.json())
            .then(result => {
                this.setState({isSaving: false});
            })
            .catch(e => {
                console.error(e);
            })
    }

    getCourses() {
        apiGet(Endpoint.COURSES)
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
        this.setState({[field]: e.target.value} as Pick<ICanvasDefault, keyof ICanvasDefault>);
    }

    renderPages() {
        // eslint-disable-next-line array-callback-return
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
                <div className="wrapper" style={{touchAction: 'none'}}>

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
                            <button onClick={ () => this.clearPage() } className="button full-width"><FontAwesomeIcon icon={ faTrashAlt } /></button>
                        </div>
                    </div>

                    <div className="main-edit-area">
                        <div className="top-div">
                            { this.renderPages() }
                            <PagePreview key={0} title="New Lesson" handler={ (e) => this.newPageClick(e) } placeholder/>
                        </div>

                        <div className="canvas-div">
                            <canvas style={{touchAction: this.touchAction}} ref={ this.ref } width={ w } height={ h }
                                    onMouseMove={ (e) => this.penDrawing(e) }
                                    onMouseDown={ (e) => this.penDown(e) }
                                    onMouseUp={ (e) => this.penUp(e) }

                                    onTouchMove={ (e) => this.touchDrawing(e) }
                                    onTouchStart={ (e) => this.touchDown(e) }
                                    onTouchEnd={ (e) => this.touchUp(e) }
                            >
                            </canvas>
                        </div>
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
