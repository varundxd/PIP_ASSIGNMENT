
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './StarRating.css';

const StarRating = ({ commentId, rating, onRatingChange }) => {
  const [hoverRating, setHoverRating] = useState(0);

  useEffect(() => {
    setHoverRating(0); // Reset hover rating when rating changes
  }, [rating]);

  const handleStarClick = (clickedIndex) => {
    console.log('Star clicked for comment', commentId, ':', clickedIndex);
    onRatingChange(commentId, clickedIndex); // Pass commentId and clickedIndex to parent
  };

  const stars = Array.from({ length: 5 }, (_, index) => (
    <span
      key={index}
      className={index < (hoverRating || rating) ? 'star filled' : 'star'}
      role="button"
      tabIndex={0}
      onClick={() => handleStarClick(index + 1)}
      onKeyPress={(e) => e.key === 'Enter' && handleStarClick(index + 1)} // Handle keyboard events
      onMouseEnter={() => setHoverRating(index + 1)}
      onMouseLeave={() => setHoverRating(0)}
    >
      ★
    </span>
  ));

  return <div className="starability-result">{stars}</div>;
};

StarRating.propTypes = {
  commentId: PropTypes.string.isRequired,
  rating: PropTypes.number.isRequired,
  onRatingChange: PropTypes.func.isRequired,
};

export default StarRating;
