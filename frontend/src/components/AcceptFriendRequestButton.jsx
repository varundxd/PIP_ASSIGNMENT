import React from 'react';
import axios from 'axios';

const AcceptFriendRequestButton = ({ userId, senderId }) => {
  const handleAccept = async () => {
    try {
      const response = await axios.post('/api/accept-friend-request', { userId, senderId });
      if (response.data.success) {
        alert('Friend request accepted!');
        // Optionally, refresh or update the state of the parent component
      }
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  return (
    <button onClick={handleAccept}>
      Accept Friend Request
    </button>
  );
};

export default AcceptFriendRequestButton;
