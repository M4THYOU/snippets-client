import React, { Component } from "react";
import { Row, Col, FormGroup, Label, Input, Button } from "reactstrap";

// Components
import Editor from "./latex-editor/editor";

// API
import { apiGet } from '../api/functions';
import {EndpointsEnum} from "../api/endpoints";

class SnippetForm extends Component {

    constructor(props) {
        super(props);

        const isEdit = !!props.edit;
        let title = this.props.title || '';
        if (isEdit && this.props.isTitleMath) {
            title = '`' + title + '`';
        }

        this.state = {
            isEdit,
            title,
            type: this.props.type || '',
            course: this.props.course || '',
            raw: this.props.raw || [],
            isTitleMath: !!this.props.isTitleMath,
            types: [],
            courses: [],
            doneHandler: props.handler
        };
    }

    componentDidMount() {
        this.getTypes();
        this.getCourses();
    }

    // api calls
    getTypes() {
        apiGet(EndpointsEnum.TYPES)
            .then(res => res.json())
            .then(result => {
                let type = this.state.type;
                if (result.data[0] && !type) {
                    type = result.data[0].name;
                }
                this.setState({types: result.data, type});
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
                this.setState({courses: result.data, course});
            })
            .catch(e => {
                console.error(e);
            })
    }

    // ui
    inputChange(e, field) {
        this.setState({[field]: e.target.value});
    }

    rawChange(rawString, raw) {
        // we don't actually need the rawString for anything.
        this.setState({raw});
    }

    formSubmitBuilder(e) {
        e.preventDefault();

        const values = {
            title: this.state.title,
            type: this.state.type,
            course: this.state.course,
            raw: this.state.raw,
        }

        this.state.doneHandler(e, values);
    }

    renderTypeOptions() {
        return this.state.types.map((type) => <option key={type.id}>{type.name}</option>);
    }

    renderCourseOptions() {
        return this.state.courses.map((course) => <option key={course.id}>{course.code}</option>);
    }

    renderEditor() {
        if (this.state.isEdit) {
            return (
                <Editor inputHandler={ (rawString, raw) => this.rawChange(rawString, raw) }
                        raw={ this.state.raw }
                />
            );
        } else {
            return (
                <Editor inputHandler={ (rawString, raw) => this.rawChange(rawString, raw) } />
            );
        }
    }

    // render values
    renderSaveValue() {
        if (this.state.isEdit) {
            return 'Save Changes';
        } else {
            return 'Create Snippet';
        }
    }

    render() {
        return (
            <div>
                <Row form>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="title">Title</Label>
                            <Input type="text" value={ this.state.title } onChange={ (e) => this.inputChange(e, 'title')} name="title" id="title" />
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="type">Type</Label>
                            <Input type="select" value={this.state.type} onChange={ (e) => this.inputChange(e, 'type') } name="type" id="type">
                                { this.renderTypeOptions() }
                            </Input>
                        </FormGroup>
                    </Col>
                    <Col md={4}>
                        <FormGroup>
                            <Label for="course">Course</Label>
                            <Input type="select" value={this.state.course} onChange={ (e) => this.inputChange(e, 'course')} name="course" id="course">
                                { this.renderCourseOptions() }
                            </Input>
                        </FormGroup>
                    </Col>
                </Row>

                { this.renderEditor() }
                <br />
                <Button color="primary" onClick={ (e) => this.formSubmitBuilder(e) }>{ this.renderSaveValue() }</Button>
            </div>
        );
    }

}

export default SnippetForm;
