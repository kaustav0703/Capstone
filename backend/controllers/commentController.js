import Comment from "../models/Comment.js";

// @desc    Get all comments associated with a specific video entry
// @route   GET /api/comments/:videoId
export const getCommentsByVideo = async (req, res) => {
  try {
    const comments = await Comment.find({ videoId: req.params.videoId })
      .populate("userId", "username avatar") // Populates user profile data to display alongside text
      .sort({ createdAt: -1 }); // Arranges from newest to oldest comment

    return res.status(200).json(comments);
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Error retrieving comment listing",
        error: error.message,
      });
  }
};

// @desc    Add a new text comment down on a video asset entry
// @route   POST /api/comments
// @access  Private (Guarded by JWT Authentication check)
export const addComment = async (req, res) => {
  const { videoId, text } = req.body;

  try {
    if (!videoId || !text || text.trim() === "") {
      return res
        .status(400)
        .json({
          message: "Comment string cannot be blank or missing video context",
        });
    }

    const comment = await Comment.create({
      videoId,
      text,
      userId: req.user._id, // Extracted from our protect verification middleware layer
    });

    // Populate the newly created comment object before feeding back down to user view layers
    const populatedComment = await comment.populate(
      "userId",
      "username avatar",
    );

    return res.status(201).json(populatedComment);
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Failed to process comment upload action",
        error: error.message,
      });
  }
};

// @desc    Modify an existing text comment string matching ownership metrics
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = async (req, res) => {
  const { text } = req.body;

  try {
    if (!text || text.trim() === "") {
      return res
        .status(400)
        .json({ message: "Updated comment text content cannot be blank" });
    }

    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res
        .status(404)
        .json({ message: "Target comment record not found" });
    }

    // --- FIXED: Use comment.userId._id or comment.userId depending on population state ---
    const authorId = comment.userId._id
      ? comment.userId._id.toString()
      : comment.userId.toString();

    if (authorId !== req.user._id.toString()) {
      return res
        .status(403)
        .json({
          message: "Unauthorised: You cannot edit someone else's comment",
        });
    }

    comment.text = text;
    await comment.save();

    const updatedComment = await comment.populate("userId", "username avatar");
    return res.status(200).json(updatedComment);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Failed to update comment data", error: error.message });
  }
};

// @desc    Erase/Drop a target comment context from database storage grids completely
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);

    if (!comment) {
      return res
        .status(404)
        .json({ message: "Target comment entry could not be found" });
    }

    // --- FIXED: Use comment.userId._id or comment.userId depending on population state ---
    const authorId = comment.userId._id
      ? comment.userId._id.toString()
      : comment.userId.toString();

    if (authorId !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Unauthorised: You cannot erase this message" });
    }

    await comment.deleteOne();
    return res
      .status(200)
      .json({ message: "Comment has been deleted successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({
        message: "Server failed to process data erasure query",
        error: error.message,
      });
  }
};
