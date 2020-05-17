import React, { Component } from "react";
import { Row, Col, FormGroup, Label, Input, Button } from "reactstrap";

// Components
import RawNote from "./rawNote";

// API
import { apiGet } from '../api/functions';
import {EndpointsEnum} from "../api/endpoints";

class SnippetForm extends Component {

    constructor(props) {
        super(props);

        this.state = {
            title: '',
            type: '',
            course: '',
            rawString: '',
            raw: [],
            notes: '',
            types: [],
            courses: [],
            createHandler: props.handler
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
                let type = '';
                if (result.data[0]) {
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
                let course = '';
                if (result.data[0]) {
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

    rawChange(e) {
        const val = e.target.value;
        const raw = this.parseRawString(val);

        this.setState({rawString: val, raw});
    }

    parseRawString(s) {
        const regMatch = s.split(/`(.*?)`/);

        if (s.length === 0) {
            return [];
        }

        let isMath = false;
        if ((s.charAt() === '`') && (s.charAt(1) !== '`') && (regMatch[0] === '')) {
            isMath = true;
        }

        let arr = [];
        regMatch.forEach(regS => {
            if (!!regS) {
                const obj = {
                    isMath,
                    value: regS
                };
                arr.push(obj);
                isMath = !isMath;
            }
        });

        return arr;

    }

    formSubmitBuilder(e) {
        e.preventDefault();

        const values = {
            title: this.state.title,
            type: this.state.type,
            course: this.state.course,
            raw: this.state.raw,
            notes: this.state.notes,
        }

        this.state.createHandler(e, values);
    }

    renderTypeOptions() {
        return this.state.types.map((type) => <option key={type.id}>{type.name}</option>);
    }

    renderCourseOptions() {
        return this.state.courses.map((course) => <option key={course.id}>{course.code}</option>);
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
                <FormGroup row>
                    <Label for="raw" sm={2}>Raw</Label>
                    <Input type="textarea" value={ this.state.rawString } onChange={ (e) => this.rawChange(e)} name="raw" id="raw" />
                </FormGroup>
                <RawNote raw={ this.state.raw } />
                <FormGroup row>
                    <Label for="notes" sm={2}>Additional Notes</Label>
                    <Input type="textarea" value={this.state.notes} onChange={ (e) => this.inputChange(e, 'notes')} name="notes" id="notes" />
                </FormGroup>
                <Button color="primary" onClick={ (e) => this.formSubmitBuilder(e) }>Create</Button>
            </div>
        );
    }

}

export default SnippetForm;
