const express = require('express');
const app = express();
const { connectDb } = require('./config/database'); //use ; before iife
const User = require('./models/user');
const user = require('./models/user');
app.use(express.json())

app.post('/signUp', async (req, res)=>{
    //Creating a new instance of the User model
    console.log(req.body)
    const user = new User(req.body)
    try {
        await user.save()
        res.send('user saved')
    } catch (error) {
        console.error(error.message)
    }
});

app.get('/signUp', async (req,res)=>{
    await user.find(firstName)
});

(async () => {
    try {
        await connectDb()
        console.log('D.B connection established..✅')
        app.listen(5000,()=>{
            console.log('🚀 Server running at http://localhost:5000')
        })
    } catch (error) {
        console.error(error.message)
    }
})()

