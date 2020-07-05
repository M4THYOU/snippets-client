import React, { Component } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlus, faShare, faTrash} from "@fortawesome/free-solid-svg-icons";
import {CanvasModesEnum} from "../../note-taking/utils/enums";
import {Button} from "reactstrap";
import {Link} from "react-router-dom";

class LessonPreview extends Component {
    CANVAS_WIDTH = 200;
    CANVAS_HEIGHT = 100;

    constructor(props) {
        super(props);
        this.ref = React.createRef();

        this.state = {
            isPlaceholder: props.placeholder,
            title: props.title,
            lesson: props.lesson,
            selectHandler: props.selectHandler
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
            // preview are 100 x 200.
            // divide by 10 to accurately scale the image.
            this.ctx.lineTo(pt.x/10,pt.y/10);
            this.ctx.stroke();
        }

    }

    canvasLink() {
        return '/canvas/' + this.state.lesson.group_id;
    }

    selectLesson(e) {
        e.preventDefault();
        this.state.selectHandler(this.state.lesson.group_id, false);
    }

    shareLesson(e) {
        e.preventDefault();
        this.state.selectHandler(this.state.lesson.group_id, true);
    }

    render() {
        if (this.state.isPlaceholder) {
            return (
                <div className="lesson-preview-container">
                    <Link to="/canvas/new">
                        <div className="lesson-preview preview-placeholder">
                            <FontAwesomeIcon color="#66b3ff" size="3x" icon={ faPlus } />
                        </div>
                    </Link>
                    <strong>{ this.state.title }</strong>
                </div>
            );
        }
        return (
            <div className="lesson-preview-container">
                <Link to={ this.canvasLink() }>
                    <canvas className="lesson-preview" ref={ this.ref } width={ this.CANVAS_WIDTH } height={ this.CANVAS_HEIGHT }>
                    </canvas>
                </Link>
                <span>
                    <Button color="primary" size="sm" outline onClick={ (e) => this.shareLesson(e) } ><FontAwesomeIcon icon={ faShare } /></Button>
                    { ' ' }<strong>{ this.state.title }</strong>
                    { ' ' }<Button color="danger" size="sm" outline onClick={ (e) => this.selectLesson(e) } ><FontAwesomeIcon icon={ faTrash } /></Button>
                </span>
            </div>
        );
    }

}

export default LessonPreview;
