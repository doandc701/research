import { NextFunction, Request, Response } from "express";
const routes = (app: any) => {
  app.get("/", (req: Request, res: Response) => {
    res.json("Wellcome to api");
  });
};
export default routes;
