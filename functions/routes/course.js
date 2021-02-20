const router = require('express-promise-router')()
const courseController = require('../controllers/course')
const authenticate = require("../helpers/authenticate")

//route to add a course
router.route('/add')
      .post(authenticate.isAdmin, courseController.addCourses)

//gets the courses by type - past, present or future
router.route('/admin/:type')
      .get(authenticate.isAdmin, courseController.getCourses)

//updates course dates
router.route('/update')
      .patch(authenticate.isAdmin, courseController.updateCourse)

//gets course by id and type
router.route('/:code/:course_id')
      .get(authenticate.isAdmin, courseController.getCourseById)

module.exports = router