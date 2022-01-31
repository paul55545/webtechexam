const express = require('express')
const bodyParser = require('body-parser')
const Sequelize = require('sequelize')
const path = require('path')
const Op = Sequelize.Op
const cors = require('cors')
const { ForeignKeyConstraintError, json } = require('sequelize')
const { exists } = require('fs')


const sequelize = new Sequelize('astronaut', 'root', '1234', {
    dialect: 'mysql'
})

const Spacecraft = sequelize.define('Spacecraft',{
    ID:{
        type:Sequelize.INTEGER,
        primaryKey: true,
        allowNull: true,

    },
    Name:{
        type: Sequelize.STRING,
        allowNull:false,
        validate: {
            len: [3,50],
        }
    },
    MaxSpeed:{
        type:Sequelize.INTEGER,
        allowNull:false,
        validate: {
            min: 1000
        }
    },
    Mass:{
        type: Sequelize.INTEGER,
        allowNull:false,
        validate:{
            min: 200
        }
    }, 

}, {timestamps: false})

const Astronaut = sequelize.define('Astronaut',{
    ID:{
        type:Sequelize.INTEGER,
        primaryKey: true, 
        allowNull: true,

    },
    SpacecraftID:{
        type:Sequelize.INTEGER,
        allowNull: false,
    },
    Name:{
        type:Sequelize.STRING,
        allowNull:false,
        validate:{
            len:[5,50]
        }
    },
    Role:{
        type:Sequelize.ENUM('Commander','Pilot','Shooter'),
        allowNull:false,
    }
}, {timestamps: false})



const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/Spacecraft', async (req, res, next) => {
    console.log('in spacecraft');
    const query = {
        where: {}
    }

    try {
        const spacecraft = await Spacecraft.findAll(query)
        res.status(200).json(spacecraft)
    } catch (err) {
        next(err)
    }
})

app.post('/Spacecraft', async (req, res, next) => {

    console.log('in spacecraft post');
    console.log (req); 

    const errors = [];

    const spacecraft = {    
        Name: req.body.Name,
        MaxSpeed: req.body.MaxSpeed,
        Mass: req.body.Mass,
    }

    const exists_name = await Spacecraft.findOne({ where: { Name: req.body.Name } });
    console.log(exists_name)
    if (exists_name) {
        errors.push("Name already in use!");
        await Spacecraft.update(spacecraft, { where: { ID: exists_name.dataValues.ID } })
        res.status(202).json({ message: 'accepted' })
    }

    if (errors.length === 0) {
        try {
            await Spacecraft.create(spacecraft)
            res.status(201).json({ message: 'created' })
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: "Spacecraft creation has failed (Server error)" })
        }
    } else {
        res.status(400).send({ errors })
    }

})

