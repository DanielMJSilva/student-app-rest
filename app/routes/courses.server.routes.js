const students = require('../../app/controllers/students.server.controller');
const courses = require('../../app/controllers/courses.server.controller');
//
module.exports = function (app) {
        app.route('/api/courses')
            .get(courses.list)
            //.post(courses.requiresLogin, courses.create); //return ERROR
            
        //
        app.route('/api/courses/:courseId')
            .get(courses.read)
            .put(students.requiresLogin, 
                // courses.hasAuthorization, 
                courses.update)
            .delete(students.requiresLogin, courses.hasAuthorization, courses.delete)
        //  
        //
        app.route('/api/courses/enroll/:courseId/:studentId')
            .put(students.requiresLogin, courses.enroll)

        app.route('/api/courses/drop/:courseId/:studentId')
            .put(students.requiresLogin, courses.drop)

        app.route("/api/courses/enrolled/:studentId")
            .get(students.requiresLogin, courses.getEnrolledCourses)
        
        app.route("/api/courses/notenrolled/:studentId")
            .get(students.requiresLogin, courses.getNotEnrolledCourses)

        app.param('courseId', courses.courseByID);
        app.param('studentId', students.studentByID);

};
