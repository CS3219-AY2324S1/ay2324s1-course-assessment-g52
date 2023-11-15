import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  questionId: {
    type: Number,
    required: true,
    unique: true,
  },
  questionTitle: {
    type: String,
    required: true,
  },
  questionCategories: [
    {
      type: String,
      required: true,
    },
  ],
  questionComplexity: {
    type: String,
    required: true,
  },
  questionDescription: {
    type: String,
    required: true,
  },
});

export default mongoose.model("Questions", questionSchema);