app.get('/Spacecraft/:sid', async (req, res, next) => {
    try {
        const spacecraft = await Spacecraft.findByPk(req.params.sid)
        if (spacecraft) {
            res.status(200).json(spacecraft)
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (err) {
        next(err)

    }
})

app.put('/Spacecraft/:sid', async (req, res, next) => {
    try {
        const spacecraft = await Spacecraft.findByPk(req.params.sid)
        console.log(spacecraft)
        if (spacecraft) {
            const errors = [];

            const newSpacecraft = {
                ID: req.body.ID,
                Name: req.body.Name,
                MaxSpeed: req.body.MaxSpeed,
                Mass: req.body.Mass
            }

            if (!req.body.ID) {
                newSpacecraft.ID = spacecraft.dataValues.ID
            }

            if (!req.body.Name) {
                newSpacecraft.Name = spacecraft.dataValues.Name
            }

            if (!req.body.MaxSpeed) {
                newSpacecraft.MaxSpeed = spacecraft.dataValues.MaxSpeed
            }

            if (!req.body.Mass) {
                newSpacecraft.Mass = spacecraft.dataValues.Mass
            }

            if (!/^[a-zA-Z0-9]+$/.test(newSpacecraft.Name)) {
                errors.push("Invalid name!")
            }


            if (req.body.Name) {
                const exists_spacecraft = await Spacecraft.findOne({ where: { Name: newSpacecraft.Name } });
                if (exists_spacecraft) {
                    errors.push("Name already in use!");
                }
            }

            if (errors.length === 0) {
                await Spacecraft.update(newSpacecraft, { where: { ID: req.params.sid } })
                res.status(202).json({ message: 'accepted' })
            } else {
                res.status(400).send(errors)
            }

        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (err) {
        next(err)

    }
})

app.delete('/Spacecraft/:sid', async (req, res, next) => {
    try {
        const spacecraft = await Spacecraft.findByPk(req.params.sid)
        if (spacecraft) {
            await spacecraft.destroy()
            res.status(202).json({ message: 'deleted' })
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (err) {
        next(err)

    }
})

app.get('/Astronaut', async (req, res, next) => {
    const query = {
        where: {}
    }
    try {
        const astronaut = await Astronaut.findAll(query)
        res.status(200).json(astronaut)
    } catch (err) {
        next(err)
    }
})

app.get('/Astronaut/:sid', async (req, res, next) => {
    try {
        const astronaut = await Astronaut.findByPk(req.params.sid)
        if (astronaut) {
            res.status(200).json(astronaut)
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (err) {
        next(err)

    }
})

app.put('/Astronaut/:sid', async (req, res, next) => {
    try {
        const astronaut = await Astronaut.findByPk(req.params.sid)
        console.log(astronaut)
        if (astronaut) {
            const errors = [];

            const newAstronaut = {
                ID: req.body.ID,
                SpacecraftID: req.body.SpacecraftID,
                Name: req.body.Name,
                Role: req.body.Role,
            }

            if (!req.body.ID) {
                newAstronaut.ID = astronaut.dataValues.ID
            }

            if (!req.body.SpacecraftID) {
                newAstronaut.SpacecraftID = astronaut.dataValues.SpacecraftID
            }

            if (!req.body.Name) {
                newAstronaut.Name = astronaut.dataValues.Name
            }

            if (!req.body.Role) {
                newAstronaut.Role = astronaut.dataValues.Role
            }

            if (!/^[a-zA-Z0-9]+$/.test(newAstronaut.Name)) {
                errors.push("Invalid name!")
            }


            if (req.body.Name) {
                const exists_astronaut = await Astronaut.findOne({ where: { Name: newAstronaut.Name } });
                if (exists_astronaut) {
                    errors.push("Name already in use!");
                }
            }

            if (errors.length === 0) {
                await Astronaut.update(newAstronaut, { where: { ID: req.params.sid } })
                res.status(202).json({ message: 'accepted' })
            } else {
                res.status(400).send(errors)
            }

        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (err) {
        next(err)

    }
})

app.post('/Astronaut', async (req, res, next) => {

    console.log ('IN astronaut creation');

    const errors = [];

    const astronaut = {        
        Name: req.body.Name,
        Role: req.body.Role,
        SpacecraftID: req.body.SpacecraftID
    }

    const exists_name = await Astronaut.findOne({ where: { Name: req.body.Name } });
    console.log(exists_name)
    if (exists_name) {
        errors.push("Name already in use!");
        await Astronaut.update(astronaut, { where: { ID: exists_name.dataValues.ID } })
        res.status(202).json({ message: 'accepted' })
    }

    if (errors.length === 0) {
        try {
            await Astronaut.create(astronaut)
            res.status(201).json({ message: 'created' })
        } catch (error) {
            console.log(error)
            res.status(500).send({ message: "Astronaut creation has failed (Server error)" })
        }
    } else {
        res.status(400).send({ errors })
    }

})

app.delete('/Astronaut/:sid', async (req, res, next) => {
    try {
        const astronaut = await Astronaut.findByPk(req.params.sid)
        if (astronaut) {
            await astronaut.destroy()
            res.status(202).json({ message: 'deleted' })
        } else {
            res.status(404).json({ message: 'not found' })
        }
    } catch (err) {
        next(err)

    }
})


app.use((err, req, res, next) => {
    console.warn(err)
    res.status(500).json({ message: 'server error' })
})
//#endregion GROUPS

//route to download a file
// app.get('/Spacecraft/download/export',(req, res) => {
// var file = req.params.file;
// var fileLocation = path.join('./downloads',file);
// console.log(fileLocation);
// res.download(fileLocation, file);
// });

// app.get('/Astronaut/download/export',(req, res) => {
//     var file = req.params.file;
//     var fileLocation = path.join('./downloads',file);
//     console.log(fileLocation);
//     res.download(fileLocation, file);
//     });

app.listen(8080)