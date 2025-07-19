const express = require('express')
const profileRouter = express.Router()
const {userAuth} = require('../middleware/auth')


profileRouter.get('/profile', userAuth, async (req, res) =>{
    try {
        const user = req.user
        if(user){
            res.send(user)
        }else{
            res.send('no user')
        }
    } catch (error) {
        res.send(error.message)
    }
})

module.exports = profileRouter