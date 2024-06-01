const Post = require('../schemas/postSchema')
const User = require('../schemas/userSchema')

exports.create_post = async (req, res) => {
    
    try {
        const {title, author, content} = req.body;        
        const newPost = new Post({ title, author, content });
        await newPost.save();
        res.status(201).json({ message: 'Posted successfully', post: newPost })

    } catch (error) {
        res.status(500).json({ message: `Server error: ${error.message}` })
    }
};

exports.view_post= async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate('author', 'username');

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        } else {
            res.status(200).json({ post });
        }
    } catch (error) {
        res.status(500).json({ message: `Server Error: ${error.message}`})
    }
};

exports.all_posts = async (req, res) => {
    try {
        const allPosts = await Post.find().sort({ createdAt: -1 }).populate('author', 'username')

        if (allPosts.length > 0) {
            res.status(200).json({ message: 'Success retrieving all posts', posts: allPosts })
        } else {
            res.status(404).json({ message: 'No posts found' })
        }

    } catch (error) {
        res.status(500).json({ message: `Server error: ${error.message}` })
    }
};

exports.update_post = async (req, res) => {
    try {
        const {title, content} = req.body; 
        const author = req.user._id;

        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        if (!post.author.equals(author)) {
            return res.status(403).json({ message: 'You are no authorized to edit this post'});
        }

        post.title = title;
        post.content = content;

        await post.save();
        res.status(200).json({ message: 'Post update successful'. post });

    } catch (error) {
        res.status(500).json({ message: `Server error: ${error.message}` })
    }
};

exports.add_comment = async (req, res) => {
    try {
        const { content } = req.body;
        const author = req.user._id;

        const parentPost = await Post.findById(req.params.id)

        if (!parentPost) {
            res.status(404).json({ message: 'Parent post not found'})
        }

        const comment = new Post({ title: `Comment on ${parentPost.title}`, author, content })
        await comment.save();

        parentPost.comments.push(comment._id)
        await parentPost.save();
        
        res.status(201).json({ message: 'Comment added'})        
    } catch (error) {
        res.status(500).json({ message: `Server error: ${error.message}` })
    }
};

exports.delete_post = async (req, res) => {
    
    try {        
        const postId = req.params.id;
        const userId = req.user._id;

        // Remove post from Post collection
        const post = await Post.findByIdAndDelete(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Remove post reference from User
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        user.posts = user.posts.filter(id => id.toString() !== postId);
        await user.save();

        res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: `Server error: ${error.message}` })
    }
};


// exports.posts_by_id = async (req, res) => {
//     try {
//         const post = await Post.findById(req.params.id);
//         console.log(post)
//         if (post) {
//             res.status(200).json({ message: `Title: ${post.title}`, post })
//         } else {
//             res.status(404).json({ message: 'Post not found!' })
//         }
      
//     } catch (error) {
//         res.status(500).json({ message: `Server error: ${error.message}` })
//     }
// };



exports.user_posts = async (req, res) => {
    try {
        const author = req.user._id;
        const  postsByAuthor = Post.find({ author }).sort({ createdAt: -1 })
        if (postsByAuthor.length > 0) {
            res.status(200).json({ message: 'Found author posts', posts: postsByAuthor })
        } else {
            res.status(404).json({ message: 'No posts found by author'})
        }
    } catch (error) {
        res.status(500).json({ message: `Server error: ${error.message}` })
    }
};





