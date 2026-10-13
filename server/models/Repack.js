import mongoose from 'mongoose';

const repackSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    originalSize: {
      type: String,
      required: true,
    },
    repackSize: {
      type: String,
      required: true,
    },
    genres: [
      {
        type: String,
        trim: true,
      },
    ],
    developer: {
      type: String,
      required: true,
    },
    publisher: {
      type: String,
      required: true,
    },
    releaseDate: {
      type: Date,
      required: true,
    },
    features: [
      {
        type: String,
      },
    ],
    requirements: {
      minimum: {
        type: String,
      },
      recommended: {
        type: String,
      },
    },
    downloadLinks: [
      {
        name: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    screenshots: [
      {
        type: String,
      },
    ],
    description: {
      type: String,
    },
    coverImage: {
      type: String,
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Repack = mongoose.model('Repack', repackSchema);
export default Repack;
