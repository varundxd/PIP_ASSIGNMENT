const mongoose = require('mongoose');
const jwt = require('jsonwebtoken'); 

let schema = new mongoose.Schema({
    postname: String,
    postdesc: String,
    category: String,
    addedBy: mongoose.Schema.Types.ObjectId,
    user: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        default: null
    },
    comments: [
        {
        commentId: mongoose.Schema.Types.ObjectId, 
          text: String,
          userId: mongoose.Schema.Types.ObjectId,
          username: String,
          rating: {
            type: Number,
            min: 1,
            max: 5,
          },
        },
      ],
 
})

const Posts = mongoose.model('Posts', schema);
module.exports.search = (req, res) => {

    try {
        // Define an array to hold the search criteria
        let searchCriteria = [];

        // Check if 'search' query parameter is present
        if (req.query.search) {
            const search = req.query.search;
            // Add criteria for pname, pdesc, and price
            searchCriteria.push({
                $or: [
                    { postname: { $regex: search, $options: 'i' } }, 
                    { postdesc: { $regex: search, $options: 'i' } },
                    { 'user.data.username': { $regex: search, $options: 'i' } },
                    
                ],
            });
        }

        if (req.query.category) {
            const category = req.query.category;

            searchCriteria.push({ category: { $regex: category, $options: 'i' } });
        }
        const query = { $and: searchCriteria };

        Posts.find(query)
            .then((results) => {
                res.send({ message: 'success', products: results });
            })
            .catch((err) => {
                console.error(err);
                res.send({ message: 'server err' });
            });
    } catch (error) {
        console.error(error);
        res.send({ message: 'invalid request parameters' });
    }
};

module.exports.authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;
    console.log('Token:', token);

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token.split(' ')[1], 'MYKEY');
        console.log('Decoded:', decoded);
        req.user = decoded;
        next();
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            console.error('Token has expired:', error);
            return res.status(401).json({ message: 'Token has expired' });
        }

        console.error('Error decoding token:', error);
        return res.status(401).json({ message: 'Unauthorized' });
    }
};
       
module.exports.addPost = (req, res) => {
    try {
        const { postname, postdesc, category } = req.body;
        const addedBy = req.user.data.userId;
        console.log(addedBy);
        if (!postname || !postdesc || !category) {
            return res.status(400).send({ message: 'Please provide all required fields with valid values.' });
        }

        const post = new Posts({
            postname,
            postdesc,
            category,
            addedBy,
        });
        post.save()
        .then(() => {
            res.send({ message: 'Saved successfully' });
        })
        .catch((error) => {
            console.error('Error saving post:', error);
            res.status(500).send({ message: 'Error saving post', error: error.message });
        });
} catch (error) {
    console.error('Error adding post:', error);
    res.status(500).send({ message: 'Error adding post', error: error.message });
}
};


module.exports.getPosts = (req, res) => {

    const catName = req.query.catName;
    let _f = {}

    if (catName) {
        _f = { category: catName }
    }

    Posts.find(_f)
        .then((result) => {
            res.send({ message: 'success', posts: result })

        })
        .catch((err) => {
            res.send({ message: 'server err' })
        })

};

module.exports.getPostsById = (req, res) => {
    console.log(req.params);

    Posts.findOne({ _id: req.params.pId })
        .then((result) => {
            res.send({ message: 'success', product: result })
        })
        .catch((err) => {
            res.send({ message: 'server err' })
        })

};

module.exports.myPosts = (req, res) => {

    const userId = req.body.userId;

    Posts.find({ addedBy: userId })
        .then((result) => {
            res.send({ message: 'success', posts: result })
        })
        .catch((err) => {
            res.send({ message: 'server err' })
        })

};

module.exports.deleteComment = async (req, res) => {
    const { pId, commentId } = req.body;
    const userId = req.user.data.userId;

    try {
        const post = await Posts.findById(pId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        console.log(post.addedBy);
  console.log(userId);

        //Check if the user is the owner of the product
        if (post.addedBy.toString() === userId) {
            // User is the owner of the product, allow them to delete any comment
            post.comments = post.comments.filter(comment => comment._id.toString() !== commentId);
            await post.save();
            return res.json({ message: 'Comment deleted successfully' });
        }


        // Find the comment by ID
        const comment = post.comments.find(comment => comment._id.toString() === commentId);

        // Check if the comment exists
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        // Ensure that the user is the owner of the comment
        if (comment.userId.toString() !== userId) {
            return res.status(401).json({ message: 'Unauthorized to delete this comment' });
        }

        // Remove the comment from the product
        post.comments = post.comments.filter(comment => comment._id.toString() !== commentId);
        await post.save();

        res.json({ message: 'Comment deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports.getComment= async (req, res) => {
    const pId = req.params.pId;
    console.log('Received postId:', pId);
    try {
      const post = await Posts.findById(pId);
  
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      res.json({ message: 'success', comments: post.comments});
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  };

module.exports.addComment = async (req, res) => {
    const { pId, text, rating } = req.body;
    const userId =    req.user.data.userId 
    const username = req.user.data.username;
  

    try {
        const post = await Posts.findById(pId);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Validate the rating value
        if (rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Invalid rating value. Rating must be between 1 and 5.' });
        }

        // Generate a comment ID
        const commentId = new mongoose.Types.ObjectId();

        // Add the comment to the product
        post.comments.push({ commentId, text, userId, username, rating });
        await post.save();

        // Send the newly added comment in the response
        const newComment = post.comments[post.comments.length - 1];
        res.json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};