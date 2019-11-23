const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator');
require('dotenv').config()
const url = process.env.MONGODB_URI

console.log("connecting to", url)

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const PersonSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true, minlength: 3 },
  number: { type: String, unique: true, required: true, minlength: 8 }
})
PersonSchema.plugin(uniqueValidator);
PersonSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
const Person = mongoose.model("Person", PersonSchema)

module.exports = Person;