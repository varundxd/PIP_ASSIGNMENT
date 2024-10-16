import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AcceptFriendRequestButton from './AcceptFriendRequestButton';

const FriendRequests = ({ userId }) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchFriendRequests = async () => {
      try {
        const response = await axios.get(`/api/users/${userId}/friend-requests`);
        setRequests(response.data.friendRequests);
      } catch (error) {
        console.error('Error fetching friend requests:', error);
      }
    };

    fetchFriendRequests();
  }, [userId]);

  return (
    <div>
      <h3>Pending Friend Requests</h3>
      {requests.length === 0 ? (
        <p>No pending requests.</p>
      ) : (
        <ul>
          {requests.map((request) => (
            <li key={request._id}>
              {request.username}
              <AcceptFriendRequestButton userId={userId} senderId={request._id} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FriendRequests;
