import mongoose from "mongoose";

const messsageSchema = new mongoose.Schema(
  {
    senderName: {
      type: String,
      minLength: [2, "Name must contain at least 2 characters."],
    },
    subject: {
      type: String,
      minLength: [2, "subject must contain at least 2 characters."],
    },
    message: {
      type: String,
      minLength: [2, "message must contain at least 2 characters."],
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messsageSchema);
