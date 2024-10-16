import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import API_URL from '../constants';
import CommentSection from './CommentSection';

function PostDetail() {
  const [post, setPost] = useState();
  const [user, setUser] = useState();
  const [showContactDetails, setShowContactDetails] = useState(false);
 

  const pId = useParams();

  useEffect(() => {
    const url = API_URL + '/get-post/' + pId.postId;
   
    axios
      .get(url)
      .then((res) => {
        if (res.data.post) {
          setPost(res.data.post);
        }
      })
      .catch((err) => {
        alert('Server Err.');
      });
  }, [pId.postId]);

//   useEffect(() => {
//     if (showContactDetails && user) {
//       document.body.style.overflow = 'hidden'; // Disable scrolling when contact details are shown
//     } else {
//       document.body.style.overflow = 'auto'; // Enable scrolling when contact details are hidden
//     }
//   }, [showContactDetails, user]);

  const handleContact = (addedBy) => {
    const url = API_URL + '/get-user/' + addedBy;
    axios
      .get(url)
      .then((res) => {
        if (res.data.user) {
          setUser(res.data.user);
          setShowContactDetails((prev) => !prev);
        }
      })
      .catch((err) => {
        alert('Server Err.');
      });
  };

 
  return (
    <>
      <Header />
      <div className="container2">
      <h3 className="prd">POST DETAILS</h3>
      <div className="product-container1">
        {post && (
          <div className="ima">
            <div className="pdes">
              <h6 className="prd"> Post Description : </h6>
              {post.postdesc}
   
            </div>
            <div className="product-details">
              <h3 className="animated-button1 p m-2">
                <span></span>
                <span></span>
                <span></span>
              </h3>
              <div>
                <button className="btn third" onClick={() => handleContact(post.addedBy)}>
                {showContactDetails ? 'Hide Contact Details' : 'Show Contact Details'}
                </button>
                {user && showContactDetails && (
                  <span className="contact-details">
                    <div className="prt">{user.username}</div>
                    {/* <h3 className="button-85">Phone - +{user.mobile}</h3> */}
                    <h6 className="button-85">Email - {user.email}</h6>
                  </span>
                )}
              </div>
              <button className="button-85">
                {post.postname} <span className="c">{post.category}</span>
              </button>
            </div>
          </div>
        )}
      </div>
      <div className="space">
      </div>
      </div>
                  {post && <CommentSection pId={pId.postId} />}
                  <div className="space">
      </div>
     
    </>
  );
}

export default PostDetail;