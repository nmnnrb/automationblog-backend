const blogPost = require('../model/blogPost');


exports.createPost = async (req,res) => {

    const {title, content, author} = req.body;

    try {
        const newPost = new blogPost({
        title,
        content,
        author
    })
      await newPost.save();
      res.status(201).json({ success: true, post: newPost });
    } catch (error) {
    res.status(500).json({ success: false, message: error.message });
        
    }

}


exports.getAllPosts = async (req,res) => {
  try {
    const posts = await blogPost.find();
    res.status(200).json({success: true, post: posts});
  } catch (error){
    res.status(500).json({ success: false, message: error.message });
  }
}