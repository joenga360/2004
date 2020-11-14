const router = require('express-promise-router')()
const courseController = require('../controllers/course')
const authenticate = require("../helpers/authenticate")


router.route('/add').post(authenticate.isAdmin, courseController.addCourses)
router.route('/admin/:type').get(authenticate.isAdmin, courseController.getCourses)
router.route('/update').patch(authenticate.isAdmin, courseController.updateCourse)
router.route('/:course_id').get(authenticate.isAdmin, courseController.getCourseById)

module.exports = router