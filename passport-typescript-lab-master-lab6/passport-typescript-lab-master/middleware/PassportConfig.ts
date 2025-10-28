import passport from "passport";
import { userModel } from "../models/userModel";

import { PassportStrategy } from "../interfaces";

export default class PassportConfig {
  /*
     3.FIX ME 😭
     The problem with this class is... if the caller forgets to call
     the addStrategies method...our program won't work. 

     Solution: You should refactor this class to take a constructor
     which receives strategies: PassportStrategy[]. Internally...call 
     the addStrategies method within the constructor and make addStragies
     private from the outside world. This way, we can GUARANTEE that our
     passport strategies are added when this class is created. ⭐️
    */

  constructor(strategies: PassportStrategy[]) {
    this.addStrategies(strategies);
    this.setupSerialization();
  }

  private addStrategies(strategies: PassportStrategy[]): void {
    strategies.forEach((passportStrategy: PassportStrategy) => {
      passport.use(passportStrategy.name, passportStrategy.strategy);
    });
  }

  private setupSerialization(): void {
    // Store user ID in session
    passport.serializeUser((user: any, done) => {
      console.log("Serializing user:", user.id);
      done(null, user.id);
    });

    // Restore user from session
    passport.deserializeUser(async (id: number, done): Promise<void> => {
      console.log("Deserializing user ID:", id);
      try {
        const user = await userModel.findById(id);
        if (user) {
          console.log("User found:", user.name);
          done(null, user);
        } else {
          done(new Error("User not found"), null);
        }
      } catch (error) {
        console.error("Deserialization error:", error);
        done(error, null);
      }
    });
  }
}
