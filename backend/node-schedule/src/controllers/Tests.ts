import { Request, Response } from "express";
import { ObjeTest } from "../models/test";

export async function getTest(req: Request, res: Response) {
  const page = req.query.p || 0;
  const showLimitBooks: number = 3;
  ObjeTest.find({})
    .sort({ name: 1 })
    .limit(showLimitBooks)
    .skip(Number(page) * showLimitBooks)
    .then((blog) => {
      res.status(200).json(blog);
    })
    .catch(() => {
      res.status(500).json({ error: "Could not fetch the documents" });
    });
}

export async function postTest(req: Request, res: Response) {
  console.log(req.body.name);
  const test = new ObjeTest(req.body);
  await test
    .save()
    .then((add) => {
      res.json(add);
    })
    .catch((error) => {
      console.log(error);
      return;
    });
}

export function patchTest(req: Request, res: Response) {
  ObjeTest.findByIdAndUpdate(req.params.id, req.body)
    .then((updated) => {
      res.status(200).json(updated);
    })
    .catch((error) => {
      console.log(error);
    });
}

export async function deleteTest(req: Request, res: Response) {
  await ObjeTest.findByIdAndDelete(req.params.id)
    .then((deleted) => {
      res.status(200).json("Delete Success");
    })
    .catch((error) => {
      console.log(error);
    });
}
