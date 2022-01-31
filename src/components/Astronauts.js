import React  from "react";
import axios from "axios";
import { ListGroup, Form, Button, Alert} from "react-bootstrap";

class Astronauts extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            astronauts: [            
            ], 

            id: 0,
            name: '', 
            spaceshipID: 0, 
            Role: '', 
            errors: [], 
            spaceships: []
        };

    
        
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.onEditSuper = this.onEditSuper.bind(this);

        axios.get (
            'http://localhost:8080/astronaut'
        ).then(result => {
            let arr = [];
            result.data.forEach(element => {
                arr.push({
                    id: element.ID, 
                    name: element.Name, 
                    spaceshipID: element.SpacecraftID, 
                    role: element.Role
                });
            });

            this.setState({astronauts: arr})
        
        });


        axios.get (
            'http://localhost:8080/spacecraft'
        ).then(result => {
            this.setState({spaceships: result.data})
        });
    }

    onEditSuper(id) {
        let sp = this.state.astronauts.find(el => el.ID == id);
        this.setState(state => ({
            id: id,
            name: sp.name,
            Role: sp.role,
            SpacecraftID: sp.spaceshipID
        }))
    }

    handleSubmit(e) {
        e.preventDefault();

        const newAstro = {
            name: this.state.name, 
            spaceshipID: this.state.spaceshipID, 
            role: this.state.Role
        };

        axios.post(
            'http://localhost:8080/astronaut', 
            {
                Name: newAstro.name, 
                SpacecraftID: newAstro.spaceshipID, 
                Role: newAstro.role
            }       
        ).then (result => {
            this.setState(state => ({
                spaceships: state.spaceships.concat(newAstro), 
                name: '', 
                mass: 0, 
                velocity: 0, 
                errors: []
            }))
        })

        this.setState(state => ({
            astronauts: state.astronauts.concat(newAstro), 
            name: '', 
            Role: '', 
            spaceshipID: 0, 
            errors: []
        }))


        console.log (this.state.astronauts);
    }

    handleDelete(e) {
        axios.delete('http://localhost:8080/astronaut/' + this.state.id).then(res => {
            window.location.reload()
        })
    }

    handleChange(e) {

        if (e.target.id == 'astro-name') {
            this.setState({name: e.target.value});
        }

        if (e.target.id == 'astro-role') {
            this.setState({Role: e.target.value});
        }

        if (e.target.id == 'astro-ship') {
            this.setState({spaceshipID: e.target.value});
        }
    }
    
    render() {        
        let button;

        if (this.state.id == 0) {
            button = <Button onClick={this.handleSubmit}>Add Spaceship</Button>;
          } else {
            button = <Button onClick={this.handleSubmit}>Update Spaceship</Button>;
          }


        return (
            <div>
                <h1 className="mt-5">Astronauts</h1> 
                <AstronautList astronauts={this.state.astronauts} spaceships={this.state.spaceships}/>
                
                <Form onSubmit={this.handleSubmit} className="mt-5">
                <Form.Group className="mb-3">
                    <Form.Label>Astronaut's Name</Form.Label>
                    <Form.Control type="text" id="astro-name" value={this.state.name} placeholder="Name" onChange={this.handleChange}/>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Astronaut's Role</Form.Label>
                    
                    <Form.Select aria-Label="" id="astro-role" value={this.state.Role} onChange={this.handleChange}>
                        <option value="">--- Select Role ---</option>
                        <option value="Commander">Commander</option>
                        <option value="Pilot">Pilot</option>
                        <option value="Shooter">Shooter</option>
                    </Form.Select>

                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Assigned to Spaceship</Form.Label>
                    <Form.Select aria-Label="" id="astro-ship" value={this.state.spaceshipID} onChange={this.handleChange}>
                        <option value="0">---- Select spaceship ----</option>

                        {this.state.spaceships.map(ship => (                        
                            <option value={ship.ID}>{ship.Name}</option>
                        ))}
                    </Form.Select>
                </Form.Group>

                
                {button}
                </Form>    
            </div>

        )
    }

}

class AstronautList extends React.Component {

    onEdit(id) {
        this.props.onEditSuper(id);
    }

    render() {
        return (
            <ListGroup>
                {this.props.astronauts.map(astro => (
                    <ListGroup.Item action href="#" onClick={() => this.onEdit(astro.id)}>{astro.name} as {astro.role}, assigned to: <b>{astro.spaceshipID}</b></ListGroup.Item>
                ))}
            </ListGroup>
        )
    }
}


export default Astronauts