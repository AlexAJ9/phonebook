const express = require("express")
const cors = require('cors')
const parse = require("body-parser")
const morgan = require('morgan')
const app = express();
app.use(parse.json())
app.use(cors())
app.use(express.static('build'))

// app.use(morgan('tiny'))
morgan.token('data', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :data "))

let entries = [
    {
        name: "alex",
        number: "123123",
        id: 1

    },
    {
        name: "alx",
        number: "5666",
        id: 2
    },
    {
        name: "coco",
        number: "6234234",
        id: 3
    }
]

app.get("/api/persons", (req, res) => {

    res.json(entries);

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

    if (!req.body.number) {
        return res.status(400).json({
            error: "number is mising"
        })
    }
    let newName = req.body.name;
    if (entries.find(person => person.name === newName)) {
        return res.status(400).json({
            error: "name must be unique"
        })
    }
    let person = {
        name: req.body.name,
        number: req.body.number,
        id: Math.random(10000)
    }

    entries = entries.concat(person)
    res.json(person)
})
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})