const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { nanoid } = require("nanoid");
require("dotenv").config();


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: true, credentials: true }));

const PORT = process.env.PORT;
const ISSUER = process.env.ISSUER;
const JWT_SECRET = process.env.JWT_SECRET; 
const SSO_COOKIE = process.env.SSO_COOKIE;

const USERS = [{ id: "u1", email: "demo@company.com", password: "123456" }];

const CLIENTS = {
 "project-x": ["http://localhost:3000/sso/callback"],
  "project-a": ["http://localhost:3001/sso/callback"],
};

const PRODUCTS = [
  { code: "ASTRON_FIN", name: "Astron Financial (Project A)" },
];

const PLANS = [
  { id: "starter", name: "Starter", price: 499, products: ["ASTRON_FIN"] },
  { id: "growth", name: "Growth", price: 999, products: ["ASTRON_FIN"] },
];


const subscriptions = new Map();
const sessions = new Map(); 
const codes = new Map(); 


app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const user = USERS.find((u) => u.email === email && u.password === password);
  if (!user) return res.status(401).json({ message: "Invalid login" });

  const sid = nanoid(24);
  sessions.set(sid, user.id);

  res.cookie(SSO_COOKIE, sid, {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
    path: "/",
  });

  res.json({ message: "SSO Login OK" });
});


app.get("/authorize", (req, res) => {
  const { client_id, redirect_uri, state } = req.query;

  if (!CLIENTS[client_id]) return res.status(400).send("Unknown client");
  if (!CLIENTS[client_id].includes(redirect_uri)) return res.status(400).send("Invalid redirect_uri");

  const sid = req.cookies[SSO_COOKIE];
  const userId = sid ? sessions.get(sid) : null;
  if (!userId) return res.status(401).send("Not logged in at SSO. Call POST /login.");

  const code = nanoid(24);
  codes.set(code, {
    userId,
    client_id,
    redirect_uri,
    exp: Date.now() + 60 * 1000, 
  });

  const url = new URL(redirect_uri);
  url.searchParams.set("code", code);
  if (state) url.searchParams.set("state", state);

  res.redirect(url.toString());
});


app.post("/token", (req, res) => {
  const { code, client_id, redirect_uri } = req.body;

  const data = codes.get(code);
  if (!data) return res.status(400).json({ message: "Invalid code" });
  if (data.exp < Date.now()) return res.status(400).json({ message: "Code expired" });
  if (data.client_id !== client_id) return res.status(400).json({ message: "Client mismatch" });
  if (data.redirect_uri !== redirect_uri) return res.status(400).json({ message: "Redirect mismatch" });

  codes.delete(code);

  const accessToken = jwt.sign(
    { sub: data.userId, aud: client_id, iss: ISSUER },
    JWT_SECRET,
    { expiresIn: "15m" }
  );

  res.json({ access_token: accessToken, token_type: "Bearer", expires_in: 900 });
});

app.get("/plans", (req, res) => {
  res.json({ plans: PLANS, products: PRODUCTS });
});

app.post("/subscribe", (req, res) => {
  const { userId, planId, months = 1 } = req.body;
  const plan = PLANS.find(p => p.id === planId);
  if (!plan) return res.status(400).json({ message: "Invalid plan" });

    const validTill = new Date(Date.now() + 5 * 60 * 1000);

  subscriptions.set(userId, {
    planId,
    status: "ACTIVE",
    validTill: validTill.toISOString(),
    products: plan.products
  });

  res.json({ message: "Subscription activated", userId, planId, validTill });
});

app.get("/entitlements/:userId", (req, res) => {
  const { userId } = req.params;
  const sub = subscriptions.get(userId);

  if (!sub) return res.json({ status: "NONE", products: [] });

  const active = sub.status === "ACTIVE" && new Date(sub.validTill) > new Date();

  res.json({
    status: active ? "ACTIVE" : "EXPIRED",
    products: active ? sub.products : [],
    validTill: sub.validTill,
    planId: sub.planId
  });
});

app.listen(PORT, () => console.log(`Auth server running on :${PORT}`));
