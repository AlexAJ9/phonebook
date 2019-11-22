const express = require("express")
const cors = require('cors')
const parse = require("body-parser")
const morgan = require('morgan')
const app = express();
const Person = require("./models/person")

require('dotenv').config()
app.use(parse.json())
app.use(cors())
app.use(express.static('build'))

// app.use(morgan('tiny'))
morgan.token('data', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :data "))



app.get("/api/persons", (req, res) => {

    Person.find({}).then(response => {
        res.json(response)
    })

})
app.get("/info", (reqest, response) => {
    let numberOfEntries = entries.length;
    let date = Date();
    response.send(`Phonebook has ${numberOfEntries} people  ${date}`)
})
app.get("/api/persons/:id", (req, res) => {
    let id = Number(req.params.id);
    let person = entries.find(person => person.id === id)
    if (person) {
        res.json(person)
    }
    else res.status(404).end()
})
app.delete("/api/persons/:id", (req, res) => {
    let id = Number(req.params.id);
    let person = entries.filter(person => person.id == id)
    res.status(204).end();
})
app.post("/api/persons", (req, res) => {
    const body = req.body
    if (body.content === undefined) {
        return response.status(400).json({ error: 'content missing' })
      }
    if (!body.number) {
        return res.status(400).json({
            error: "number is mising"
        })
    }
    let newName = body.name;
    if (entries.find(person => person.name === newName)) {
        return res.status(400).json({
            error: "name must be unique"
        })
    }
    let person = new Person({
        name: body.name,
        number: body.number,
        
    })

    Person.save().then(savedPerson=>{
        res.json(savedPerson.toJSON())
    })
    res.json(person)
})
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})