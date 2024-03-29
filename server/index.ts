import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import localAuth from "./routes/localAuth";
import socialAuth from "./routes/socialAuth";
import recipes from "./routes/recipes";
import passportConfig from "./config/passport";
import { CustomError } from "./shared/types";
import { ensureAuth } from "./middleware/auth";

dotenv.config();

const PORT = process.env.PORT || 5000;

const app = express();

passportConfig(passport);

app.use(express.json({ limit: "30mb" }));
app.use(
  cors({
    origin: ["http://localhost:3000", process.env.FRONT_END],
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
      sameSite: "none",
      secure: true,
      maxAge: 1000 * 60 * 60 * 24 * 7, // One Week
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use((req: Request, res: Response, next: NextFunction) => {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});
app.use("/", localAuth);
app.use("/auth", socialAuth);
app.get("/getuser", (req, res) => {
  res.send(req.user);
});

app.use(ensureAuth);
app.use("/recipes", recipes);

app.use(
  (error: CustomError, req: Request, res: Response, next: NextFunction) => {
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
    useFindAndModify: false,
  },
  (err) => {
    if (err) return console.error(err);
    console.log("Connected to MongoDB");
  }
);

app.listen(PORT, () => console.log(`Server started on port: ${PORT}`));
