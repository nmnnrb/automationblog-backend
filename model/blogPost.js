const mongoose = require('mongoose');


const postSchema = new mongoose.Schema({
   
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
        trim: true
    },
    date: { type: Date, default: Date.now },
      author: { type: String, default: "Naman Sharma" },

      summaryBool: {
        type: Boolean,
        default: false,
      },

      summaryData: {
        type: String,
        required: false,
      }
    

});


module.exports = mongoose.model('BlogPost', postSchema);