import { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Categories from "./Categories";
import { FaHeart } from "react-icons/fa";
import API_URL from "../constants";


function MyPosts() {

    const navigate = useNavigate()

    const [posts, setposts] = useState([]);
    const [cposts, setcposts] = useState([]);
    const [search, setsearch] = useState('');

    useEffect(() => {
        const url = API_URL + '/my-posts';
        let data = { userId: localStorage.getItem('userId') }
        axios.post(url, data)
            .then((res) => {
                if (res.data.posts) {
                    setposts(res.data.posts);
                }
            })
            .catch((err) => {
                alert('Server Err.')
            })
    }, [])

    const handlesearch = (value) => {
        setsearch(value);
    }

    const handleClick = () => {
        let filteredPosts = posts.filter((item) => {
            if (item.postname.toLowerCase().includes(search.toLowerCase()) ||
                item.postdesc.toLowerCase().includes(search.toLowerCase()) ||
                item.category.toLowerCase().includes(search.toLowerCase())) {
                return item;
            }
        })
        setcposts(filteredPosts)

    }

    const handleCategory = (value) => {
        let filteredPosts = posts.filter((item, index) => {
            if (item.category == value) {
                return item;
            }
        })
        setcposts(filteredPosts)
    }

    // const handleLike = (productId) => {
    //     let userId = localStorage.getItem('userId');

    //     const url = API_URL + '/like-post';
    //     const data = { userId, postId }
    //     axios.post(url, data)
    //         .then((res) => {
    //             if (res.data.message) {
    //                 alert('Liked.')
    //             }
    //         })
    //         .catch((err) => {
    //             alert('Server Err.')
    //         })

    // }
    const handleLike = (postId) => {
        let userId = localStorage.getItem('userId');
    
        const url = API_URL + '/like-post';
        const data = { userId, postId };
    
        axios.post(url, data)
            .then((res) => {
                if (res.data.message === 'Liked') {
                    setposts((prevPosts) => 
                        prevPosts.map((post) => 
                            post._id === postId ? { ...post, liked: true } : post
                        )
                    );
                }
            })
            .catch((err) => {
                alert('Server Error.');
            });
    };
    


    return (
        <div>
            <Header search={search} handlesearch={handlesearch} handleClick={handleClick} />
            <Categories handleCategory={handleCategory} />

            <div className="d-flex justify-content-center flex-wrap">
                {cposts && posts.length > 0 &&
                    cposts.map((item, index) => {

                        return (
                            <div key={item._id} className="card m-3 ">
                                <div onClick={() => handleLike(item._id)} className="icon-con">
                                <FaHeart className={`icons ${item.liked ? 'liked' : ''}`} />

                                </div>

                                <p className="m-2"> {item.postname}  | {item.category} </p>
                                <p className="m-2 text-success"> {item.postdesc} </p>
                            </div>
                        )

                    })}
            </div>

            <h5> ALL RESULTS  </h5>

            <div className="d-flex justify-content-center flex-wrap">
                {posts && posts.length > 0 &&
                    posts.map((item, index) => {
                        return (
                            <div key={item._id} className="card m-3 ">
                                <div onClick={() => handleLike(item._id)} className="icon-con">
                                <FaHeart className={`icons ${item.liked ? 'liked' : ''}`} />
                                </div>
                                <p className="m-2"> {item.postname}  | {item.category} </p>
                                <p className="m-2 text-success"> {item.postdesc} </p>
                            </div>
                        )

                    })}
            </div>



        </div>
    )
}

export default MyPosts;