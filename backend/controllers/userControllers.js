const mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

const Users = mongoose.model('Users',{
    username: { type: String, required: true },
    mobile: { type: String, required:true},
    email: { type: String, required:true},
    password: { type: String, required:true},
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, unique: true },
    likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Posts' }],
    friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }], // Incoming friend requests
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Users' }],        // Confirmed friends
})

function normalizeMobileNumber(mobile) {
    return mobile.replace(/^(\+|0+)/, '');
}



module.exports.likedPosts = (req, res) => {
    let postId = req.body.postId;
    let userId = req.body.userId;

    Users.updateOne({ _id: userId }, { $addToSet: { likedPosts: postId } })
        .then(() => {
            res.send({ message: 'Post has been liked successfully.'})
        })
        .catch(() => {
            res.send({ message: 'server error' })
        })
};


module.exports.register = async (req, res) => {
    const { username, password, email, mobile } = req.body;
    const userId = new mongoose.Types.ObjectId();
    const normalizedMobile = normalizeMobileNumber(mobile);
    try {
        const user = new Users({ username, password, email, mobile: normalizedMobile, userId});
        await user.save();
        res.status(200).json({ success: true, message: 'User registered successfully.' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports.getUserById = (req, res) => {
    const _userId = req.body.userId;
    Users.findOne({ userId:_userId})
        .then((result) => {
            console.log(result);
            if (!result) {
                console.log("User not found");
                return res.status(404).send({ message: 'User not found' });
            }
            console.log("User found:", result);
            res.send({
                message: 'success.', user: {
                    email: result.email,
                    mobile: result.mobile,
                    username: result.username
                }
            });
        })
        .catch((err) => {
            console.error("Error:", err);
            res.status(500).send({ message: 'server error' });
        });
};

module.exports.login = (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    Users.findOne({ username: username })
        .then((result) => {
            if (!result) {
                res.send({ message: 'user not found.' })
            } else {
                if (result.password == password) {
                    const token = jwt.sign({
                        data: result
                    }, 'MYKEY', { expiresIn: '1h' });
                    res.send({ message: 'find success.', token: token, userId: result._id })
                }
                if (result.password != password) {
                    res.send({ message: 'password wrong.' })
                }

            }

        })
        .catch(() => {
            res.send({ message: 'server err' })
        })

};

module.exports.likedPosts = (req, res) => {
    console.log("liked posts route reached")
        Users.findOne({ _id: req.body.userId }).populate('likedPosts')
            .then((result) => {
                res.send({ message: 'success', posts: result.likedPosts })
            })
            .catch((err) => {
                res.send({ message: 'server err' })
            })
    
};

    module.exports.unlikePost = (req, res) => {
        console.log('unlikePost route reached');
        let postId = req.body.postId;
        let userId = req.body.userId;
        console.log('postId:', postId);
        console.log('userId:', userId);
    
        Users.updateOne({ _id: userId }, { $pull: { likedPosts: postId } })
            .then(() => {
                res.send({ message: 'Unliked successfully.' });
            })
            .catch((err) => {
                console.error(err);
                res.status(500).send({ message: 'Server error while unliking.' });
            });
    };

    module.exports.sendFriendRequest = async (req, res) => {
        const { senderId, receiverId } = req.body;
      
        try {
          if (senderId === receiverId) {
            return res.status(400).json({ message: 'Cannot send request to yourself.' });
          }
      
          const sender = await Users.findById(senderId);
          const receiver = await Users.findById(receiverId);
      
          if (!receiver) {
            return res.status(404).json({ message: 'Receiver not found.' });
          }
      
          if (receiver.friendRequests.includes(senderId)) {
            return res.status(400).json({ message: 'Request already sent.' });
          }
      
          if (receiver.friends.includes(senderId)) {
            return res.status(400).json({ message: 'Already friends.' });
          }
      
          receiver.friendRequests.push(senderId);
          await receiver.save();
      
          res.status(200).json({ message: 'Friend request sent.' });
        } catch (error) {
          res.status(500).json({ message: 'Server error.' });
        }
      };
      
      module.exports.acceptFriendRequest = async (req, res) => {
        const { userId, senderId } = req.body;
      
        try {
          const user = await Users.findById(userId);
          const sender = await Users.findById(senderId);
      
          if (!user.friendRequests.includes(senderId)) {
            return res.status(400).json({ message: 'No request from this user.' });
          }
      
          // Add each other as friends
          user.friends.push(senderId);
          sender.friends.push(userId);
      
          // Remove the friend request
          user.friendRequests = user.friendRequests.filter(
            (id) => id.toString() !== senderId
          );
      
          await user.save();
          await sender.save();
      
          res.status(200).json({ message: 'Friend request accepted.' });
        } catch (error) {
          res.status(500).json({ message: 'Server error.' });
        }
      };
      
      module.exports.getFriendRequests = async (req, res) => {
        const { userId } = req.params;
      
        try {
          const user = await Users.findById(userId).populate('friendRequests', 'username');
          res.status(200).json({ friendRequests: user.friendRequests });
        } catch (error) {
          res.status(500).json({ message: 'Server error.' });
        }
      };
      