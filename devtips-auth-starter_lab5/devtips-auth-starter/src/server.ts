import express from "express";
import morgan from "morgan";
import session from "express-session";
import { addTip, dislike, getTips, like, remove, findUser } from "./data";

const app = express();
const PORT = 3001;

app.use(
  session({
    secret: "secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

app.set("view engine", "ejs");
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  if (!req.session.userId) {
    return res.redirect("/login");
  }
  const tips = getTips(req.session.userId);
  res.render("index", { tips });
});

app.get("/login", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Login Page</title>
    </head>
    <body>
        <h2>Login</h2>
        <form method="POST" action="/login">
            <div>
                <label>Email:</label>
                <input type="text" name="username" required>
            </div>
            <div">
                <label>Password:</label>
                <input type="password" name="password" required>
            </div>
            <button type="submit">Login</button>
        </form>
    </body>
    </html>
  `);
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = findUser(username, password);
  console.log("found user: ", user);
  if (user) {
    req.session.userId = user.id; // save in session
    res.redirect("/");
  } else {
    console.log("------error login------------");
    res.redirect("/login");
  }
});

app.post("/tips", (req, res) => {
  const { text } = req.body;
  if (text && req.session.userId) {
    addTip(req.session.userId, text);
  }
  res.redirect("/");
});

app.post("/tips/:id/like", (req, res) => {
  const id = req.params.id;
  if (req.session.userId) like(req.session.userId, id);
  res.redirect("/");
});

app.post("/tips/:id/dislike", (req, res) => {
  const id = req.params.id;
  if (req.session.userId) dislike(req.session.userId, id);
  res.redirect("/");
});

app.post("/tips/:id/delete", (req, res) => {
  const id = req.params.id;
  if (req.session.userId) remove(req.session.userId, id);
  res.redirect("/");
});

app.listen(PORT, () => {
  console.log(`
🚀 http://localhost:${PORT}`);
});
