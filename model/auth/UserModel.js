const mongoose = require('mongoose');
const bcrypt = require('bcrypt')

const userSchema = new mongoose.Schema({
     
    userName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    confirmPassword: {
        type: String,
        required: true,
        minlength: 6
    },
    profileImage: {
        type: String,
        default: 'profile.jpg'
    },
    dateJoined: {
        type: Date,
        default: Date.now
    }
})



//password hasging, 
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
       this.password = await bcrypt.hash(this.password, 10);
         this.confirmPassword = await bcrypt.hash(this.confirmPassword, 10);
         next();
    }
);

module.exports = mongoose.model('UserModel', userSchema);