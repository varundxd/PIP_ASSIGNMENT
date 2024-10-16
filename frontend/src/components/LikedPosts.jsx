import React, { useEffect, useState } from "react";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Categories from "./Categories";
import { ImHeart } from "react-icons/im";
import API_URL from "../constants";
import BtFooter from "./BtFooter";

function LikedPosts() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [cposts, setCPosts] = useState([]);
  const [search, setSearch] = useState("");
  const [likedPosts, setLikedPosts] = useState([]);
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    const url = API_URL + "/liked-posts";
    let data = { userId: localStorage.getItem("userId") };

    axios
      .post(url, data)
      .then((res) => {
        if (res.data.posts) {
          setPosts(res.data.posts);

          const likedPostIds = res.data.posts.map((post) => post._id);
          setLikedPosts(likedPostIds);
        }
      })
      .catch((err) => {
        alert("Server Err.");
      });
  }, []);

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleClick = () => {
    let filteredPosts = posts.filter((item) => {
      if (
        item.postname.toLowerCase().includes(search.toLowerCase()) ||
        item.postdesc.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase())
      ) {
        return item;
      }
    });
    setCPosts(filteredPosts);
    setIsSearch(true);
  };

  const handleCategory = (value) => {
    let filteredPosts = posts.filter((item) => item.category === value);
    setCPosts(filteredPosts);
    setIsSearch(true);
  };

  const handleLike = (postId) => {
    let userId = localStorage.getItem("userId");

    const url = API_URL + "/like-post";
    const data = { userId, postId };

    axios
      .post(url, data)
      .then((res) => {
        if (res.data.message === "Liked") {
          setLikedPosts([...likedPosts, postId]);
        } else {
          setLikedPosts(likedPosts.filter((id) => id !== postId));
        }
      })
      .catch((err) => {
        alert("Server Err.");
      });
  };

  const handleUnlike = (postId, e) => {
    e.stopPropagation();
    let userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please Login first.");
      return;
    }
    const url = API_URL + "/unlike-post";
    const data = { userId, postId };

    axios
      .post(url, data)
      .then((res) => {
        console.log(res.data);
        if (res.data.message === "Unliked") {
          setLikedPosts(likedPosts.filter((id) => id !== postId));
        } else {
          alert(res.data.message);
          navigate("/");
        }
      })
      .catch((err) => {
        console.error(err);
        alert("Server Err. Failed to unlike the product.");
      });
  };

  const handlePost = (id, e) => {
    if (e.target.tagName.toLowerCase() === "button") {
      e.stopPropagation();
      return;
    }
    navigate("/post/" + id);
  };

  return (
    <div>
      <Header
        search={search}
        handlesearch={handleSearch}
        handleClick={handleClick}
        onPostNestLinkClick={() => setIsSearch(false)}
      />
      <Categories handleCategory={handleCategory} />
      <div className="d-flex justify-content-center flex-wrap">
        {isSearch
          ? cposts.map((item) => (
              <div
                key={item._id}
                className="card shadow-animate m-3"
                onClick={(e) => handlePost(item._id, e)}
              >
                <div className="image-container">
                  <div onClick={(e) => handleUnlike(item._id, e)} className="icon-con">
                    <ImHeart
                      className={`icons${likedPosts.includes(item._id) ? " liked" : ""}`}
                    />
                  </div>
                  <h3 className="pr m-2"> {item.price} </h3>
                  <p className="pr1 m-2"> {item.pname}</p>
                  <p className="pr2 m-2"> {item.pdesc} </p>
                  <Link to={`/category/${item.category}`}>
                    <button className="button-85" role="button">
                      {item.category}
                    </button>
                  </Link>
                </div>
              </div>
            ))
          : posts.map((item) => (
              <div
                key={item._id}
                className="card shadow-animate m-3"
                onClick={(e) => handlePost(item._id, e)}
              >
                <div onClick={(e) => handleUnlike(item._id, e)} className="icon-con">
                  <ImHeart
                    className={`icons${likedPosts.includes(item._id) ? " liked" : ""}`}
                  />
                </div>
                <p className="pr1 m-2"> {item.postname}</p>
                <p className="pr2 m-2"> {item.postdesc} </p>
                <p className="pr2 m-2">
                  <Link to={`/category/${item.category}`}>
                    <button className="button-85" role="button">
                      {item.category}
                    </button>
                  </Link>
                </p>
              </div>
            ))}
      </div>
      <BtFooter />
    </div>
  );
}

export default LikedPosts;
