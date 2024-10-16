
import { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate, Link, useParams } from "react-router-dom";
import axios from "axios";
import Categories from "./Categories";
import { ImHeart } from "react-icons/im";

import API_URL from "../constants";

import Footer from "./Footer";


function CategoryPage() {
  const navigate = useNavigate();
  const param = useParams();
  console.log(param);

  const [posts, setPosts] = useState([]);
  const [cPosts, setCPosts] = useState([]);
  const [search, setSearch] = useState('');
  const [isSearch, setIsSearch] = useState(false);

  useEffect(() => {
    const url = API_URL + '/get-posts?catName=' + param.catName;
    axios.get(url)
      .then((res) => {
        if (res.data.posts) {
          setPosts(res.data.posts);
        }
      })
      .catch((err) => {
        alert('Server Err.');
      });
  }, [param]);

  const handleSearch = (value) => {
    setSearch(value);
  };

  const handleClick = () => {
    const url = API_URL + '/search?search=' + search ;
    axios.get(url)
      .then((res) => {
        setCPosts(res.data.posts);
        setIsSearch(true);
      })
      .catch((err) => {
        alert('Server Err.');
      });
  };

  const handleCategory = (value) => {
    let filteredPosts = posts.filter((item, index) => {
      if (item.category === value) {
        return item;
      }
    });
    setCPosts(filteredPosts);
  };

  const handleLike = (postId) => {
    let userId = localStorage.getItem('userId');
    const url = API_URL + '/like-post';
    const data = { userId, postId };
    axios.post(url, data)
      .then((res) => {
        if (res.data.message) {
          alert('Liked.');
        }
      })
      .catch((err) => {
        alert('Server Err.');
      });
  };

  const handlePost = (id) => {
    navigate('/post/' + id);
  };


  return (
    <>
    <div>
      <Header search={search} handlesearch={handleSearch} handleClick={handleClick} />
      <Categories handleCategory={handleCategory} />
      
      {isSearch && (
       <div className="d-flex justify-content-center flex-wrap">
       {cPosts && cPosts.length > 0 && cPosts.map((item, index) => (
         <div className="card shadow-animate m-3" onClick={() => handlePost(item._id)} key={item._id}>
             <div onClick={() => handleLike(item._id)} className="icon-con">
               <ImHeart className="icons" />
             </div>
           <p className="pr1 m-2"> {item.postname} <button className="button-85" role="button">{item.category}</button> </p>
           <p className="pr2 m-2"> {item.postdesc} </p>
         </div>
       ))}
     </div>
      )}
{!isSearch && (
  <div className="d-flex justify-content-center flex-wrap">
    {posts && posts.length > 0 && posts.map((item, index) => (
      <div className="card shadow-animate m-3" onClick={() => handlePost(item._id)} key={item._id}>
       
          <div onClick={() => handleLike(item._id)} className="icon-con">
            <ImHeart className="icons" />
                    </div>
                  <span className="pr1"> {item.postname}</span>
                  <p className="pr2 m-2"> {item.postdesc} </p>
                  <div className="ctlp"><Link to={`/category/${item.category}`}><button className="button-85" role="button">{item.category}</button></Link></div>
                  <div className="jok"></div>
      </div>
    ))}
  </div>
)}
    </div>
    <Footer />
    </>
  );
}

export default CategoryPage;
