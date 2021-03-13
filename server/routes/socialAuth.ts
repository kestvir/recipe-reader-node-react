import express from "express";
import passport from "passport";
const router = express.Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/login",
    session: true,
  }),
  (_, res) => {
    res.redirect(process.env.FRONT_END);
  }
);

router.get(
  "/facebook",
  passport.authenticate("facebook", { scope: ["public_profile", "email"] })
);

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", {
    failureRedirect: "/login",
    session: true,
  }),
  (_, res) => {
    res.redirect(process.env.FRONT_END);
  }
);

export default router;
