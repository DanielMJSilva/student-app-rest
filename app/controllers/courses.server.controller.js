const mongoose = require('mongoose');
const Course = mongoose.model('Course');
const Student = require('mongoose').model('Student');

//
function getErrorMessage(err) {
    if (err.errors) {
        for (let errName in err.errors) {
            if (err.errors[errName].message) return err.errors[errName].
                message;
        }
    } else {
        return 'Unknown server error';
    }
};
//
exports.create = function (req, res) {
    const course = new Course();
    course.courseName = req.body.courseName;
    course.section = req.body.section;
    course.semester = req.body.semester;
    course.enroll = [];
    console.log(req.body)
    //
    //

    // Use the 'Course' instance's 'save' method to save a new user document
    course.save(function (err) {
        if (err) {
            // Call the next middleware with an error message
            return next(err);
        } else {
            // Use the 'response' object to send a JSON response
            res.json(course);
            
        }
    });

    // Student.findOne({studentNumber: req.body.studentNumber}, (err, student) => {

    //     if (err) { return getErrorMessage(err); }
    //     //
    //     req.id = student._id;
    //     console.log('student._id',req.id);

	
    // }).then( function () 
    // {
    //     course.enroll = req.id
    //     //course.enroll = course.enroll.push(req.id)
        
    //     console.log('req.student._id',req.id);

    //     course.save((err) => {
    //         if (err) {
    //             console.log('error', getErrorMessage(err))

    //             return res.status(400).send({
    //                 message: getErrorMessage(err)
    //             });
    //         } else {
    //             res.status(200).json(course);
    //         }
    //     });
    
    // });
};
// Enroll student into course
exports.enroll = function(req, res) {
    const courseId = req.params.courseId;
    const studentId = req.params.studentId;
    Course.findByIdAndUpdate(
        courseId,
        {
            $addToSet: { enroll: studentId}
        },
        {
            useFindAndModify: false
        }
    ).then((data) => {
        if(!data){
            res.status(404).send({
                message: `It is not possible to enroll course`
            });

        } else {
            res.send({ message: `Enroll succesfully`})
        }
    }).catch((err) => {
        res.status(500).send( getErrorMessage(err))
    })
};

exports.drop = function(req, res) {
    const courseId = req.params.courseId;
    const studentId = req.params.studentId;
    Course.findByIdAndUpdate(
        courseId,
        {
            $unset: { enroll: studentId}
        },
        {
            useFindAndModify: false
        }
    ).then((data) => {
        if(!data){
            res.status(404).send({
                message: `It is not possible to drop course`
            });

        } else {
            res.send({ message: `Drop Course succesfully`})
        }
    }).catch((err) => {
        res.status(500).send( getErrorMessage(err))
    })
};

exports.getEnrolledCourses = async function (req, res) {
    // Check for student number
    const student = await Student.findById(req.params.studentId);
  
    // Getting courses
    const courses = await Course.find({
      enroll: { _id: student.id },
    });
  
    res.status(200).json(courses);
  };

  

  exports.getNotEnrolledCourses = async function (req, res) {
    // Check for student number
    const student = await Student.findById(req.params.studentId);
  
    // Getting courses not enrolled
    const courses = await Course.find({
      enroll: { $ne: { _id: student.id }},
    });
  
    res.status(200).json(courses);
  };

//Professor exemple

// exports.enroll = async function(req, res) {
//     const course = await Course.findOne({
//       courseId: `${req.params.courseId}`,
//     });
  
//     if (!course) {
//       res.status(400);
//       throw new Error("Course not found");
//     }
  
//     // Check for student number
//     const student = await Student.findById(req.params.studentId);
  
//     if (!student) {
//       res.status(400);
//       throw new Error("Student not found");
//     }
  
//     let newEnrollStudent = student._id;
//     console.log(newEnrollStudent);
//     course.enrolledStudents.push(newEnrollStudent);
  
//     const updatedCourse = await Course.findByIdAndUpdate(
//       { _id: course._id },
//       course,
//       {
//         new: true,
//       }
//     );
//     res.status(200).json(updatedCourse);
// };



    //
    //
    // Student.findOne({studentNumber: req.body.studentNumber}, (err, student) => {

    //     if (err) { return getErrorMessage(err); }
    //     //
    //     req.id = student._id;
    //     console.log('student._id',req.id);

	
    // }).then( function () 
    // {
    //     course.enroll = req.id
    //     //course.enroll = course.enroll.push(req.id)
        
    //     console.log('req.student._id',req.id);

    //     course.save((err) => {
    //         if (err) {
    //             console.log('error', getErrorMessage(err))

    //             return res.status(400).send({
    //                 message: getErrorMessage(err)
    //             });
    //         } else {
    //             res.status(200).json(course);
    //         }
    //     });
    
    // });
//};

//
exports.list = function (req, res) {
    Course.find().sort('-enrolled').populate('enroll', 'courseName section semester').exec((err, courses) => {
if (err) {
        return res.status(400).send({
            message: getErrorMessage(err)
        });
    } else {
        res.status(200).json(courses);
    }
});
};
//
exports.courseByID = function (req, res, next, id) {
    Course.findById(id).populate('enroll', 'firstName lastName fullName').exec((err, course) => {if (err) return next(err);
    if (!course) return next(new Error('Failed to load course '
            + id));
        req.course = course;
        console.log('in courseById:', req.course)
        next();
    });
};
//
exports.read = function (req, res) {
    res.status(200).json(req.course);
};
//
exports.update = function (req, res) {
    console.log('in update:', req.course)
    const course = req.course;
    course.courseName = req.body.courseName;
    course.section = req.body.section;
    course.semester = req.body.semester;
    course.enroll = req.body.enroll;
    course.save((err) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.status(200).json(course);
        }
    });
};
//
exports.delete = function (req, res) {
    const course = req.course;
    course.remove((err) => {
        if (err) {
            return res.status(400).send({
                message: getErrorMessage(err)
            });
        } else {
            res.status(200).json(course);
        }
    });
};
//The hasAuthorization() middleware uses the req.course and req.user objects
//to verify that the current student is enrolled in the current course
exports.hasAuthorization = function (req, res, next) {
    console.log('in hasAuthorization - enroll: ',req.course.enroll)
    console.log('in hasAuthorization - student: ',req.id)
    //console.log('in hasAuthorization - user: ',req.user._id)


    if (req.course.enroll.id !== req.id) {
        return res.status(403).send({
            message: 'Student is not authorized'
        });

 
    }
    next();
};
