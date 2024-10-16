const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const postController = require('./controllers/postController');
const userController = require('./controllers/userController');
const path = require('path');
const app = express();
const port = 4000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require('dotenv').config();
mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('MongoDB connection successful');
})
.catch((err) => {
  console.error('MongoDB connection error:', err);
}
)

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.use(express.static(path.join(__dirname, 'frontend/build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'fontend/public', 'index.html'));
});


app.get('/search', postController.search);
app.post('/add-post',postController.authenticateUser, postController.addPost);
app.get('/get-posts', postController.getPosts);
app.get('/get-post/:pId', postController.getPostsById);
app.get('/get-comments/:pId',postController.getComment);
app.post('/like-post', postController.authenticateUser, userController.likedPosts);
app.post('/my-posts', postController.authenticateUser, postController.myPosts);
app.post('/register', userController.register);

app.get('/users/:userId/friend-requests', userController.getFriendRequests);
app.get('/get-user/:userId', userController.getUserById);
app.post('/login', userController.login);
app.post('/unlike-post', postController.authenticateUser, userController.unlikePost);
app.post('/add-comment',postController.authenticateUser,postController.addComment);
app.post('/delete-comment',postController.authenticateUser,postController.deleteComment);
app.post('/send-friend-request', userController.sendFriendRequest);
app.post('/accept-friend-request', userController.acceptFriendRequest);


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});

