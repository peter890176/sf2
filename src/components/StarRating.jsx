import React from 'react';
import './StarRating.css';

const Star = ({ filled, half, size }) => (
  <span className="star" style={{ fontSize: `${size}px` }}>
    {half ? (
      <span className="star-half">
        <span className="star-filled">★</span>
        ★
      </span>
    ) : (
      <span className={filled ? 'star-filled' : ''}>★</span>
    )}
  </span>
);

const StarRating = ({ rating, size = 20 }) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  for (let i = 0; i < fullStars; i++) {
    stars.push(<Star key={`full_${i}`} filled size={size} />);
  }

  if (halfStar) {
    stars.push(<Star key="half" half size={size} />);
  }

  for (let i = 0; i < emptyStars; i++) {
    stars.push(<Star key={`empty_${i}`} size={size} />);
  }

  return <div className="star-rating">{stars}</div>;
};

export default StarRating; 