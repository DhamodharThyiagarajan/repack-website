import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    repackId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Repack',
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    username: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
