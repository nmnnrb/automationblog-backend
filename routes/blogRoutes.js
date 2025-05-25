const express = require("express");
const blogController = require("../controllers/blogController")
const router =express.Router();


router.post("/create-post", blogController.createPost);
router.get("/get-all-posts" , blogController.getAllPosts);


module.exports = router