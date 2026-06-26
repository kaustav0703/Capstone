import Channel from '../models/Channel.js';
import User from '../models/User.js';

// @desc    Get a channel profile by its unique ID with populated video entries
// @route   GET /api/channels/:id
export const getChannelById = async (req, res) => {
  try {
    const channel = await Channel.findById(req.params.id)
      .populate('owner', 'username avatar email')
      .populate('videos'); // Automatically populates metadata for all uploaded videos

    if (!channel) {
      return res.status(404).json({ message: 'Channel profile not found' });
    }

    return res.status(200).json(channel);
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching channel profile details', error: error.message });
  }
};

// @desc    Create a new custom channel under an authenticated user profile
// @route   POST /api/channels
// @access  Private (Guarded by JWT Authentication check)
export const createChannel = async (req, res) => {
  const { channelName, description, channelBanner } = req.body;

  try {
    if (!channelName) {
      return res.status(400).json({ message: 'Channel name is required' });
    }

    // Check if the authenticated user has already created a channel profile
    const existingChannel = await Channel.findOne({ owner: req.user._id });
    if (existingChannel) {
      return res.status(400).json({ message: 'User account is already linked to an active creator channel' });
    }

    // Persist new channel profile entity inside database collections
    const newChannel = await Channel.create({
      channelName,
      description: description || '',
      channelBanner: channelBanner || undefined,
      owner: req.user._id
    });

    // Push new channel ID link into user account collection schema references
    await User.findByIdAndUpdate(req.user._id, {
      $push: { channels: newChannel._id }
    });

    return res.status(201).json(newChannel);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to process studio channel creation', error: error.message });
  }
};

// @desc    Get the active user's owned channel context (Dashboard lookup helper)
// @route   GET /api/channels/user/me
// @access  Private
export const getMyChannel = async (req, res) => {
  try {
    const channel = await Channel.findOne({ owner: req.user._id }).populate('videos');
    if (!channel) {
      return res.status(404).json({ message: 'No creator profile channel linked to this user' });
    }
    return res.status(200).json(channel);
  } catch (error) {
    return res.status(500).json({ message: 'Dashboard retrieval error occurred', error: error.message });
  }
};
