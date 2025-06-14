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
    const posts = await blogPost.find().sort({ date: -1 });
    res.status(200).json({success: true, post: posts});
  } catch (error){
    res.status(500).json({ success: false, message: error.message });
  }
}


exports.getSinglePost = async (req,res) => {

  try {
    const postId = req.params.id;
    const post = await blogPost.findById(postId);
    
    if (!post) {
      return res.status(404).json({ success: false, message: 'Post not found' });
    }
    res.status(200).json({ success: true, post });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


exports.updateSummaryPost = async (req, res) => {

  const {summaryBool, summaryData} = req.body;

  try {
    const postId = req.params.id;
    const updatedPost = await blogPost.findByIdAndUpdate(
      postId,
      { summaryBool, summaryData },
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


exports.updatePost = async (req,res) => {
  const postId = req.params.id;
  const { title, content, author } = req.body;

  try {
    const updatedPost = await blogPost.findByIdAndUpdate(
      postId,
      { title, content, author,  },
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