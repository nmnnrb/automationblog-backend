const express = require('express');
const trackerController = require("../controllers/trackerController")

const router = express.Router();


router.post('/create-tracker' , trackerController.createPost);
router.get('/get-tracker-post'  , trackerController.getAllTrackerPosts);
router.put('/update-tracker-post/:id' , trackerController.updateTrackerPost);
router.get('/tracker-post/:id' , trackerController.getPost);
module.exports = router;