const router = require('express-promise-router')()
const studentController = require('../controllers/student')
const authenticate = require("../helpers/authenticate")

//student registers self for a course on public site
router.route('/register/:code/:id').post( studentController.studentSelfCourseSignUp )
//admin registers a new student
router.route('/start/:course_id/:code').post( authenticate.isAdmin,  studentController.studentCourseSignUpByAdmin ) 
//admin updates a student 
router.route('/update/:course_id/:code').patch( authenticate.isAdmin,  studentController.studentUpdateByAdmin ) 
//admin transfers a student
router.route('/transfer').patch( authenticate.isAdmin,  studentController.transferStudent ) 
//admin unenroll a student
router.route('/unenroll/:student_id/:course_id').get( authenticate.isAdmin,  studentController.unenrollStudent ) 
//admin search a student
router.route('/search').post( authenticate.isAdmin,  studentController.searchStudent ) 

module.exports = router