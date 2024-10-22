import mongoose from "mongoose";

const RefreshSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  refreshToken: String,
  fingerprint: String,
});

export default mongoose.model("RefreshSession", RefreshSessionSchema);
