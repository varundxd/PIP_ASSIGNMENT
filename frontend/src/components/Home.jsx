import { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { ImHeart } from "react-icons/im";
import API_URL from "../constants";
import Categories from "./Categories";
import Footer from "./Footer";

function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [cPosts, setCPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    const url = `${API_URL}/get-posts`;
    axios.get(url)
      .then((res) => {
        if (res.data.posts) {
          setPosts(res.data.posts);
        }
      })
      .catch(() => {
        alert('Server Error: Could not fetch posts.');
      });
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handlePostNestLinkClick = (value) => {
    setIsSearch(value);
  };

  const handleClick = () => {
    console.log('Clicked on Search Button');
    if (search.trim() === '') {
      setIsSearch(false);
      navigate('/');
      return;
    }
  
    const url = `${API_URL}/search?search=${search}`;
    axios.get(url)
      .then((res) => {
        console.log("Search Results:", res.data.posts);
        setCPosts(res.data.posts);
        setIsSearch(true);
      })
      .catch(() => {
        alert('Server Error: Could not perform search.');
      });
  };

  const handleCategory = (value) => {
    const filteredPosts = posts.filter((item) => item.category === value);
    setCPosts(filteredPosts);
  };

  const handleLike = (postId, e) => {
    e.stopPropagation();
    const userId = localStorage.getItem('userId');

    if (!userId) {
      alert('Please log in first.');
      return;
    }

    const url = `${API_URL}/like-post`;
    const data = { userId, postId };
    axios.post(url, data)
      .then((res) => {
        if (res.data.message) {
          alert('Liked.');
        }
      })
      .catch(() => {
        alert('Server Error: Could not like post.');
      });
  };

  const handlePost = (id, e) => {
    if (e.target.tagName.toLowerCase() === 'button') {
      e.stopPropagation();
      return;
    }
    navigate(`/post/${id}`);
  };

  return (
    <div>
      <Header 
        search={search} 
        handlesearch={handleSearch} 
        handleClick={handleClick} 
        onPostNestLinkClick={handlePostNestLinkClick} 
      />
      <div className="background-container" />
      <div className="content-container">
        <Categories className="cat" handleCategory={handleCategory} />
        <div className="d-flex justify-content-center flex-wrap">
          {(isSearch ? cPosts : posts).length > 0 ? (
            (isSearch ? cPosts : posts).map((item) => (
              <div className="card shadow-animate m-3" onClick={(e) => handlePost(item._id, e)} key={item._id}>
                <div onClick={(e) => handleLike(item._id, e)} className="icon-con">
                  <ImHeart className="icons" />
                </div>
                <span className="pr1">{item.postname}</span>
                <p className="pr2 m-2">{item.postdesc}</p>
                <div className="ctlp">
                  <Link to={`/category/${item.category}`}>
                    <button className="button-85" role="button">{item.category}</button>
                  </Link>
                </div>
                <div className="jok"></div>
              </div>
            ))
          ) : (
            <p>No posts available.</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Home;
