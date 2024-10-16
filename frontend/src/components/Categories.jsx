import { Link, useNavigate } from 'react-router-dom';

import categories from './CategoriesList';

import React from 'react';

function Categories(props) {
    const navigate = useNavigate();

    return (
        <div className='cat-container'>
            <div>
                <span className='pr-3'>Categories</span>
                {categories && categories.length > 0 &&
                    categories.map((item, index) => (
                        <React.Fragment key={index}>
                            <span onClick={() => navigate('/category/' + item)} className='category'> {item} </span>
                            <span className="chunkylist"> </span>
                        </React.Fragment>
                    ))}
            </div>
        </div>
    );
}

export default Categories;