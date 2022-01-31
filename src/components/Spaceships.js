import React  from "react";
import { ListGroup, Form, Button, Alert} from "react-bootstrap";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import './Welcome.css'

import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
  } from "react-router-dom";
import axios from "axios";

class Spaceships extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            spaceships: [
                {
                    id: 1,
                    name: 'Soyuz', 
                    velocity: 2200, 
                    mass: 300
                }
            ], 

            id: 0,
            name: '', 
            velocity: 0, 
            mass: 0, 
            errors: []
        };
        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.onEditSuper = this.onEditSuper.bind(this);

        axios.get (
            'http://localhost:8080/spacecraft/'
        ).then(result => {
            let arr = [];
            result.data.forEach(element => {
                arr.push({
                    id: element.ID, 
                    name: element.Name, 
                    velocity: element.MaxSpeed, 
                    mass: element.Mass
                });
            });

            this.setState({spaceships: arr})
        
        });

    }

    onEditSuper(id) {
        let sp = this.state.spaceships.find(el => el.id == id);
        this.setState(state => ({
            id: id,
            name: sp.name,
            velocity: sp.velocity, 
            mass: sp.mass
        }))
    }

    handleSubmit(e) {
        e.preventDefault();

        let err = 0;
        if (this.state.name.length < 3) {
            this.setState(state => ({
                errors: state.errors.concat('Spaceship length must be lobger than 3'), 
            }))
            err = 1;
        }

        if (!err) {
            const newShip = {
                name: this.state.name, 
                mass: this.state.mass, 
                velocity: this.state.velocity
            };
            // console.log (this.state.spaceships);

            axios.post(
                'http://localhost:8080/spacecraft', 
                {
                    Name: newShip.name, 
                    Mass: newShip.mass, 
                    MaxSpeed: newShip.velocity
                }       
            ).then (result => {
                this.setState(state => ({
                    spaceships: state.spaceships.concat(newShip), 
                    name: '', 
                    mass: 0, 
                    velocity: 0, 
                    errors: []
                }))
            })
        }
    }

    handleChange(e) {

        if (e.target.id == 'spaceship-name') {
            this.setState({name: e.target.value});
        }

        if (e.target.id == 'spaceship-velocity') {
            this.setState({velocity: e.target.value});
        }

        if (e.target.id == 'spaceship-mass') {
            this.setState({mass: e.target.value});
        }
    }

    handleDelete(e) {
        axios.delete('http://localhost:8080/spacecraft/' + this.state.id).then(res => {
            window.location.reload()
        })
    }

    render() {

        let button, del;

        if (this.state.id == 0) {
            button = <Button onClick={this.handleSubmit}>Add Spaceship</Button>;            
            del = ''
          } else {
            button = <Button onClick={this.handleSubmit}>Update Spaceship</Button>;            
            del = <Button onClick={this.handleDelete} variant="danger">Delete Spaceship</Button>;
          }

        return (
            <div>
                <h1>Spaceships</h1> 
                <SpaceshipList spaceships={this.state.spaceships} onEditSuper={this.onEditSuper}/>

                <h3 className="mt-5">Add a new spaceship</h3>

                {this.state.errors.map((err) => (
                    <Alert variant="danger">
                        {err}
                    </Alert>
))}

                <Form onSubmit={this.handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Spaceship Name</Form.Label>
                        <Form.Control type="text" id="spaceship-name" value={this.state.name} placeholder="Name" onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Spaceship Mass</Form.Label>
                        <Form.Control type="text" placeholder="Mass" value={this.state.mass} id="spaceship-mass" onChange={this.handleChange}/>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Spaceship velocity</Form.Label>
                        <Form.Control type="text" placeholder="Velocity" value={this.state.velocity} id="spaceship-velocity"  onChange={this.handleChange}/>
                    </Form.Group>

                    
                    {button} {del}
                </Form>               
            </div>
        );
    }
}

class SpaceshipList extends React.Component {

    onEdit(id) {
        this.props.onEditSuper(id);
    }

    render() {
        return (
            <ListGroup>
                {this.props.spaceships.map(ship => (
                    <ListGroup.Item action href={() => '#' + ship.id} onClick={() => this.onEdit(ship.id)}>{ship.name}, {ship.mass} kg, {ship.velocity} kmph</ListGroup.Item>
                ))}
            </ListGroup>
        )
    }
}

export default Spaceships;