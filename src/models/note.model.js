import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    title: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Note = mongoose.model("Note", noteSchema);
