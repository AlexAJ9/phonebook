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

    Person.find({}).then(person => {
        res.json(person)
    })

})
app.get("/info", (reqest, response) => {
    let numberOfEntries = 0;
    let date = Date();
    Person.find().then(people => {
        people.forEach(person => {
            numberOfEntries++;
            console.log(numberOfEntries);
        })
        response.send(`Phonebook has ${numberOfEntries} people  ${date}`)
    })
})
app.get("/api/persons/:id", (req, res, next) => {
    let id = req.params.id
    console.log(req.params.id)
    Person.findById(id).then(person => {
        if (person) {
            res.json(person.toJSON())
        }
        else res.status(404).end()
    })
        .catch(error => next(error)
        )
})
app.delete("/api/persons/:id", (req, res, next) => {
    let id = req.params.id;
    Person.findByIdAndRemove(id).then(result => {
        res.status(204).end()
    })
        .catch(error => next(error))
})
app.post("/api/persons", (req, res) => {
    const body = req.body
    if (body.name === undefined) {
        return res.status(400).json({ error: 'content missing' })
    }
    if (!body.number) {
        return res.status(400).json({
            error: "number is mising"
        })
    }
    let person = new Person({
        name: body.name,
        number: body.number,
    })
    person.save().then(savedPerson => {
        res.json(savedPerson.toJSON())
    })

})
app.put("/api/persons/:id", (req,res,next)=>{
   const updatedPerson={
       name:req.body.name,
       number:req.body.number
   }
    Person.findByIdAndUpdate(req.params.id,updatedPerson,{new:true,useFindAndModify:false}).then(person=>{
         res.json(person.toJSON()) 
    })
    .catch(error=>next(error))
})

const unknownEndpoint = (req, res) => {
    return res.status(404).send({ error: "unknown endpoint" })
}
app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    console.log(error.message);
    if (error.name = "Cast Error" || error.kind === "ObjectId") {
        return res.status(400).send({ error: "bad id" })
    }
    next(error)
}
app.use(errorHandler)
const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})