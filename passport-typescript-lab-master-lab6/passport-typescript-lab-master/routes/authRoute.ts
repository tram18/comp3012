import express from "express";
import passport from "passport";
import { forwardAuthenticated } from "../middleware/checkAuth";

const router = express.Router();

router.get("/login", forwardAuthenticated, (req, res) => {
  const messages = req.session.messages || []; // get the message
  req.session.messages = []; // clear message after retrieving
  res.render("login", { messages });
});

router.post(
  "/login",
  passport.authenticate("local", {
    //LocalStrategy
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureMessage: true,
    /* 9.FIX ME: 😭 failureMsg needed when login fails */
  })
);

// initiates the GitHub OAuth flow
router.get(
  "/githubLogin",
  (req, res, next) => {
    console.log("Starting GitHub OAuth flow...");
    next();
  },
  passport.authenticate("github", {
    scope: ["user:email"],
  })
);

router.get(
  "/github/callback",
  (req, res, next) => {
    console.log("GitHub callback hit!");
    console.log("Query params:", req.query);
    next();
  },
  passport.authenticate("github", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
    failureMessage: true,
  })
);

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) console.log(err);
  });
  res.redirect("/auth/login");
});

export default router;
