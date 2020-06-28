import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import {CanvasModesEnum} from "../utils/enums";
import {Link} from "react-router-dom";

class PagePreview extends Component {
    CANVAS_WIDTH = 100;
    CANVAS_HEIGHT = 50;

    constructor(props) {
        super(props);
        this.ref = React.createRef();

        this.state = {
            isPlaceholder: !!props.placeholder,
            title: props.title,
            lesson: props.lesson,
            clickHandler: props.handler,
        };

    }

    componentDidMount() {
        if (!this.state.isPlaceholder) {
            this.ctx = this.ref.current.getContext('2d');
            const points = JSON.parse(this.state.lesson.canvas).raw_canvas;
            this.drawFromPoints(points);
        }
    }

    drawFromPoints(points) {
        this.ctx.clearRect(0,0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);
        // this.ctx.fillRect(0,0, this.CANVAS_WIDTH, this.CANVAS_HEIGHT);

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

            // proper canvas dimensions are 1000 x 2000.
            // preview are 50 x 100.
            // divide by 20 to accurately scale the image.
            this.ctx.lineTo(pt.x/20,pt.y/20);
            this.ctx.stroke();
        }

    }

    canvasClick(e) {
        e.preventDefault();
        if (this.state.clickHandler) {
            if (this.state.lesson) {
                this.state.clickHandler(e, this.state.lesson.group_order);
            } else {
                this.state.clickHandler(e);
            }
        }
    }

    render() {
        if (this.state.isPlaceholder) {
            return (
                <div className="page-preview-container">
                    <div className="page-preview page-preview-placeholder" onClick={ (e) => this.canvasClick(e) } >
                        <FontAwesomeIcon color="#66b3ff" size="1x" icon={ faPlus } />
                        <p>New Page</p>
                    </div>
                </div>
            );
        } else if (this.props.selected) {
            return (
                <div className="page-preview-container">
                    <canvas className="page-preview selected-preview" ref={ this.ref } width={ this.CANVAS_WIDTH } height={ this.CANVAS_HEIGHT } onClick={ (e) => this.canvasClick(e) } >
                    </canvas>
                </div>
            );
        } else {
            return (
                <div className="page-preview-container">
                    <canvas className="page-preview" ref={ this.ref } width={ this.CANVAS_WIDTH } height={ this.CANVAS_HEIGHT } onClick={ (e) => this.canvasClick(e) } >
                    </canvas>
                </div>
            );
        }
    }

}

export default PagePreview;
