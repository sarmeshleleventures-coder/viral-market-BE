import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { config } from "../config/env.js";
import { createUser, findUserByEmail } from "../models/user.model.js";
import {
  saveRefreshToken,
  findRefreshToken,
  deleteRefreshToken,
} from "../models/token.model.js";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const signAccessToken = (user) =>
  jwt.sign({ id: user.id, email: user.email }, config.jwtSecret, {
    expiresIn: config.accessExpiresIn,
  });

// Creates a refresh token, persists it, and returns the token string.
const issueRefreshToken = async (user) => {
  const token = jwt.sign({ id: user.id }, config.refreshSecret, {
    expiresIn: config.refreshExpiresIn,
  });
  const { exp } = jwt.decode(token); // seconds since epoch
  await saveRefreshToken(user.id, token, new Date(exp * 1000));
  return token;
};

// Issues both tokens and returns them.
const issueTokens = async (user) => {
  const accessToken = signAccessToken(user);
  const refreshToken = await issueRefreshToken(user);
  return { accessToken, refreshToken };
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({ error: "name, email and password are required" });
    }
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters" });
    }

    const existing = await findUserByEmail(email.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await createUser({
      name,
      email: email.toLowerCase(),
      password: hashed,
    });

    const tokens = await issueTokens(user);
    res.status(201).json({ user, ...tokens });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body || {};

    if (!email || !password) {
      return res.status(400).json({ error: "email and password are required" });
    }

    const user = await findUserByEmail(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { password: _pw, ...safeUser } = user;
    const tokens = await issueTokens(safeUser);
    res.json({ user: safeUser, ...tokens });
  } catch (err) {
    next(err);
  }
};

// Exchange a valid refresh token for a new token pair (rotation).
export const refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body || {};
    if (!refreshToken) {
      return res.status(400).json({ error: "refreshToken is required" });
    }

    // Must be valid signature AND still present in DB (not revoked/used).
    let payload;
    try {
      payload = jwt.verify(refreshToken, config.refreshSecret);
    } catch {
      return res.status(401).json({ error: "Invalid or expired refresh token" });
    }

    const stored = await findRefreshToken(refreshToken);
    if (!stored) {
      return res.status(401).json({ error: "Refresh token has been revoked" });
    }

    // Rotate: delete the old one, issue a fresh pair.
    await deleteRefreshToken(refreshToken);
    const tokens = await issueTokens({ id: payload.id, email: payload.email });
    res.json(tokens);
  } catch (err) {
    next(err);
  }
};

// Revoke a refresh token (logout this session).
export const logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body || {};
    if (refreshToken) {
      await deleteRefreshToken(refreshToken);
    }
    res.json({ message: "Logged out" });
  } catch (err) {
    next(err);
  }
};
