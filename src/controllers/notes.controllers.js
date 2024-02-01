import { Note } from "../models/note.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import ApiError from "../utils/ApiError.js";
import ApiResponse from "../utils/ApiResponse.js";
import { User } from "../models/User.model.js";
import mongoose from "mongoose";

const addNote = asyncHandler(async (req, res) => {
  const { content, title } = req.body;
  if (!(content || title)) {
    throw new ApiError(401, "All fields are required...");
  }

  const owner = await User.findById(req.user._id);

  const addedNote = await Note.create({
    content,
    owner,
    title,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Note Successfully Posted..."));
});

const myNotes = asyncHandler(async (req, res) => {
  const { page } = req.params;
  const notes = await Note.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user._id),
      },
    },
    {
      $skip: (page - 1) * 2,
    },
    {
      $limit: 2, // Number(2)
    },
  ]);

  // const notes = await Note.find({ owner: req.user._id }); use this when need to send all notes

  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Fetched User's all notes"));
});

// write controller for deleting a note
// write controller for finding all notes of similar title
const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const deletedNote = await Note.findByIdAndDelete(id);

  if (!deletedNote) {
    throw new ApiError(401, "Invalid request...");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, {}, "Deleted Successfully..."));
});

const findNote = asyncHandler(async (req, res) => {
  const { term } = req.params;
  // here getting a user all notes of almost similar titles

  const allNotes = await Note.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(req.user._id),
        title: {
          $regex: term,
          $options: "i", // Case-insensitive search
        },
      },
    },
  ]);

  return res.status(200).json(new ApiResponse(200, allNotes, "Fetched..."));
});
export { addNote, myNotes, deleteNote, findNote };
