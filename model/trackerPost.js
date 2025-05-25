const mongoose = require('mongoose');


const trackerPostSchema = new mongoose.Schema({
    title: {type: String,
            required: false
    },
    author: {type: String,
            required: false
    },
    content: {type: String,
            required: true,
    },
    dateManual: {type: String,
            required: true,
    },
    date: { type: Date, default: Date.now }
})



module.exports = mongoose.model("TrackerPost" , trackerPostSchema);