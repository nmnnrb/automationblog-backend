const express = require('express');
const trackerController = require("../controllers/trackerController");
const authentication = require('../middleware/authentication');

const router = express.Router();


router.post('/create-tracker' ,authentication , trackerController.createPost);
router.get('/get-tracker-post'  ,authentication , trackerController.getAllTrackerPosts);
router.put('/update-tracker-post/:id' ,authentication , trackerController.updateTrackerPost);
router.get('/tracker-post/:id' ,authentication , trackerController.getPost);
module.exports = router;