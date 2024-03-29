import express, { Request, Response, NextFunction } from "express";
import passport from "passport";
import User from "../models/user";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import async from "async";
import nodemailer from "nodemailer";
import { CustomError, MongoDBUser } from "../shared/types";
import { validationResult } from "express-validator";
import {
  signupValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from "../validators/auth";
import { checkValidationErrors } from "../utils/errorUtils";

const router = express.Router();

router.post(
  "/signup",
  signupValidator,
  (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req?.body;

    const errors = validationResult(req);

    checkValidationErrors(errors);

    (async () => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
          email,
          password: hashedPassword,
        });
        await newUser.save();
        req.login(newUser, (err) => {
          if (err) {
            return next(err);
          } else {
            res.send("success");
          }
        });
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
    })();
  }
);

router.post("/login", passport.authenticate("local"), (_, res) => {
  res.send("success");
});

router.get("/logout", (req, res) => {
  req.logout();
  res.send("success");
});

router.get("/resetpassword/:token", async (req, res, next) => {
  try {
    const user = await User.findOne({
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) {
      const error: CustomError = new Error(
        "Password reset token in invalid or has been expired."
      );
      error.statusCode = 401;
      throw error;
    } else {
      res.send("success");
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
});

router.post(
  "/resetpassword/:token",
  resetPasswordValidator,
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    checkValidationErrors(errors);

    (async () => {
      try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.findOneAndUpdate(
          {
            resetPasswordToken: req.params.token,
            resetPasswordExpires: { $gt: Date.now() },
          },
          {
            resetPasswordToken: undefined,
            resetPasswordExpires: undefined,
            password: hashedPassword,
          }
        );
        await user.save();
        res.send("success");
        if (!user) {
          const error: CustomError = new Error(
            "Password reset token in invalid or has been expired."
          );
          error.statusCode = 401;
          throw error;
        }
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err);
      }
    })();
  }
);

router.post(
  "/forgotpassword",
  forgotPasswordValidator,
  (req: Request, res: Response, next: NextFunction) => {
    async.waterfall(
      [
        (done: any) => {
          crypto.randomBytes(20, (err, buf) => {
            let token = buf.toString("hex");
            done(err, token);
          });
        },
        async (token: string, done: any) => {
          try {
            const user: MongoDBUser = await User.findOne({
              email: req.body.email,
              googleId: { $exists: false },
              facebookId: { $exists: false },
            });
            if (!user) {
              const error: CustomError = new Error(
                "A user with this email could not be found."
              );
              error.statusCode = 401;
              throw error;
            }
            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + 1800000; //   1/2 hours
            user.save((err) => {
              done(err, token, user);
            });
          } catch (err) {
            if (!err.statusCode) {
              err.statusCode = 500;
            }
            next(err);
          }
        },
        (token: string, user: MongoDBUser) => {
          let smtpTransport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
              user: process.env.GMAIL_EMAIL,
              pass: process.env.GMAIL_PASSWORD,
            },
          });

          let mailOptions = {
            to: user.email,
            from: "Kęstutis Virbickas kestutis.virbickas@gmail.com",
            subject: "Recovery Email from Recipe reader",
            text:
              "Please click the following link to recover your passoword: \n\n" +
              process.env.FRONT_END +
              "/resetpassword/" +
              token +
              "\n\n" +
              "If you did not request this, please ignore this email.",
          };
          smtpTransport.sendMail(mailOptions, (err) => {
            res.send("Email sent successfully!");
            if (err) next(err);
          });
        },
      ],
      (err: CustomError) => {
        if (err)
          if (!err.statusCode) {
            err.statusCode = 500;
          }
        next(err);
      }
    );
  }
);

export default router;
