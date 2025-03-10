const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const createEventSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    date: {
        type: String,  // Keeping it string to match the frontend format
        required: true
    },
    location: {
        type: String,
        required: true
    },
    time: {
        type: String,
        required: true
    },
    image: {
        type: String, // Stores the filename of the uploaded image
        required: false
    }
})

const createEvent = mongoose.model("createEvent",createEventSchema);

module.exports = createEvent;