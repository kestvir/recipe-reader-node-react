import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import User from "../models/user";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import async from "async";
import nodemailer from "nodemailer";
import { ICustomError, IMongoDBUser } from "../src/types";
import { validationResult, Result, ValidationError } from "express-validator";
import {
  signupValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
} from "../validators/auth";

const router = express.Router();

const checkValidationErrors = (errors: Result<ValidationError>) => {
  if (!errors.isEmpty()) {
    const error: ICustomError = new Error("Validation failed.");
    error.statusCode = 422;
    error.data = errors.array();
    throw error;
  }
};

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
      const error: ICustomError = new Error(
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
        if (!user) {
          const error: ICustomError = new Error(
            "Password reset token in invalid or has been expired."
          );
          error.statusCode = 401;
          throw error;
        } else {
          await user.save();
          res.send("success");
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
            const user: IMongoDBUser = await User.findOne({
              email: req.body.email,
            });
            if (!user) {
              const error: ICustomError = new Error(
                "A user with this email could not be found."
              );
              error.statusCode = 401;
              throw error;
            } else if (!!user.googleId || !!user.facebookId) {
              return res.redirect(process.env.FRONT_END);
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
        (token: string, user: IMongoDBUser) => {
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
      (err: ICustomError) => {
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
