const express = require('express');
const trackerController = require("../controllers/trackerController")

const router = express.Router();


router.post('/create-tracker' , trackerController.createPost);


module.exports = router;