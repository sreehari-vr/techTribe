const express = require('express');
const app = express();
const { connectDb } = require('./config/database'); //USE ; BEFORE IIFE
const User = require('./models/user');
app.use(express.json());

app.post('/signUp', async (req, res)=>{
    //CREATING A NEW INSTANCE OF USER MODEL
    console.log(req.body)
    const user = new User(req.body)
    try {
        await user.save()
        res.send('user saved')
    } catch (error) {
        console.error(error.message)
    }
});

app.get('/user', async (req,res)=>{
    const userName = req.body.firstName;
try {
    const user = await User.find({firstName: userName})
    if(!user){
        res.status(404).send('not found')
    }else{
        res.send(user)
    }
} catch (error) {
    console.error(error.message)
}
});

// IN MONGOOSE PUT AND PATCH WILL BEHAVE SAME
app.patch('/user', async (req, res) => {
    const userId = req.body.userId
    const data = req.body
    try {
        //FIND IT UPDATE IT AND RETURNS PROMISE AWAIT RESOLVES IT, BECOMES NORMAL OBJ, USER BECOMES THE UPDATED OBJ
        const user = await User.findByIdAndUpdate(userId,data) 
        if(!user){
            res.status(404).send('Not found')
        }else{
            res.send(user) // BY DEFAULT SHOW THE DATA BEFORE UPDATION BUT UPDATION WILL HAPPEN
        }
    } catch (error) {
        res.send(error.message)
    }
});

app.delete('/user', async (req, res) => {
    const userId = req.body.userId
    try {
        const user = await User.findByIdAndDelete(userId)
        if(!user){
            res.status(404).send('Not found')
        }
        else{
        res.send('deleted successfully')
        }
    } catch (error) {
        console.error(error.message)
        res.send(error.message)
    }
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

