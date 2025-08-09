const express = require("express");
const { connectDB } = require("./config/database");
const app = express();
const User = require("./models/user");
const { AuthAdmin, UserAuth } = require("./middleware/auth");

connectDB()
  .then(() => {
    console.log("DB Connection succssfully established..");
    app.listen(3000, () => {
      console.log("server stated successfully on port number 3000 ...");
    });
  })
  .catch((err) => {
    console.error("connection not established !!!");
  });

app.use(express.json());

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    const savedUser = await user.save();
    res.status(201).send(savedUser);
  } catch (error) {
    res.status(400).send("Error saving user: " + error.message);
  }
});
app.get("/user", UserAuth, async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send("Error Fetching users: " + error.message);
  }
});
app.delete("/user", AuthAdmin, async (req, res) => {
  try {
    const userId = req.body.userId;
    const deletedUser = await User.findOneAndDelete(userId);
    if (!deletedUser) {
      return res.status(404).send("User not found");
    } else {
      res.status(200).send("User deleted successfully");
    }
  } catch (error) {
    res.status(500).send("Error Fetching users: " + error.message);
  }
});
app.patch("/user", AuthAdmin, async (req, res) => {
  const userdId = req.body.userId;
  const updateDataa = req.body;
  try {
    const updatedUser = await User.findByIdAndUpdate(userdId, updateDataa);
    if (!updatedUser) {
      return res.status(404).send("User not found");
    } else {
      return res.status(200).send("User updated successfully");
    }
  } catch (error) {
    res.status(500).send("Error Fetching users: " + error.message);
  }
});
