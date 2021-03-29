import bcrypt from "bcryptjs";
import User from "../models/user";
import { PassportStatic } from "passport";
import { IMongoDBUser, IUserToSend } from "../src/types";

const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

export default (passport: PassportStatic) => {
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
};
