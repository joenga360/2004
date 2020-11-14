const express = require('express')
const router = require("express-promise-router")()
const CourseController = require('../controllers/course')
const SiteController = require('../controllers/site')

//get home page
router.get('/',  SiteController.getHomePage)
//get the employer sign in page
router.get("/admin/signin",  SiteController.getAdminSignInPage)
//get the employer sign up page
router.get("/admin/signup", SiteController.getAdminSignUpPage)
//get courses for the general site page
router.get('/courses', SiteController.getCourses)
//get the questions page
router.get("/questions", SiteController.getQuestionsPage)
//receipt page after waitlisting for a course 
router.get('/success', SiteController.getReceiptPage)
//receipt page after receipt of payment for course sign up
router.get('/confirm-payment', SiteController.getReceiptPage)
//get the the videos page
router.get("/videos", SiteController.getVideosPage)
//get lead page for other courses
router.get('/course/:name',  SiteController.getLeadCourses)
//get lead page for courses
router.get('/register/:course/:course_id', SiteController.getCourseRegistrationForm)
//get regular sign up page
router.get('/signup/:course_id', SiteController.getCourseRegistrationForm)

module.exports = router