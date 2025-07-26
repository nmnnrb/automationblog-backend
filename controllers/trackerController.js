const trackerPost = require('../model/trackerPost');


exports.createPost = async (req,res) => {
          const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized: user ID missing' });
  }
    const {date , content , title, author} = req.body;

    try {
        const newActivity = new trackerPost({
            title,
            content,
            author,
            date,
            userId
        })
        await newActivity.save();
        res.status(201).json({ success: true, post: newActivity });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


exports.getAllTrackerPosts = async (req,res) => {
        const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized: user ID missing' });
  }
    try{
       const trackerPosts = await trackerPost.find({ userId }).sort({ dateNow: -1 });
       res.status(200).json({success: true, post: trackerPosts});
    }catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
}


exports.updateTrackerPost = async (req,res) => {
        const userId = req.user?._id;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Unauthorized: user ID missing' });
  }
    const { id } = req.params;
    const { title, content, author, date } = req.body;

    try {
        const updatedPost = await trackerPost.findByIdAndUpdate(
            id,
            { title, content, author, date, userId },
            { new: true }
        );

        if (!updatedPost) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        res.status(200).json({ success: true, post: updatedPost });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}

exports.getPost = async (req,res) => {
    
    const {id} = req.params;

    try {
        const post = await trackerPost.findById(id);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        res.status(200).json({ success: true, post });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
        
    }
}