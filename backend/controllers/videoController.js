import Video from '../models/Video.js';
import Channel from '../models/Channel.js';

// @desc    Get all videos with optional category filters or search queries
// @route   GET /api/videos
export const getAllVideos = async (req, res) => {
  try {
    const { category, search } = req.query;
    let queryFilter = {};

    // 1. Apply category filtering if a selector tag is passed from the frontend ribbon
    if (category && category !== 'All') {
      queryFilter.category = category;
    }

    // 2. Apply text search query validation using regex for structural match matches
    if (search) {
      queryFilter.title = { $regex: search, $options: 'i' }; // 'i' flag ignores upper/lowercase letters
    }

    // Fetch and populate relevant channel reference data
    const videos = await Video.find(queryFilter).populate('channelId', 'channelName channelBanner subscribers');
    return res.status(200).json(videos);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching videos collection', error: error.message });
  }
};

// @desc    Get a single video profile and increment view counter automatically
// @route   GET /api/videos/:id
export const getVideoById = async (req, res) => {
  try {
    // Locate the video item and increment its views count by exactly 1 atomially
    const video = await Video.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('channelId', 'channelName channelBanner subscribers owner');

    if (!video) {
      return res.status(404).json({ message: 'Video record not found' });
    }

    return res.status(200).json(video);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving single video entry', error: error.message });
  }
};

// @desc    Upload / Register a new video link into the system database
// @route   POST /api/videos
// @access  Private (Requires JWT token authentication check)
export const createVideo = async (req, res) => {
  const { title, videoUrl, thumbnailUrl, description, category, channelId } = req.body;

  try {
    if (!title || !videoUrl || !thumbnailUrl || !category || !channelId) {
      return res.status(400).json({ message: 'Missing required validation fields for video object' });
    }

    // Confirm that the channel exists and matches the user attempting the upload
    const channel = await Channel.findById(channelId);
    if (!channel) {
      return res.status(404).json({ message: 'Target studio channel context not found' });
    }

    if (channel.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Unauthorised: You do not own this studio channel profile' });
    }

    // Save video into DB mapping both uploader and context identifiers
    const newVideo = await Video.create({
      title,
      videoUrl,
      thumbnailUrl,
      description,
      category,
      channelId,
      uploader: req.user._id,
    });

    // Append video ID reference directly into target channel schema registry array
    channel.videos.push(newVideo._id);
    await channel.save();

    return res.status(201).json(newVideo);
  } catch (error) {
    return res.status(500).json({ message: 'Error processing server video post data', error: error.message });
  }
};

// @desc    Toggle upvote interactions on video profiles
// @route   PUT /api/videos/:id/like
// @access  Private
export const likeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video target not found' });

    const userId = req.user._id;

    // Check if user has already liked this video item
    if (video.likes.includes(userId)) {
      video.likes = video.likes.filter((id) => id.toString() !== userId.toString());
    } else {
      video.likes.push(userId);
      // Remove user from dislike track listing automatically on reverse flip actions
      video.dislikes = video.dislikes.filter((id) => id.toString() !== userId.toString());
    }

    await video.save();
    return res.status(200).json({ likesCount: video.likes.length, dislikesCount: video.dislikes.length });
  } catch (error) {
    return res.status(500).json({ message: 'Like operation crashed', error: error.message });
  }
};

// @desc    Toggle downvote interactions on video profiles
// @route   PUT /api/videos/:id/dislike
// @access  Private
export const dislikeVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video item target not found' });

    const userId = req.user._id;

    if (video.dislikes.includes(userId)) {
      video.dislikes = video.dislikes.filter((id) => id.toString() !== userId.toString());
    } else {
      video.dislikes.push(userId);
      video.likes = video.likes.filter((id) => id.toString() !== userId.toString());
    }

    await video.save();
    return res.status(200).json({ likesCount: video.likes.length, dislikesCount: video.dislikes.length });
  } catch (error) {
    return res.status(500).json({ message: 'Dislike operation crashed', error: error.message });
  }
};
