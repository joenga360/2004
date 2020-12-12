const router = require('express-promise-router')()
const AdminController = require('../controllers/admin')
const StudentController = require('../controllers/student')
const authenticate = require("../helpers/authenticate")

//callback from quickbooks
router.route('/callback').get( authenticate.isAdmin, AdminController.qboCallback)
//get view for adding many courses
router.route('/courses').get( authenticate.isAdmin,  AdminController.addCourseView )
//get view for course schedules for admin to add or transfer student 
router.route('/course-schedules/:type').get( authenticate.isAdmin,  AdminController.getCourseSchedules )
//route for getting admin dashboard
router.route("/dashboard").get( authenticate.isAdmin, StudentController.getDailyRegistrants)
//admin gives consent for QB account accessent
router.route('/quickbooks').get( authenticate.isAdmin,  AdminController.getQboPage ) 
//route for requesting token from quickbooks
router.route("/request-token").get( authenticate.isAdmin,  AdminController.getQBORequestToken )
//get the form for admin to sign up student
router.route("/student_register/:course_id").get( authenticate.isAdmin,  AdminController.getStudentRegisterForm )
//get the form for admin to update student
router.route("/update/:course_id/:student_id").get( authenticate.isAdmin,  AdminController.getStudentUpdateForm )

module.exports = router
