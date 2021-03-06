import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Container } from "reactstrap";

// Components
import { SearchBar } from "../components/latex-editor/searchBar";
import { SnippetCard } from "../components/snippets/snippet-card";

// Functions/Enums
import {apiGet, isAuthenticated} from "../api/functions";
import {Endpoint} from "../api/endpoints";
import {SEARCH_LIMIT} from "../api/constants";
import {ISnippet} from "../interfaces/snippets";

interface Props {
    history: any;
}

interface State {
    isLoaded: boolean;
    isSearchDone: boolean;
    snippets: ISnippet[];
}

export class Main extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            isLoaded: false,
            isSearchDone: false,
            snippets: []
        };
    }

    componentDidMount() {
        isAuthenticated()
            .then(data => {
                const isAuthorized = data.authorized;
                if (isAuthorized) {
                    this.setState({isLoaded: true});
                    this.getSnippets();
                } else {
                    this.props.history.push('/login');
                }
            });
    }

    getSnippets() {
        apiGet(Endpoint.SNIPPETS)
            .then(res => res.json())
            .then(result => {
                const snippets = result.data;
                const isSearchDone = true;
                this.setState({snippets, isSearchDone});
            })
            .catch(e => {
                console.error(e);
            })
    }

    searchHandler(raw) {
        const query = {query: JSON.stringify(raw), limit: SEARCH_LIMIT};

        this.setState({isSearchDone: false});
        apiGet(Endpoint.SEARCH, undefined, query)
            .then(res => res.json())
            .then(result => {
                const snippets = result.data;
                this.setState({snippets, isSearchDone: true});
            })
            .catch(e => {
                console.error(e);
            })
    }

    renderSingleSnippet(snippet) {
        const course = snippet.course;
        const created_at = snippet.created_at;
        const id = snippet.id;
        const raw = snippet.raw;
        const snippet_type = snippet.snippet_type;
        const title = snippet.title;
        const updated_at = snippet.updated_at;
        // this div is used to get rid of the stretched height of each box in the flex row.
        return (
            <div key={id}>
                <SnippetCard course={course}
                             created_at={created_at}
                             id={id}
                             raw={raw}
                             snippet_type={snippet_type}
                             title={title}
                             updated_at={updated_at}
                             history={this.props.history}
                />
            </div>
        );
    }

    renderSnippets2() {
        if (!this.state.isSearchDone) {
            return (
                <p>Loading...</p>
            );
        }

        const snippets = this.state.snippets.slice();
        if (snippets.length === 0 && this.state.isSearchDone) {
            return (
                <p>No snippets found.</p>
            );
        }

        return snippets.map((snippet) => {
            return this.renderSingleSnippet(snippet);
        });
    }

    render() {
        if (this.state.isLoaded) {
            return (
                <Container>
                    <h1>All Snippets</h1>
                    <Link to="/new">New Snippet</Link>
                    <hr/>
                    <SearchBar searchHandler={ (raw) => this.searchHandler(raw) } />
                    <hr/>
                    <Container className="snippets-container">
                        { this.renderSnippets2() }
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
