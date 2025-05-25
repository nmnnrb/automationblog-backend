const trackerPost = require('../model/trackerPost');
const TrackerPost = require('../model/trackerPost');

exports.createPost = async (req,res) => {
    const {dateManual , content , title, author} = req.body;

    try {
        const newActivity = new trackerPost({
            title,
            content,
            author,
            dateManual
        })
        await newActivity.save();
        res.status(201).json({ success: true, post: newActivity });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
}
