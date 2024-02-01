import { Router } from "express";
import verifyJWT from "../middlewares/auth.middleware.js";
import {
  addNote,
  deleteNote,
  myNotes,
  findNote,
} from "../controllers/notes.controllers.js";

const noteRoute = Router();

noteRoute.route("/addNote").post(verifyJWT, addNote);
noteRoute.route("/myNotes/:page").get(verifyJWT, myNotes);
noteRoute.route("/deleteNote/:id").delete(verifyJWT, deleteNote);
noteRoute.route("/matchedNotes/:term").get(verifyJWT, findNote);

export default noteRoute;
