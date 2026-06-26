import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Video title is required'],
      trim: true,
    },
    videoUrl: {
      type: String,
      required: [true, 'Video URL link is required'], // Outlined on Page 11
    },
    thumbnailUrl: {
      type: String,
      required: [true, 'Thumbnail URL is required'],
    },
    description: {
      type: String,
      default: '',
    },
    channelId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Channel',
      required: true,
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    views: {
      type: Number,
      default: 0,
    },
    category: {
      type: String,
      required: [true, 'Category is required for filtering systems'], // Supports Page 11 Requirements
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    dislikes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
  { timestamps: true }
);

const Video = mongoose.model('Video', videoSchema);
export default Video;
