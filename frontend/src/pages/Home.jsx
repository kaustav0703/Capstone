import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import FilterGroup from '../components/FilterGroup.jsx';
import VideoCard from '../components/VideoCard.jsx';
import API from '../utils/api.js';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  // Hook into URL search strings forwarded from our Global Header input element
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchQuery = searchParams.get('search') || '';

  useEffect(() => {
    const fetchDiscoveryGridData = async () => {
      setIsLoading(true);
      setFetchError('');
      try {
        // Construct standard URL fetch routes appending selection variables dynamically
        let requestUrl = `/videos?category=${encodeURIComponent(selectedCategory)}`;
        if (searchQuery) {
          requestUrl += `&search=${encodeURIComponent(searchQuery)}`;
        }

        const response = await API.get(requestUrl);
        setVideos(response.data);
      } catch (error) {
        setFetchError('Failed to synchronize streaming feeds. Ensure your server is active.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDiscoveryGridData();
  }, [selectedCategory, searchQuery]);

  return (
    <div className="home-feed-canvas">
      {/* 1. TOP CATEGORY RIBBON LAYOUT SYSTEM */}
      <FilterGroup 
        selectedCategory={selectedCategory} 
        onSelectCategory={setSelectedCategory} 
      />

      {searchQuery && (
        <div className="search-results-indicator">
          Showing matching results for: <strong>"{searchQuery}"</strong>
        </div>
      )}

      {/* 2. MAIN STATE-CONTROLLER DISCOVERY GRID */}
      {isLoading ? (
        <div className="grid-status-message-box">Loading stream indexing...</div>
      ) : fetchError ? (
        <div className="grid-status-message-box status-error">{fetchError}</div>
      ) : videos.length === 0 ? (
        <div className="grid-status-message-box">No videos found matching your parameters.</div>
      ) : (
        <div className="videos-responsive-matrix-grid">
          {videos.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
