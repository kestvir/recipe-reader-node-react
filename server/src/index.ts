import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import bcrypt from "bcryptjs";
import { IMongoDBUser, IUserToSend } from "./types";
import User from "../models/user";

const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.set("trust proxy", 1);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
      // sameSite: "none",
      // secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // One Week
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user: IMongoDBUser, done: any) => {
  return done(null, user._id);
});

passport.deserializeUser((id: string, done: any) => {
  User.findById(id, (err: Error, doc: IMongoDBUser) => {
    const userToSendObj: IUserToSend = {
      id: doc._id,
      email: doc.email,
    };
    if (doc?.facebookId) userToSendObj.facebookId = doc.facebookId;
    else if (doc?.googleId) userToSendObj.googleId = doc.googleId;

    // Whatever we return goes to the client and binds to the req.user property
    return done(null, userToSendObj);
  });
});

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
    },
    (email: string, password: string, done: any) => {
      User.findOne({ email }, (err: Error, user: IMongoDBUser) => {
        if (err) throw err;
        if (!user) return done(null, false);
        bcrypt.compare(
          password,
          user.password,
          (err: Error, result: boolean) => {
            if (err) throw err;
            if (result === true) {
              return done(null, user);
            } else {
              return done(null, false);
            }
          }
        );
      });
    }
  )
);

passport.use(
  new GoogleStrategy(
    {
      clientID: `${process.env.GOOGLE_CLIENT_ID}`,
      clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
      callbackURL: "/auth/google/callback",
    },
    function (_: any, __: any, profile: any, cb: any) {
      User.findOne(
        { googleId: profile.id },
        async (err: Error, doc: IMongoDBUser) => {
          if (err) {
            return cb(err, null);
          }
          if (!doc) {
            const newUser = new User({
              googleId: profile.id,
              email: profile.emails[0].value,
            });

            await newUser.save();
            cb(null, newUser);
          } else cb(null, doc);
        }
      );
    }
  )
);

passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_APP_ID,
      clientSecret: process.env.FACEBOOK_APP_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "email"],
    },
    function (_: any, __: any, profile: any, cb: any) {
      User.findOne(
        { facebookId: profile.id },
        async (err: Error, doc: IMongoDBUser) => {
          if (err) {
            return cb(err, null);
          }
          if (!doc) {
            const newUser = new User({
              facebookId: profile.id,
              email: profile.emails[0].value,
            });

            await newUser.save();
            cb(null, newUser);
          } else cb(null, doc);
        }
      );
    }
  )
);

// Routes
app.post("/signup", async (req, res) => {
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

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: true,
  }),
  function (req, res) {
    res.redirect("http://localhost:3000/");
  }
);

app.get(
  "/auth/facebook",
  passport.authenticate("facebook", { scope: ["public_profile", "email"] })
);

app.get(
  "/auth/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    session: true,
  }),
  function (req, res) {
    res.redirect("http://localhost:3000/");
  }
);

const checkAuthentication = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    next();
  }
};

app.get("/getuser", (req, res) => {
  res.send(req.user);
});

app.post("/login", passport.authenticate("local"), (req, res) => {
  res.send("success");
});

app.get("/logout", (req, res) => {
  req.logout();
  res.send("success");
});

mongoose.connect(
  `${process.env.MDB_CONNECT}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) return console.error(err);
    console.log("Connected to MongoDB");
  }
);

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
