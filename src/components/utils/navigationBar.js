import React, { Component } from "react";
import {
    Navbar,
    NavbarBrand,
    Collapse,
    Nav,
    NavItem,
    NavLink,
} from 'reactstrap';
import {apiLogout, isAuthenticated} from "../../api/functions";

class NavigationBar extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isLoaded: false,
            isAuthorized: false
        };

    }

    componentDidMount() {
        isAuthenticated()
            .then(isAuthorized => {
                const isLoaded = true;
                this.setState({isAuthorized, isLoaded});
            });
    }

    logoutHandler() {
        apiLogout();

    }

    renderNavItems() {
        const isLoaded = this.state.isLoaded;
        const isAuthorized = this.state.isAuthorized;
        if (!isLoaded) return;

        if (isAuthorized) {
            return (
                <Collapse isOpen={true} navbar>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink href="/" >My Snippets</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink onClick={ () => this.logoutHandler() } href="/login" >Logout</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            );
        } else {
            return (
                <Collapse isOpen={true} navbar>
                    <Nav className="ml-auto" navbar>
                        <NavItem>
                            <NavLink href="/login">Login</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/register">Register</NavLink>
                        </NavItem>
                    </Nav>
                </Collapse>
            );
        }

    }

    render() {
        return (
            <div>
                <Navbar color="light" light expand="md">
                    <NavbarBrand href="/">Snippets</NavbarBrand>
                    { this.renderNavItems() }
                </Navbar>
            </div>
        );
    }

}

export default NavigationBar;
