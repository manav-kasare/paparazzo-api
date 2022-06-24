import { NextFunction, Request, Response } from "express";

export type IConfig = {
  PORT: string;
  JWT_SECRET: string;
  MONGO_URL: string;
  GMAIL_USERNAME: string;
  GMAIL_PASS: string;
};

export type IUser = {
  id: string;
  username: string;
  avatar: string;
  email: string;
  followers: number;
  following: number;
  friends: number;
  verified: boolean;
  isPrivate?: boolean;
};

export type IPost = {
  id: string;
  user: {
    id: string;
    username: string;
    avatar: string;
  };
  image: string;
  caption?: string;
  postedBy: {
    id: string;
    username: string;
  };
};

export type IControllerArgs = {
  (
    req: Request<any, any, any, any, Record<string, any>> | any,
    res: Response<any, any>,
    next?: NextFunction
  ): any;
};
