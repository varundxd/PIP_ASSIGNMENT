const API_URL = process.env.NODE_ENV !== 'development' ?
    
    'http://localhost:4000':''

console.log(process.env, "API_URL");

export default API_URL;
