const express = require("express");
const app = express();
const { connectDb } = require("./config/database"); //USE ; BEFORE IIFE
const User = require("./models/user");
app.use(express.json());
const { signUpValidation } = require("./utils/helper");
const bcrypt = require('bcrypt');

app.post("/signUp", async (req, res) => {
  //CREATING A NEW INSTANCE OF USER MODEL
  try {
    console.log(req.body)
    await signUpValidation(req);
    const { firstName, lastName, email, password,age, gender, skills, about } = req.body;
    const encryptedPass = await bcrypt.hash(password,10)
    console.log(encryptedPass)
    const user = new User({
      firstName,
      lastName,
      email,
      password: encryptedPass,
      age,
      gender,
      skills,
      about
    });
    await user.save();
    res.send("user saved");
  } catch (error) {
    res.send(error.message);
    console.error(error.message);
  }
});

app.post('/login', async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne({email})
        if(!user){
            throw new Error('Invalid Credentials')
        }
        const decryptedPass = await bcrypt.compare(password, user.password)
        if(decryptedPass){
            res.send('logged in')
        }else{
            throw new Error('Invalid Credentials')
        }
    } catch (error) {
        res.status(400).send(error.message)
    }
})

app.get("/user", async (req, res) => {
  const userName = req.body.firstName;
  try {
    const user = await User.find({ firstName: userName });
    if (!user) {
      res.status(404).send("not found");
    } else {
      res.send(user);
    }
  } catch (error) {
    console.error(error.message);
  }
});

// IN MONGOOSE PUT AND PATCH WILL BEHAVE SAME
app.patch("/user/:id", async (req, res) => {
  const userId = req.params?.id;
  const data = req.body;
  const allowedUpdates = ['firstName', 'lastName', 'about', 'gender', 'age', 'skills'];
  const isAllowed = Object.keys(data).every((k) => allowedUpdates.includes(k));
  try {
    if (!isAllowed) {
      throw new Error("Updation not allowed");
    }
    //FIND IT UPDATE IT AND RETURNS PROMISE AWAIT RESOLVES IT, BECOMES NORMAL OBJ, USER BECOMES THE UPDATED OBJ
    const user = await User.findByIdAndUpdate(userId, data);
    if (!user) {
      res.status(404).send("Not found");
    } else {
      res.send(user); // BY DEFAULT SHOW THE DATA BEFORE UPDATION BUT UPDATION WILL HAPPEN
    }
  } catch (error) {
    res.send(error.message);
  }
});

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      res.status(404).send("Not found");
    } else {
      res.send("deleted successfully");
    }
  } catch (error) {
    console.error(error.message);
    res.send(error.message);
  }
});

(async () => {
  try {
    await connectDb();
    console.log("D.B connection established..✅");
    app.listen(5000, () => {
      console.log("🚀 Server running at http://localhost:5000");
    });
  } catch (error) {
    console.error(error.message);
  }
})();
