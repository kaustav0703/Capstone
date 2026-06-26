import React, { useState } from 'react';

const CommentItem = ({ comment, currentUser, onUpdate, onDelete }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.text);

  // --- 1. SAFELY CONVERT LOGGED-IN USER ID TO STRING ---
  const loggedInUserId = currentUser?._id 
    ? String(currentUser._id) 
    : currentUser?.id 
      ? String(currentUser.id) 
      : null;

  // --- 2. SAFELY CONVERT COMMENT AUTHOR ID TO STRING ---
  const commentAuthorId = comment.userId?._id 
    ? String(comment.userId._id) 
    : comment.userId?.id 
      ? String(comment.userId.id) 
      : comment.userId 
        ? String(comment.userId) 
        : null;

  // --- 3. RUN STRICT CHECK AND PRINT TRACE TO LOGS ---
  const isOwner = loggedInUserId && commentAuthorId && loggedInUserId === commentAuthorId;

  // Safe logs placed correctly *after* the variables are fully initialized
  console.log("COMMENT OWNER SYNC READOUT:", {
    matchingMatchResult: isOwner,
    currentActiveUserKey: loggedInUserId,
    commentAuthorKey: commentAuthorId
  });

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editText.trim() && editText !== comment.text) {
      onUpdate(comment._id, editText.trim());
    }
    setIsEditing(false);
  };

  return (
    <div className="single-comment-card" style={{ display: 'flex', gap: '16px', margin: '16px 0' }}>
      <img 
        src={comment.userId?.avatar || 'https://unsplash.com'} 
        alt="User Avatar" 
        className="comment-author-avatar" 
        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }}
      />
      
      <div className="comment-body-wrapper" style={{ flex: 1 }}>
        <div className="comment-meta-row" style={{ fontSize: '13px', color: '#606060', marginBottom: '4px' }}>
          <span className="comment-author-name" style={{ fontWeight: '500', color: '#030303', marginRight: '8px' }}>
            {comment.userId?.username || 'ViewTube User'}
          </span>
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
              style={{ width: '100%', padding: '6px 10px', border: '1px solid #ccc', borderRadius: '4px', outline: 'none' }}
              required
            />
            <div className="comment-edit-actions-row" style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '6px' }}>
              <button type="button" onClick={() => setIsEditing(false)} className="comment-cancel-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                Cancel
              </button>
              <button type="submit" className="comment-save-btn" style={{ backgroundColor: '#065fd4', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '18px', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
                Save
              </button>
            </div>
          </form>
        ) : (
          <p className="comment-display-text" style={{ margin: '4px 0', fontSize: '14px', color: '#030303', lineHeight: '20px' }}>
            {comment.text}
          </p>
        )}

        {/* CONDITIONAL ACTION BUTTONS RENDERING */}
        {isOwner && !isEditing && (
          <div className="comment-owner-management-row" style={{ display: 'flex', gap: '12px', marginTop: '6px' }}>
            <button 
              onClick={() => setIsEditing(true)} 
              className="comment-action-link-btn btn-edit"
              style={{ background: 'none', border: 'none', padding: 0, fontSize: '12px', fontWeight: '500', color: '#606060', cursor: 'pointer' }}
            >
              Edit
            </button>
            <button 
              onClick={() => onDelete(comment._id)} 
              className="comment-action-link-btn btn-delete"
              style={{ background: 'none', border: 'none', padding: 0, fontSize: '12px', fontWeight: '500', color: '#606060', cursor: 'pointer' }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentItem;
