import mongoose from "mongoose";

const softwareApplicationSchema = new mongoose.Schema(
  {
    name: String,
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
  },
  { timestamps: true }
);

export const SoftwareApplication = mongoose.model(
  "SoftwareApplication",
  softwareApplicationSchema
);
