import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from "reactstrap";

// Components
import SearchBar from "../components/latex-editor/searchBar";
import SnippetCard from "../components/snippets/snippet-card";

// Functions/Enums
import {chunkArray} from "../utils/utils";
import {apiGet, isAuthenticated} from "../api/functions";
import {EndpointsEnum} from "../api/endpoints";

class Main extends Component {

    snippetsPerRow = 2;

    constructor(props) {
        super(props);
        this.state = {
            isLoaded: false,
            snippets: []
        };
    }

    componentDidMount() {
        isAuthenticated()
            .then(isAuthorized => {
                if (isAuthorized) {
                    this.setState({isLoaded: true});
                    this.getSnippets();
                } else {
                    this.props.history.push('/login');
                }
            });
    }

    getSnippets() {
        apiGet(EndpointsEnum.SNIPPETS)
            .then(res => res.json())
            .then(result => {
                const snippets = result.data;
                this.setState({snippets});
            })
            .catch(e => {
                console.error(e);
            })
    }

    renderSingleSnippet(snippet) {
        const course = snippet.course;
        const created_at = snippet.created_at;
        const id = snippet.id;
        const is_title_math = snippet.is_title_math;
        const raw = snippet.raw;
        const snippet_type = snippet.snippet_type;
        const title = snippet.title;
        const updated_at = snippet.updated_at;
        return (
            <SnippetCard key={id}
                         course={course}
                         created_at={created_at}
                         id={id}
                         is_title_math={is_title_math}
                         raw={raw}
                         snippet_type={snippet_type}
                         title={title}
                         updated_at={updated_at}
                         history={this.props.history}
            />
        );
    }

    renderSnippetsRow(snippets) {
        return snippets.map((snippet, i) => {
            return (
                <Col sm={ 12 / this.snippetsPerRow } key={ 'col_' + i }>
                    { this.renderSingleSnippet(snippet) }
                </Col>
            );
        });
    }

    renderSnippets() {
        const snipRows = chunkArray(this.snippetsPerRow, this.state.snippets);
        return snipRows.map((row, i) => {
            return (
                <Row className="margin-bottom" key={ 'row_' + i }>
                    { this.renderSnippetsRow(row) }
                </Row>
            );
        });
    }

    searchHandler(raw) {
        console.log('searching!!');
        console.log(raw);

        const query = {query: JSON.stringify(raw)};
        apiGet(EndpointsEnum.SEARCH, null, query)
            .then(res => res.json())
            .then(result => {
                console.log(result);
            })
            .catch(e => {
                console.error(e);
            })
    }

    render() {
        if (this.state.isLoaded) {
            return (
                <Container>
                    <h1>My Snippets</h1>
                    <Link to="/new">New Snippet</Link>
                    <hr/>
                    <SearchBar searchHandler={ (raw) => this.searchHandler(raw) } />
                    <hr/>
                    <Container>
                        {this.renderSnippets()}
                    </Container>
                </Container>
            );
        } else {
            return (
                <p>Loading...</p>
            );
        }
    }

}

export default Main;
