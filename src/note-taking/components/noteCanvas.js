import React, { Component } from "react";
import {CanvasModesEnum, PenStatesEnum} from "../utils/enums";
import {
    CANVAS_DEFAULTS,
    CANVAS_HEIGHT,
    CANVAS_WIDTH,
    MAX_PEN_WIDTH,
    MIN_PEN_WIDTH,
    PEN_SIZE_CHANGE_RATE, UNDO_REDO_COUNT
} from "../utils/constants";
import { Input } from 'reactstrap';

import '../styles/noteCanvas.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faEraser,
    faMinus,
    faPen,
    faPlus, faRedo,
    faSave, faTrashAlt, faUndo,
} from "@fortawesome/free-solid-svg-icons";

class NoteCanvas extends Component {

    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.state = CANVAS_DEFAULTS
    }

    componentDidMount() {
        this.reset();
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

            console.log(pt.size);
            this.ctx.lineWidth = pt.s;
            this.ctx.strokeStyle = pt.c;

            if (pt.m === CanvasModesEnum.ERASE) {
                this.ctx.strokeStyle = '#ffffff';
            } else if (pt.m === CanvasModesEnum.BEGIN) {
                this.ctx.beginPath();
                // this.ctx.moveTo(pt.x, pt.y);
            }

            this.ctx.lineTo(pt.x,pt.y);
            this.ctx.stroke();
        }

    }

    newHistoryPoints(e, mode) {
        const points = this.state.points.slice();
        const point = {
            px: this.state.penCoords[0],
            py: this.state.penCoords[0],
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
        this.setState({
            pen: PenStatesEnum.UP,
            points
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

    reset() {
        this.setState(CANVAS_DEFAULTS);

        this.ctx = this.ref.current.getContext('2d');

        this.ctx.fillStyle='white';
        this.ctx.clearRect(0,0, this.canvasWidth(), this.canvasHeight());
        this.ctx.fillRect(0,0, this.canvasWidth(), this.canvasHeight());
    }

    save() {
        console.log(JSON.stringify(this.state.points));
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
                        <button onClick={ () => this.reset() } className="button"><FontAwesomeIcon icon={ faTrashAlt } /></button>
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

                <div className="helpers">
                    <button onClick={ () => this.save() } className="button"><FontAwesomeIcon icon={ faSave } /></button>
                </div>
            </div>
        );
    }

}

export default NoteCanvas;
