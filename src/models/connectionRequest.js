const mongoose = require('mongoose')

const connectionRequestSchema = mongoose.Schema({
    toUserId:{
       type: mongoose.Schema.ObjectId,
       ref:'User'
    },
    fromUserId:{
       type: mongoose.Schema.ObjectId,
       ref:'User'
    },
    status:{
        type: String,
        enum:['interested', 'ignored', 'accepted', 'rejected']
    }
},{timestamps:true})

module.exports = mongoose.model('ConnectionRequest', connectionRequestSchema)