const express = require("express");
const skillsController = require("../controllers/skillsController");
const authentication = require("../middleware/authentication");
const router =express.Router();

router.post("/create-skill", authentication , skillsController.createSkill);
router.get("/get-all-skills", authentication , skillsController.getAllSkills);
router.post("/check-box", authentication , skillsController.checkBox);
router.get("/score/:skillName" , authentication , skillsController.score);
router.post("/point" , authentication , skillsController.points);

module.exports = router