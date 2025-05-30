const skillsTrack = require('../model/skillsTrack');
const SkillsTrack = require('../model/skillsTrack')


exports.createSkill = async (req,res) => {
  const {skillName, basicQuestion, mediumQuestion , hardQuestion} = req.body;
    const rees = await SkillsTrack.findOne({skillName: skillName});

    if(rees) {
      return res.status(400).json({ success: false, message: 'Skill already exists' });
    }
  try {
    const newSkill = new SkillsTrack({
      skillName,
      basicQuestion,
      mediumQuestion,
      hardQuestion
    });
    
    await newSkill.save();
    res.status(201).json({ success: true, skill: newSkill });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  } 
}

exports.getAllSkills = async (req, res) => {

try {
    const skills = await skillsTrack.find().sort({ lastUpdated: -1 });
    res.status(200).json({ success: true, skills });
} catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}


exports.checkBox = async (req, res) => {
  try {
    const { skillName, questionType, questionIndex, checked } = req.body;

    if (!skillName || !questionType || questionIndex === undefined || checked === undefined) {
      return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    const questionArrayName = questionType + 'Question';
    const checkedArrayName =
      'checked' + questionType.charAt(0).toUpperCase() + questionType.slice(1) + 'Questions';

    const skill = await SkillsTrack.findOne({ skillName });
    if (!skill) return res.status(404).json({ message: 'Skill not found' });

    // Validate index
    if (
      !skill[questionArrayName] ||
      questionIndex < 0 ||
      questionIndex >= skill[questionArrayName].length
    ) {
      return res.status(400).json({ message: 'Invalid question index' });
    }

    // Initialize checked array if needed
    if (!skill[checkedArrayName] || skill[checkedArrayName].length !== skill[questionArrayName].length) {
      skill[checkedArrayName] = new Array(skill[questionArrayName].length).fill(false);
    }

    skill[checkedArrayName][questionIndex] = checked;

    // Calculate score with different weights
    const basicScore =
      (skill.checkedBasicQuestions || []).filter(Boolean).length * 2;
    const mediumScore =
      (skill.checkedMediumQuestions || []).filter(Boolean).length * 3;
    const hardScore =
      (skill.checkedHardQuestions || []).filter(Boolean).length * 5;

    skill.score = basicScore + mediumScore + hardScore;
    skill.lastUpdated = Date.now();

    await skill.save();

    res.json({
      message: 'Checkbox updated',
      score: skill.score,
      checkedArray: skill[checkedArrayName],
    });
  } catch (error) {
    console.error('Error updating checkbox:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




exports.score = async (req,res) => {
   
  const { skillName } = req.params;

  try {
    const response = await skillsTrack.findOne({ skillName: skillName });
    if (!response) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }
    console.log("Score fetched successfully");
    res.status(200).json({ success: true, score: response.score });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
}




exports.points = async (req, res) => {
  const { skillName, points } = req.body;

  try {
    const skill = await SkillsTrack.findOne({ skillName });
    if (!skill) {
      return res.status(404).json({ success: false, message: 'Skill not found' });
    }

    // Safely add points
    skill.score = (skill.score || 0) + points;
    skill.lastUpdated = Date.now();

    await skill.save();

    res.status(200).json({ success: true, newScore: skill.score });
  } catch (error) {
    console.error("Error updating points:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
