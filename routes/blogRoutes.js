const express = require("express");
const blogController = require("../controllers/blogController");
const authentication = require("../middleware/authentication");
const router =express.Router();


router.post("/create-post", authentication ,blogController.createPost);
router.get("/get-all-posts", authentication , blogController.getAllPosts);
router.get("/post/:id", authentication , blogController.getSinglePost);
router.put("/update-summary/:id" , authentication, blogController.updateSummaryPost);

router.put("/update-post/:id", blogController.updatePost);
module.exports = router


//updated
// sudo chown -R $(whoami) . djdsj
