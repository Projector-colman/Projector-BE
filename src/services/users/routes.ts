import { NextFunction, Request, Response } from "express";
import * as controller from "./controllers/users-data-controller";

export default [
    {
        path: "/users",
        method: "get",
        handler: async (req: Request, res: Response, next: NextFunction) => {
          const username = await controller.getUser(req.query.username);
          res.send(username);
        }
      },
];