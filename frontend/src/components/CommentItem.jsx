import React, { useState } from 'react';

const CommentItem = ({ comment, currentUser, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  // Authorization Check: Check if the logged-in user owns this specific comment
  const isOwner = currentUser && currentUser._id === comment.userId?._id;

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editText.trim() && editText !== comment.text) {
      onUpdate(comment._id, editText.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="single-comment-card">
      <img 
        src={comment.userId?.avatar || 'https://example.com'} 
        alt="User Avatar" 
        className="comment-author-avatar" 
      />
      
      <div className="comment-body-wrapper">
        <div className="comment-meta-row">
          <span className="comment-author-name">{comment.userId?.username || 'Anonymous User'}</span>
          <span className="comment-timestamp">
            {new Date(comment.createdAt).toLocaleDateString()}
          </span>
        </div>

        {isEditing ? (
          <form onSubmit={handleSaveEdit} className="comment-edit-form-block">
            <input 
              type="text" 
              value={editText} 
              onChange={(e) => setEditText(e.target.value)} 
              className="comment-inline-edit-input"
              required
            />
            <div className="comment-edit-actions-row">
              <button type="button" onClick={() => setIsEditing(false)} className="comment-cancel-btn">
                Cancel
              </button>
              <button type="submit" className="comment-save-btn">
                Save
              </button>
            </div>
          </form>
        ) : (
          <p className="comment-display-text">{comment.text}</p>
        )}

        {isOwner && !isEditing && (
          <div className="comment-owner-management-row">
            <button onClick={() => setIsEditing(true)} className="comment-action-link-btn btn-edit">
              Edit
            </button>
            <button onClick={() => onDelete(comment._id)} className="comment-action-link-btn btn-delete">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
