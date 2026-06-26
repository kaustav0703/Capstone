import React from 'react';
import { Link } from 'react-router-dom';

const VideoCard = ({ video }) => {
  const { _id, title, thumbnailUrl, views, createdAt, channelId } = video;

  // Helper calculation formatter to show simple view metrics
  const formatViewsCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M views`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K views`;
    return `${count} views`;
  };

  // Helper date utility to track upload timelines
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) return 'Just now';
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  return (
    <div className="video-grid-card">
      <Link to={`/video/${_id}`} className="card-thumbnail-wrapper">
        <img src={thumbnailUrl} alt={title} className="video-card-img" />
      </Link>
      
      <div className="video-card-details">
        {channelId && (
          <Link to={`/channel/${channelId._id}`} className="card-channel-avatar-link">
            <img 
              src={channelId.channelBanner || 'https://example.com'} 
              alt={channelId.channelName} 
              className="card-channel-avatar-img" 
            />
          </Link>
        )}
        
        <div className="card-metadata-block">
          <Link to={`/video/${_id}`} className="card-video-title-link">
            <h3 className="card-video-title">{title}</h3>
          </Link>
          
          {channelId && (
            <Link to={`/channel/${channelId._id}`} className="card-channel-name-link">
              <span className="card-channel-name">{channelId.channelName}</span>
            </Link>
          )}
          
          <div className="card-metrics-line">
            <span>{formatViewsCount(views)}</span>
            <span className="metrics-bullet">•</span>
            <span>{formatRelativeTime(createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
