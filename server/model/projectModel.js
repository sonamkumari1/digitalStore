import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    thumbnail: { type: String },
    description: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Web Development",
        "Mobile Apps",
        "AI Projects",
        "Game Development",
        "Data Science",
        "Blockchain",
        "Other",
      ],
    },
    level: {
      type: String,
      required: true,
      enum: ["Beginner", "Medium", "Advanced"],
    },
    video: { type: String },
    price: { type: Number },
    discountPercentage: { type: Number },
    status: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    rating: { type: Number, default: 0 },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        rating: {
          type: Number,
          required: true,
          min: 1,
          max: 5,
        },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ], // Reviews array
    isCompleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Project = mongoose.model("Project", projectSchema);
export default Project;
