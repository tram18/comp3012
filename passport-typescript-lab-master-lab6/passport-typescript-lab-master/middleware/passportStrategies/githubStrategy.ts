import { Strategy as GitHubStrategy } from "passport-github2";
import { PassportStrategy } from "../../interfaces/index";
import { Request } from "express";
import dotenv from "dotenv";
import { database, userModel } from "../../models/userModel";
dotenv.config();

const githubStrategy: GitHubStrategy = new GitHubStrategy(
  {
    clientID: process.env.GITHUB_CLIENT_ID!,
    clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    callbackURL: process.env.GITHUB_CALLBACK_URL!,
    passReqToCallback: true,
  },

  /* 4.FIX ME 😭 */
  async (
    req: Request,
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: Function
  ) => {
    try {
      console.log("GitHub profile:", profile);
      let user = database.find((u) => u.githubId === profile.id);

      if (!user) {
        user = {
          id: database.length + 1,
          name: profile.displayName || profile.username,
          email: profile.emails?.[0]?.value,
          githubId: profile.id,
          avatar: profile.photos?.[0]?.value,
          profileUrl: profile.profileUrl,
          provider: "github",
          role: "user",
        };
        database.push(user);
      }
      return done(null, user);
    } catch (error) {
      console.error("GitHub strategy error:", error);
      return done(error, null);
    }
  }
);

const passportGitHubStrategy: PassportStrategy = {
  name: "github",
  strategy: githubStrategy,
};

export default passportGitHubStrategy;
