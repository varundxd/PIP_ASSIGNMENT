import { useEffect, useState } from "react";
import Header from "./Header";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import categories from "./CategoriesList";
import API_URL from "../constants";


function AddPost() {

    const navigate = useNavigate();
    const [postname, setpostname] = useState('');
    const [postdesc, setpostdesc] = useState('');
    const [category, setcategory] = useState('');
    const [isNameFocused, setIsNameFocused] = useState(false);
    const [isDescFocused, setIsDescFocused] = useState(false);
    const [isCategoryFocused, setIsCategoryFocused] = useState(false);


    useEffect(() => {
        if (!localStorage.getItem('token')) {
            navigate('/login')
        }
    }, [])
   
    const handleApi = () => {
        if (!postname || !postdesc || !category) {
            alert("All fields are required");
            return;
        }
        const token = localStorage.getItem('token'); 
        if (!token) {
            console.log('No token provided');
            return;
        }
    
        const formData = new FormData();
        formData.append('postname', postname);
        formData.append('postdesc', postdesc);
        formData.append('category', category);
        formData.append('userId', localStorage.getItem('userId'));
    
        const url = API_URL + '/add-post';
        
        axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}` 
            }
        })
        .then((res) => {
            if (res.data.message) {
                alert(res.data.message);
                navigate('/');
            }
        })
        .catch((err) => {
            console.error('Error in API call:', err);
            if (err.response) {
                console.log('Error Response Data:', err.response.data);
                console.log('Error Response Status:', err.response.status);
                console.log('Error Response Headers:', err.response.headers);
            }
            alert('Server error');
        });
    };    

    return (
        <div>
            <Header />
                    <div className="p-3">

<h2> ADD POST HERE : </h2>
<div className="addForm">
<div className="form-container">
    <label> Post Name </label>
    <input
     className={`po form-control ${isNameFocused ?'':''}`}
        type="text"
        value={postname}
        onFocus={() => setIsNameFocused(true)}
        onBlur={() => setIsNameFocused(false)}
        style={isNameFocused ? { backgroundColor: '#48506180',color:'white',border:'2px solid black' } : {}}
        onChange={(e) => setpostname(e.target.value)}
    />
</div>

<div className="form-container">
    <label > Post Description </label>
    <input
    className={`pde form-control ${isDescFocused ?'':''}`}
        type="text"
        value={postdesc}
        onFocus={() => setIsDescFocused(true)}
        onBlur={() => setIsDescFocused(false)}
        style={isDescFocused ? { backgroundColor: '#48506180',color:'white',border:'2px solid white' } : {}}
        onChange={(e) => setpostdesc(e.target.value)}
    />
</div>

<div className="form-container">
    <label > Post Category </label>
    <select
        className={`po form-control ${isCategoryFocused ?'':''}`}
        value={category}
        onChange={(e) => setcategory(e.target.value)}
        onFocus={() => setIsCategoryFocused(true)}
        onBlur={() => setIsCategoryFocused(false)}
        style={isCategoryFocused ? { backgroundColor: '#446aba80',color:'white',border:'2px solid black' } : {}}
    >
        <option value="">Select Category</option>
        {categories &&
            categories.length > 0 &&
            categories.map((item, index) => (
                <option key={item + index}> {item} </option>
            ))}
    </select>
</div>

<button onClick={handleApi} className="button-85">
    SUBMIT
</button>
</div>
            </div>

        </div>
    )
}


export default AddPost;