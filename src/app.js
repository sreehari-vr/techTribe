const express = require("express");
const app = express();
const { connectDb } = require("./config/database"); //USE ; BEFORE IIFE
const cookieParser = require('cookie-parser')
const User = require('./models/user')
app.use(cookieParser())
app.use(express.json());
const authRouter = require('./Routes/auth')
const profileRouter = require('./Routes/profile')
const request = require('./Routes/request')
const user = require('./Routes/user')
const cors = require('cors')

app.use(cors({
  origin:'http://localhost:5173',
  credentials: true
}))
app.use('/',authRouter);
app.use('/',profileRouter)
app.use('/',request)
app.use('/',user)

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
