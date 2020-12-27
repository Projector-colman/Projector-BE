import { NextFunction, Request, Response } from "express";
import * as controller from "./controllers/users-data-controller";
import { IUser } from '../../db/models/user';

export default [
    {
        path: "/users",
        method: "get",
        handler: async (req: Request, res: Response, next: NextFunction) => {
          const data = 'hello world';
          res.send(data);
        }
      },
];