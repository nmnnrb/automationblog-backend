const express = require("express");
const skillsController = require("../controllers/skillsController");
const router =express.Router();

router.post("/create-skill", skillsController.createSkill);
router.get("/get-all-skills", skillsController.getAllSkills);
router.post("/check-box", skillsController.checkBox);
router.get("/score/:skillName" , skillsController.score);
router.post("/point" , skillsController.points);

module.exports = router