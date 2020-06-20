import React, { Component } from "react";
import {CanvasModesEnum, PenStatesEnum} from "../utils/enums";
import {CANVAS_DEFAULTS, MAX_PEN_WIDTH, MIN_PEN_WIDTH} from "../utils/constants";
import { Input } from 'reactstrap';

import '../styles/noteCanvas.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {
    faEraser,
    faMinus,
    faPen,
    faPlus,
    faSave, faSearchMinus,
    faSearchPlus,
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

            this.setState({
                penCoords: [x, y]
            });

        }
    }

    penDown(e) {
        this.setState({
            pen: PenStatesEnum.DOWN,
            penCoords: [e.nativeEvent.offsetX, e.nativeEvent.offsetY]
        });
    }

    penUp(e) {
        this.setState({
            pen: PenStatesEnum.UP,
        });
    }

    penSizeUp() {
        if (this.state.lineWidth < MAX_PEN_WIDTH) {
            this.setState({
                lineWidth: this.state.lineWidth + 5
            });
        }
    }

    penSizeDown() {
        if (this.state.lineWidth > MIN_PEN_WIDTH) {
            this.setState({
                lineWidth: this.state.lineWidth - 5
            });
        }
    }

    setColour(e) {
        const c = e.target.value;
        this.setState({
            penColour: c
        });
    }

    reset() {
        this.setState(CANVAS_DEFAULTS);

        this.ctx = this.ref.current.getContext('2d');
        this.copiedCanvas = this.ref.current.getContext("2d");

        this.ctx.fillStyle='white';
        this.ctx.fillRect(0,0,this.props.width,this.props.height);
        this.ctx.lineWidth = this.state.lineWidth;
    }

    zoomIn() {
        console.log('in');
        const width = this.ctx.canvas.width / 2;
        const height = this.ctx.canvas.height / 2;
        const scale = 3;
        this.ctx.translate(width, height);
        this.ctx.scale(scale, scale);
        this.ctx.translate(-width, -height);
    }

    zoomOut() {
        //
    }

    save() {
        console.log('save');
    }

    canvasHeight() {
        return window.innerHeight;
    }
    canvasWidth() {
        // assumes the tools on left take up 15% of the page.
        const totalW = window.innerWidth;
        return totalW * 0.85;
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
                        <button onClick={ () => this.reset() } className="button">Reset</button>
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
                    <button onClick={ () => this.zoomIn() } className="button"><FontAwesomeIcon icon={ faSearchPlus } /></button>
                    <button onClick={ () => this.zoomOut() } className="button"><FontAwesomeIcon icon={ faSearchMinus } /></button>
                </div>
            </div>
        );
    }

}

export default NoteCanvas;
