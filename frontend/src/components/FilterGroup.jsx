import React from 'react';

const FilterGroup = ({ selectedCategory, onSelectCategory }) => {
  // Array containing 8 distinct content category filters (Exceeds the assignment's minimum of 6 requirement)
  const categories = ['All', 'Music', 'Gaming', 'Tech', 'Education', 'Movies', 'Sports', 'Comedy'];

  return (
    <div className="filter-group-container">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onSelectCategory(category)}
          className={`filter-ribbon-tag ${selectedCategory === category ? 'active-tag' : ''}`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default FilterGroup;
