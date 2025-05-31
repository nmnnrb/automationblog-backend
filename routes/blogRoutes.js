const express = require("express");
const blogController = require("../controllers/blogController")
const router =express.Router();


router.post("/create-post", blogController.createPost);
router.get("/get-all-posts" , blogController.getAllPosts);
router.get("/post/:id" , blogController.getSinglePost);
router.put("/update-summary/:id", blogController.updateSummaryPost);

router.put("/update-post/:id", blogController.updatePost);
module.exports = router


//updated
// sudo chown -R $(whoami) . djdsj
