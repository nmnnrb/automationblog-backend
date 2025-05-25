const trackerPost = require('../model/trackerPost');


exports.createPost = async (req,res) => {
    const {date , content , title, author} = req.body;

    try {
        const newActivity = new trackerPost({
            title,
            content,
            author,
            date
        })
        await newActivity.save();
        res.status(201).json({ success: true, post: newActivity });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}


exports.getAllTrackerPosts = async (req,res) => {
    try{
       const trackerPosts = await trackerPost.find().sort({ dateNow: -1 });
       res.status(200).json({success: true, post: trackerPosts});
    }catch (error) {
        res.status(500).json({success: false, message: error.message});
    }
}