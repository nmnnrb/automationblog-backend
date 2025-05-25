const express = require('express');
const trackerController = require("../controllers/trackerController")

const router = express.Router();


router.post('/create-tracker' , trackerController.createPost);
router.get('/get-tracker-post'  , trackerController.getAllTrackerPosts);

module.exports = router;