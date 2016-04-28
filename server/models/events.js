// grab the things we need
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var registerSchema = new Schema({
    firstName:  {
        type: String,
        unique: true
    },
    lastName:  {
        type: String,
        unique: true
    },
    email:  {
        type: String,
        unique: true
    },
}, {
    timestamps: true
});

// create a schema
var eventSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
     image: {
        type: String,
        required: true
    },
    available: {
        type: Boolean,
        required: true
    },
    registration:[registerSchema]
}, {
    timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Events = mongoose.model('Event', eventSchema);

// make this available to our Node applications
module.exports = Events;