import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import localAuth from "../routes/localAuth";
import socialAuth from "../routes/socialAuth";
import passportConfig from "../config/passport";
import { ICustomError } from "./types";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

passportConfig(passport);

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

app.use("/", localAuth);
app.use("/auth", socialAuth);
app.get("/getuser", (req, res) => {
  res.send(req.user);
});

app.use(
  (error: ICustomError, req: Request, res: Response, next: NextFunction) => {
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json({ message: message, data: data });
  }
);

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
