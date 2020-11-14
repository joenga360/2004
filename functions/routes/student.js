const router = require('express-promise-router')()
const studentController = require('../controllers/student')
const authenticate = require("../helpers/authenticate")

//student registers self for a course on public site
router.route('/register/:course_id').post( studentController.studentSelfCourseSignUp )
//admin registers a new student
router.route('/start/:course_id').post( /*authenticate.isAdmin, */ studentController.studentCourseSignUpByAdmin ) 
//admin updates a student 
router.route('/update/:course_id').patch( authenticate.isAdmin,  studentController.studentUpdateByAdmin ) 
//admin transfers a student
router.route('/transfer').patch( authenticate.isAdmin,  studentController.transferStudent ) 

module.exports = router