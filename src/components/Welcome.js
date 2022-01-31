import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import './Welcome.css'
import Spaceships from "./Spaceships";
import Astronauts from "./Astronauts";

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";


class Welcome extends React.Component {

    render () {
        return (
            <Container fluid>
                <Row fluid className="fh">
                    <Col sm={3} className="pt-5 menu">

                        <img src="/esa.jpg" width="100%" className="mb-5"/>
                
                    </Col>
                    <Col sm={9}>
                        <Spaceships/>

                        <Astronauts/>

                    </Col>
                </Row>
            </Container>
        )
    }
}

export default Welcome