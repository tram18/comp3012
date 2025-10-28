import express, { Request, Response } from "express";
import { ensureAdmin } from "../middleware/checkAuth";
import { userModel } from "../models/userModel";

const router = express.Router();

// display admin dashboard
// shows all active sessions to the admin
router.get("/admin", ensureAdmin, (req: Request, res: Response) => {
  const sessionStore = req.sessionStore as any;

  sessionStore.all((err: any, sessions: any) => {
    if (err) {
      console.error("Error fetching sessions:", err);
      return res.status(500).send("Error fetching sessions");
    }

    // get session ID and user ID
    const activeSessions = Object.keys(sessions || {}).map((sessionId) => {
      const sessionData = sessions[sessionId];
      const userId = sessionData?.passport?.user;

      return {
        sessionId,
        userId: userId || "Not logged in",
      };
    });

    res.render("admin", {
      user: req.user,
      sessions: activeSessions,
    });
  });
});

// Revoke session
router.post(
  "/admin/revoke/:sessionId",
  ensureAdmin,
  (req: Request, res: Response) => {
    const sessionIdToRevoke = req.params.sessionId;
    const sessionStore = req.sessionStore as any;

    sessionStore.destroy(sessionIdToRevoke, (err: any) => {
      if (err) {
        console.error("Error revoking session:", err);
        return res.status(500).send("Failed to revoke session");
      }

      console.log(`Session revoked: ${sessionIdToRevoke}`);
      res.redirect("/admin");
    });
  }
);
export default router;
