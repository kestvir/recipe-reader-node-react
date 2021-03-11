import express from "express";
import passport from "passport";
import User from "../models/user";
import bcrypt from "bcryptjs";
import { IMongoDBUser } from "../src/types";
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { email, password } = req?.body;
  if (
    !email ||
    !password ||
    typeof email !== "string" ||
    typeof password !== "string"
  ) {
    res.send("Improper Values");
    return;
  }
  User.findOne({ email }, async (err: Error, doc: IMongoDBUser) => {
    if (err) throw err;
    if (doc) res.send("Email already exists");
    if (!doc) {
      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        email,
        password: hashedPassword,
      });
      await newUser.save();
      req.login(newUser, (err) => {
        if (err) {
          res.send(err);
        } else {
          res.send("success");
        }
      });
    }
  });
});

router.post("/login", passport.authenticate("local"), (req, res) => {
  res.send("success");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.send("success");
});

module.exports = router;
