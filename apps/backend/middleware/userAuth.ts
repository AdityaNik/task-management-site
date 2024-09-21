import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import { NextFunction, Request, Response } from "express";
import { UserInput } from "../utils/utils";
import { error } from "console";

export const generateJWT = (user: UserInput) => {
  let userName = { username: user.username };
  if (process.env.SECRET) {
    // Sign the JWT token with the username and a 1-hour expiration
    return jwt.sign(userName, process.env.SECRET, { expiresIn: "1h" });
  } else {
    // Handle case where SECRET is not defined
    return error('Something Broke');
  }
}

export const USERAUTHENTICATION = (req: Request, res: Response, next: NextFunction) => {
  let jwtToken = req.headers.authorization;
  // Check if the authorization header is present
  if (!jwtToken) {
    return res.status(403);
  }

  let token = jwtToken.split(' ');
  if (token && process.env.SECRET) {
    // Use jwt.verify to validate the token
    jwt.verify(token[1], process.env.SECRET, (err, original) => {
      if (err) {
        return res.status(403);
      }
      if (!original) {
        return res.sendStatus(403);
      }
      // Ensure the decoded token is not a string (it should be an object)
      if (typeof original === 'string') {
        return res.status(403);
      }
      // Attach the username to the request headers for further processing
      req.headers['user'] = original?.username;
      next(); // Proceed to the next middleware or route handler
    })
  } else {
    res.sendStatus(401)
  }
}
