const router = require("express-promise-router")()
const JobController = require('../controllers/job')

//get job post form for employer
router.route('/').get(JobController.getJobPostForm)
//get job post preview for employer
router.route("/preview").get(JobController.getJobPreview)
//get job post preview for employer
router.route("/contact").get(JobController.getJobContact) 
//get single job post
router.route("/view/:id").get(JobController.viewJobById)
//get all job posts
router.route('/all').get(JobController.allJobs)
//get all job posts
router.route('/receipt').get(JobController.getPostReceipt)
//create a job post
router.route('/').post(JobController.postJob)
//create a job post
router.route('/apply').post( JobController.applyJob )

module.exports = router