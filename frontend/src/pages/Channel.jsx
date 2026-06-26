import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import VideoCard from '../components/VideoCard.jsx';
import API from '../utils/api.js';

const Channel = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorText, setErrorText] = useState('');

  const [newChannelName, setNewChannelName] = useState('');
  const [newChannelDesc, setNewChannelDesc] = useState('');
  const [newChannelBanner, setNewChannelBanner] = useState('');

  // Video publishing form bindings
  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [videoThumb, setVideoThumb] = useState('');
  const [videoCategory, setVideoCategory] = useState('Tech');
  const [videoDesc, setVideoDesc] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const isStudioOwner = user && user._id === id;

  const fetchChannelData = async () => {
    setLoading(true);
    setErrorText('');
    try {
      const response = await API.get(`/channels/${id}`);
      setChannel(response.data);
    } catch (err) {
      if (err.response?.status === 404 && isStudioOwner) {
        setChannel(null);
      } else {
        setErrorText('Failed to pull channel information from the server.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChannelData();
  }, [id, user]);

  const handleCreateChannelSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post('/channels', {
        channelName: newChannelName.trim(),
        description: newChannelDesc.trim(),
        channelBanner: newChannelBanner.trim() || undefined
      });
      fetchChannelData();
    } catch (err) {
      alert(err.response?.data?.message || 'Error processing channel creation.');
    }
  };

  // Handler to publish a new video listing item
  const handlePublishVideoSubmit = async (e) => {
    e.preventDefault();
    if (!videoTitle || !videoUrl || !videoThumb) return alert('Please satisfy all required fields.');
    setIsUploading(true);

    try {
      const response = await API.post('/videos', {
        title: videoTitle.trim(),
        videoUrl: videoUrl.trim(),
        thumbnailUrl: videoThumb.trim(),
        category: videoCategory,
        description: videoDesc.trim(),
        channelId: channel._id
      });

      alert('Video content added successfully!');
      
      // Inject new video directly into state to update layout reactively
      setChannel({
        ...channel,
        videos: [response.data, ...channel.videos]
      });

      // Clear input fields
      setVideoTitle('');
      setVideoUrl('');
      setVideoThumb('');
      setVideoDesc('');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to publish video.');
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) return <div className="studio-status-box">Syncing studio controls...</div>;
  if (errorText) return <div className="studio-status-box status-error-text">{errorText}</div>;

  if (!channel) {
    return (
      <div className="studio-wizard-canvas">
        <div className="wizard-form-card">
          <h3>🚀 Welcome to ViewTube Studio</h3>
          <p>Initialize your creator profile identity to start uploading video assets.</p>
          <form onSubmit={handleCreateChannelSubmit} className="wizard-setup-inputs-form">
            <div className="studio-input-block">
              <label>Channel Name *</label>
              <input 
                type="text" 
                value={newChannelName} 
                onChange={(e) => setNewChannelName(e.target.value)}
                placeholder="e.g. My Coding Channel" 
                required 
              />
            </div>
            <div className="studio-input-block">
              <label>About Description</label>
              <textarea 
                value={newChannelDesc} 
                onChange={(e) => setNewChannelDesc(e.target.value)}
                placeholder="What do you upload?" 
              />
            </div>
            <button type="submit" className="studio-primary-action-btn">Launch Channel</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="creator-studio-dashboard-view">
      <div className="studio-banner-hero-brand-block">
        <img 
          src={channel.channelBanner || 'https://unsplash.com'} 
          alt="Channel Banner" 
          className="studio-hero-wallpaper-img" 
        />
        <div className="studio-profile-branding-row">
          <h2>{channel.channelName}</h2>
          <p>{channel.subscribers || 0} subscribers • {channel.videos?.length || 0} uploads</p>
          <p>{channel.description}</p>
        </div>
      </div>

      <div className="studio-workspace-columns-split">
        <div className="studio-left-catalog-pane">
          <h3>Channel Uploads</h3>
          {channel.videos?.length === 0 ? (
            <p className="empty-catalog-notice">No videos uploaded yet.</p>
          ) : (
            <div className="videos-responsive-matrix-grid">
              {channel.videos.map((video) => (
                <VideoCard key={video._id} video={{...video, channelId: channel}} />
              ))}
            </div>
          )}
        </div>

        {isStudioOwner && (
          <div className="studio-right-upload-control-room">
            <div className="upload-form-sticky-card">
              <h3>Upload Control Room</h3>
              <form onSubmit={handlePublishVideoSubmit} className="upload-management-form-block">
                <div className="studio-input-block">
                  <label>Video Title *</label>
                  <input type="text" value={videoTitle} onChange={(e) => setVideoTitle(e.target.value)} required />
                </div>
                <div className="studio-input-block">
                  <label>Video Asset URL *</label>
                  <input type="url" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} required />
                </div>
                <div className="studio-input-block">
                  <label>Thumbnail URL *</label>
                  <input type="url" value={videoThumb} onChange={(e) => setVideoThumb(e.target.value)} required />
                </div>
                <div className="studio-input-block">
                  <label>Content Category Tag *</label>
                  <select value={videoCategory} onChange={(e) => setVideoCategory(e.target.value)}>
                    <option value="Music">Music</option>
                    <option value="Gaming">Gaming</option>
                    <option value="Tech">Tech</option>
                    <option value="Education">Education</option>
                    <option value="Movies">Movies</option>
                    <option value="Sports">Sports</option>
                    <option value="Comedy">Comedy</option>
                  </select>
                </div>
                <div className="studio-input-block">
                  <label>Stream Description</label>
                  <textarea value={videoDesc} onChange={(e) => setVideoDesc(e.target.value)} rows="3" />
                </div>
                <button type="submit" disabled={isUploading} className="studio-success-action-btn">
                  {isUploading ? 'Publishing...' : 'Publish Video Asset'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Channel;
