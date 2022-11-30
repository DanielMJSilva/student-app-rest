const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const CourseSchema = new Schema({
    courseCode:  {
            type: String,
            default: '',
            trim: true,
            required: 'Course Code cannot be blank'
        }, 
    courseName: String, 
    section: String, 
    semester: String,
    // I need to add a ref: 
    enroll: [{
        type: Schema.ObjectId,
        ref: 'Student'
    }]
});
mongoose.model('Course', CourseSchema);
