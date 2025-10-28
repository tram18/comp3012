import { Request, Response, NextFunction } from "express";

/*
1.FIX ME (types) 😭
*/
export const ensureAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/login");
};

/*
2.FIX ME (types) 😭
*/
export const forwardAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  res.redirect("/dashboard");
};

//Admin-only middleware
export const ensureAdmin = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // First check: Is user logged in?
  if (req.isAuthenticated()) {
    const user = req.user as any; // Get the user object from the session

    // Second check: Is user an admin?
    if (user.role === "admin") {
      return next(); // User is admin, allow access
    } else {
      res.redirect("/dashboard");
    }
  } else {
    res.redirect("/auth/login");
  }
};
