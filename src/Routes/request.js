const express = require('express')
const requestRouter = express.Router()
const {userAuth} = require('../middleware/auth')


requestRouter.post('/sendConnectionRequest', userAuth, async (req, res) =>{
    try {
        const user = req.user
        if(user){
            res.send(user.firstName + " sending connection request")
        }else{
            res.send('connection request not sent')
        }
    } catch (error) {
        res.send(error.message)
    }
})

module.exports = requestRouter