import mongoose from "mongoose";

const skillSchema = new mongoose.Schema({
  title: String,
  proficiency: String,
  svg: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
});
export const Skill = mongoose.model("Skill", skillSchema);
