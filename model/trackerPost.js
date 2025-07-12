const mongoose = require('mongoose');
const UserModel = require('./auth/UserModel')

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
    date: {type: String,
            required: true,
    },
    userId: {
  type: mongoose.Schema.Types.ObjectId,
  ref: "UserModel",
  required: true,
},
    dateNow: { type: Date, default: Date.now }
})



module.exports = mongoose.model("TrackerPost" , trackerPostSchema);