import { Request, Response } from "express";
import { ObjectId } from "mongodb";
// import { db } from "../index";
import { getTest, postTest, patchTest, deleteTest } from "../controllers/Tests";

export const routes = (app: any) => {
  // routes
  app.get("/", (req: Request, res: Response) => {
    res.json("Wellcome to api");
  });
  // app.get("/books", (req: Request, res: Response) => {
  //   const page = req.query.p || 0;
  //   const showLimitBooks: number = 3;
  //   let books: any[] = [];
  //   //db.collection('books').find() <=> db.books.find()
  //   db.collection("books")
  //     .find()
  //     .sort({ author: 1 })
  //     .skip(Number(page) * showLimitBooks)
  //     .limit(showLimitBooks)
  //     .forEach((book: Object) => books.push(book))
  //     .then(() => {
  //       res.status(200).json(books);
  //     })
  //     .catch(() => {
  //       res.status(500).json({ error: "Could not fetch the documents" });
  //     });
  // });
  // // get one item in collection mongodb
  // app.get("/books/:id", (req: Request, res: Response) => {
  //   // get param :id = req.params.id
  //   if (ObjectId.isValid(req.params.id)) {
  //     db.collection("books")
  //       .findOne({ _id: new ObjectId(req.params.id) })
  //       .then((item: Object) => {
  //         res.status(200).json(item);
  //       })
  //       .catch(() => {
  //         res.status(500).json({ error: "Could not fetch the documents" });
  //       });
  //   } else {
  //     res.json("Not a valid ID");
  //   }
  // });
  // // add one item
  // app.post("/books", (req: Request, res: Response) => {
  //   //  get information body : req.body
  //   const book = req.body;
  //   db.collection("books")
  //     .insertOne(book)
  //     .then((result: Object) => {
  //       res.status(201).json(result);
  //     })
  //     .catch(() => {
  //       res.status(500).json({ error: "Could not post the documents" });
  //     });
  // });
  // // add more than item
  // app.post("/books/addMany", (req: Request, res: Response) => {
  //   //  get information body : req.body
  //   const book = req.body;
  //   db.collection("books")
  //     .insertMany(book)
  //     .then((result: []) => {
  //       res.status(201).json(result);
  //     })
  //     .catch(() => {
  //       res.status(500).json({ error: "Could not post the documents" });
  //     });
  // });
  // // update one item
  // app.patch("/books/:id", (req: Request, res: Response) => {
  //   const reqId = req.params.id;
  //   const updateBody = req.body;
  //   if (ObjectId.isValid(req.params.id)) {
  //     db.collection("books")
  //       .updateOne({ _id: new ObjectId(reqId) }, { $set: updateBody })
  //       .then((updated: Object) => {
  //         res.status(200).json(updated);
  //       })
  //       .catch(() => {
  //         res.status(500).json({ error: "Could not fetch the documents" });
  //       });
  //   } else {
  //     res.json("Not a valid ID");
  //   }
  // });
  // //  delete item
  // app.delete("/books/:id", (req: Request, res: Response) => {
  //   const reqId = req.params.id;
  //   if (ObjectId.isValid(req.params.id)) {
  //     db.collection("books")
  //       .deleteOne({ _id: new ObjectId(reqId) })
  //       .then((deleted: string) => {
  //         res.status(200).json(deleted);
  //       })
  //       .catch(() => {
  //         res.status(500).json({ error: "Could not fetch the documents" });
  //       });
  //   } else {
  //     res.json("Not a valid ID");
  //   }
  // });

  // blog;
  app.get("/test", getTest);
  app.post("/test", postTest);
  app.patch("/test/:id", patchTest);
  app.delete("/test/:id", deleteTest);
};
