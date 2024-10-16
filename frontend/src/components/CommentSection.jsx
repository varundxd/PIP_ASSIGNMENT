
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import StarRating from './StarRating'; 
import './StarRating.css';

function CommentSection({ pId }) {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [newRating, setNewRating] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('token'); 
  const storedUsername = localStorage.getItem('username');

  useEffect(() => {
    setLoading(true);
    axios.get(`http://localhost:4000/get-comments/${pId}`)
      .then((response) => {
        setComments(response.data.comments || []);
      })
      .catch((error) => {
        console.error('Error fetching comments:', error);
        setError('Error fetching comments. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [pId]);

  const handleAddComment = () => {
    if (!newComment) {
      setError('Please enter a comment before adding.');
      return;
    }

    if (newComment.length > 200) {
      setError('Comment cannot exceed 200 characters.');
      return;
    }

    if (!token || !storedUsername) {
      setError('User not authenticated. Please log in.');
      return;
    }

    setLoading(true);
    axios.post(
      'http://localhost:4000/add-comment',
      { pId, text: newComment, rating: newRating, username: storedUsername },
      { headers: { Authorization: `Bearer ${token}` } }
    )
      .then((response) => {
        const newCommentWithId = { ...response.data.comment, commentId: response.data.comment.commentId };
        setComments([...comments, newCommentWithId]);
        setNewComment('');
        setNewRating(0); 
        setError(null);
      })
      .catch((error) => {
        console.error('Error adding comment:', error);
        setError('Error adding comment. Please try again later.');
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleDeleteComment = (commentId) => {
    if (!token) {
      setError('User not authenticated. Please log in.');
      return;
    }

    setLoading(true);
    axios.post(
      'http://localhost:4000/delete-comment',
      { pId, commentId },
      { headers: { Authorization: `Bearer ${token}` } }
    )
    .then(() => {
        const updatedComments = comments.filter((comment) => comment._id !== commentId);
        setComments(updatedComments);
        setError(null);
    })
    .catch((error) => {
        console.error('Error deleting comment:', error);
        setError('Error deleting comment. Please try again later.');
    })
    .finally(() => {
        setLoading(false);
    });
  };

  return (
    <div className="cmt">
      <div className="comment-section">
        <h4>Comments</h4>
        {error && <div className="error-message" aria-live="polite">{error}</div>}
        {loading ? <p>Loading comments...</p> : (
          <div className="comment-list">
            {comments.length === 0 ? (
              <p>No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div key={comment._id} className="comment">
                  <StarRating
                    commentId={comment._id} 
                    rating={comment.rating}
                    onRatingChange={(commentId, newRating) => {
                      console.log('Rating changed for comment', commentId, ':', newRating);
                    }}
                  />
                  <span className="cmmt">
                    <span className="use">{comment.username}</span>: <span>{comment.text}</span>
                    <button className="button-85" onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                  </span>
                </div>
              ))
            )}
          </div>
        )}
        <div className="add-comment">
          Give Ratings
          <span className="strnew">
            <StarRating
              commentId="newComment" 
              rating={newRating}
              onRatingChange={(commentId, newRating) => setNewRating(newRating)}
            />
          </span>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
          />
          <button className="button-85" onClick={handleAddComment} disabled={loading}>Add Comment</button>
        </div>
      </div>
    </div>
  );
}

export default CommentSection;
