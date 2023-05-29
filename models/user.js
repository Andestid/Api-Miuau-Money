const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        min:3,
        max:250
    },
    email:{
        type:String,
        required:true,
        min:6,
        max:250
    },
    password:{
        type:String,
        required:true,
        min:6,
        max:250
    },
    date:{
        type:Date,
        default:Date.now
    },
    moneytotal:{
        type:Number,
        default: 0
    },
    moneygasto:{
        type:Number,
        default: 0
    },
    moneysobrante:{
        type:Number,
        default: 0
    }
})

module.exports = mongoose.model('User',UserSchema);
