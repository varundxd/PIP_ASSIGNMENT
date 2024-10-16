import React, { useState } from 'react';
import axios from 'axios';

const SendFriendRequestButton = ({ senderId, receiverId }) => {
  const [status, setStatus] = useState('');

  const sendRequest = async () => {
    try {
      const response = await axios.post('/api/send-friend-request', {
        senderId,
        receiverId,
      });
      setStatus(response.data.message);
    } catch (error) {
      setStatus(error.response?.data?.message || 'Error sending request.');
    }
  };

  return (
    <div>
      <button onClick={sendRequest}>Send Friend Request</button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default SendFriendRequestButton;
