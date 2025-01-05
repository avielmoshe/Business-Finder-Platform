import mongoose from "mongoose";

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  reviews: [
    {
      userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      comment: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  location: {
    type: [String],
    enum: [
      "North",
      "Central",
      "South",
      "Jerusalem and Surroundings",
      "Negev",
      "Shfela (Lowland)",
      "Sharon",
      "Coastal Plain",
      "Golan Heights",
      "Galilee",
    ],
    required: true,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default mongoose.model("Business", businessSchema);
