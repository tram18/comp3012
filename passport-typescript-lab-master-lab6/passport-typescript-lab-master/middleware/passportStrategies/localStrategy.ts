import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  getUserByEmailIdAndPassword,
  getUserById,
} from "../../controllers/userController";
import { PassportStrategy } from "../../interfaces/index";

// const localStrategy = new LocalStrategy(
//   {
//     usernameField: "email",
//     passwordField: "password",
//   },
//   async (email, password, done) => {
//     const user = await getUserByEmailIdAndPassword(email, password);
//     return user
//       ? done(null, user)
//       : done(null, false, {
//           message: "Your login details are not valid. Please try again",
//         });
//   }
// );

const localStrategy = new LocalStrategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async (email, password, done) => {
    try {
      // gọi hàm kiểm tra email và password
      const user = await getUserByEmailIdAndPassword(email, password);

      if (user === null) {
        return done(null, false, { message: "Password is incorrect" });
      }

      if (user === undefined) {
        return done(null, false, {
          message: "Couldn't find user with email: " + email,
        });
      }

      return done(null, user);
    } catch (error) {
      console.error("Error in localStrategy:", (error as Error).message);
      return done(null, false, { message: "Error logging in" });
    }
  }
);

/*
5.FIX ME (types) 😭
*/
passport.serializeUser(function (
  user: any,
  done: (err: any, id?: any) => void
) {
  done(null, user.id);
});

/*
6. FIX ME (types) 😭
*/
passport.deserializeUser(function (
  id: number,
  done: (err: any, id?: any) => void
) {
  let user = getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});

const passportLocalStrategy: PassportStrategy = {
  name: "local",
  strategy: localStrategy,
};

export default passportLocalStrategy;
