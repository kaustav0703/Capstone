import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import CommentItem from "../components/CommentItem.jsx";
import API from "../utils/api.js";

const VideoPlayer = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  // Core tracking states
  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState([]);
  const [newCommentText, setNewCommentText] = useState("");
  const [likesMetrics, setLikesMetrics] = useState({ likes: 0, dislikes: 0 });
  const [pageLoading, setPageLoading] = useState(true);
  const [errorNotice, setErrorNotice] = useState("");

  useEffect(() => {
    const fetchVideoPlayerContextData = async () => {
      setPageLoading(true);
      setErrorNotice("");
      try {
        // 1. Fetch data from video metadata schemas
        const videoResponse = await API.get(`/videos/${id}`);
        setVideo(videoResponse.data);
        setLikesMetrics({
          likes: videoResponse.data.likes?.length || 0,
          dislikes: videoResponse.data.dislikes?.length || 0,
        });

        // 2. Fetch the corresponding comments collection listing array
        const commentsResponse = await API.get(`/comments/${id}`);
        setComments(commentsResponse.data);
      } catch (error) {
        setErrorNotice("Failed to mount video stream target assets.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchVideoPlayerContextData();
  }, [id]);

  // --- CRUD ACTION 1: CREATE A NEW COMMENT ---
  const handleAddCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      const response = await API.post("/comments", {
        videoId: id,
        text: newCommentText.trim(),
      });
      // Append the new comment directly to the top of your state tracker list
      setComments([response.data, ...comments]);
      setNewCommentText(""); 
    } catch (err) {
      alert(
        err.response?.data?.message ||
          "Authentication token signature required to comment."
      );
    }
  };

  // --- CRUD ACTION 2: UPDATE TEXT STRING ---
  const handleUpdateCommentAction = async (commentId, updatedText) => {
    try {
      const response = await API.put(`/comments/${commentId}`, {
        text: updatedText,
      });
      setComments(
        comments.map((c) => (c._id === commentId ? response.data : c))
      );
    } catch (err) {
      alert("Failed to modify target comment text.");
    }
  };

  // --- CRUD ACTION 3: ERASE/DELETE RECORD ---
  const handleDeleteCommentAction = async (commentId) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this comment permanently?"
      )
    )
      return;

    try {
      await API.delete(`/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      alert("Action unauthorized or server failed to process request.");
    }
  };

  // --- INTERACTION HOOK: ENGAGE UPVOTE TOGGLE ---
  const handleLikeToggle = async () => {
    try {
      const response = await API.put(`/videos/${id}/like`);
      setLikesMetrics({
        likes: response.data.likesCount,
        dislikes: response.data.dislikesCount,
      });
    } catch (err) {
      alert("Please log in to register video rating preferences.");
    }
  };

  // --- INTERACTION HOOK: ENGAGE DOWNVOTE TOGGLE ---
  const handleDislikeToggle = async () => {
    try {
      const response = await API.put(`/videos/${id}/dislike`);
      setLikesMetrics({
        likes: response.data.likesCount,
        dislikes: response.data.dislikesCount,
      });
    } catch (err) {
      alert("Please log in to register video rating preferences.");
    }
  };

  if (pageLoading)
    return (
      <div className="player-status-banner">
        Buffering video stream infrastructure...
      </div>
    );
  if (errorNotice)
    return (
      <div className="player-status-banner status-err-box">{errorNotice}</div>
    );
  if (!video)
    return (
      <div className="player-status-banner">
        Video object not found inside system registries.
      </div>
    );

  return (
    <div className="player-workspace-split-grid">
      <div className="player-primary-column">
        {/* 1. ASPECT RATIO DRIVEN VIDEO CANVAS FRAME */}
        <div className="video-player-frame-wrapper">
          <video
            src={video.videoUrl}
            controls
            preload="auto"
            className="html5-video-canvas"
            poster={video.thumbnailUrl}
          />
        </div>

        <h1 className="player-video-headline-title">{video.title}</h1>

        {/* METADATA METRICS AND ENGAGEMENT BAR */}
        <div className="player-engagement-metrics-bar">
          <div className="metrics-left-readout">
            <span>{video.views} views</span>
            <span className="metrics-dot-spacer">•</span>
            <span>{new Date(video.createdAt).toLocaleDateString()}</span>
          </div>

          <div className="engagement-interactive-right-actions">
            <button onClick={handleLikeToggle} className="rating-action-btn">
              👍 <span className="btn-counter-label">{likesMetrics.likes}</span>
            </button>
            <button onClick={handleDislikeToggle} className="rating-action-btn">
              👎{" "}
              <span className="btn-counter-label">{likesMetrics.dislikes}</span>
            </button>
          </div>
        </div>

        <hr className="layout-divider-line" />

        {/* CHANNEL PROFILE CARD BLOCK */}
        {video.channelId && (
          <div className="player-channel-profile-card">
            <Link to={`/channel/${video.channelId._id}`}>
              <img
                src={video.channelId.channelBanner || "https://example.com"}
                alt="Channel Brand"
                className="channel-brand-avatar-img"
              />
            </Link>
            <div className="channel-brand-meta-info">
              <Link
                to={`/channel/${video.channelId._id}`}
                className="channel-brand-anchor-link"
              >
                <h4>{video.channelId.channelName}</h4>
              </Link>
              <p>{video.channelId.subscribers || 0} subscribers</p>
              <p className="video-description-paragraph-text">
                {video.description}
              </p>
            </div>
          </div>
        )}

        <hr className="layout-divider-line" />

        {/* 2. DYNAMIC MERN COMMENT FEED SYSTEM */}
        <div className="video-player-comments-section">
          <h3>{comments.length} Comments</h3>

          {user ? (
            <form
              onSubmit={handleAddCommentSubmit}
              className="add-comment-creation-form"
            >
              <img
                src={user.avatar}
                alt="Active User Avatar"
                className="comment-author-avatar"
              />
              <div className="comment-input-action-wrapper">
                <input
                  type="text"
                  placeholder="Add a public comment..."
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  className="add-comment-text-input-field"
                  required
                />
                <div className="form-submit-actions-panel">
                  {newCommentText.trim() && (
                    <button
                      type="submit"
                      className="comment-post-submit-action-btn"
                    >
                      Comment
                    </button>
                  )}
                </div>
              </div>
            </form>
          ) : (
            <p className="login-prompt-notice-text">
              <Link to="/auth">Sign in</Link> to post or edit comments on this stream asset.
            </p>
          )}

          {/* RENDER DYNAMIC LIST VIA ITERATIVE MAP HOOK */}
          <div className="rendered-comments-timeline-stack">
            {comments.map((comment) => (
              <CommentItem
                key={comment._id}
                comment={comment}
                currentUser={user} // 👈 FIXED: Correct prop name allows CommentItem to see the active user!
                onUpdate={handleUpdateCommentAction}
                onDelete={handleDeleteCommentAction}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
