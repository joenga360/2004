const seo_page = require('../client_helpers/seo_page_info')
const moment = require("moment")
const { course_classifier } = require('../helpers/course_classifier.js')
const firebase = require('firebase')
//create reference for firestore database
const db = firebase.firestore()


/**
 * Log into admin to get a sense of all course schedule pages
 * There is a course transfer schedule for admin, student who did not start a class.  Is there one for employer? Delete it if it exists
 * Schedules should be for employer, admin and public
 * 
 * coursestudents view show a course table schedule which when clicked on leads to a roster of the course
 * are transferschedules identical to schedules?
 */

module.exports = {
    /**
     * get page to add courses 
     * @params: none
     * returns: Object containing seo information and course names
     */   
    addCourseView: (req, res, next ) => {
        //courses array - contains official names of courses
        const courses = [
            "Certified Nurse Assistant/CNA", 
            "DSHS Home Care Aide/75 Hours",
            "HCA to CNA Bridging", 
            "DSHS Nurse Delegation (CORE) for NAs and HCAs",
            "DSHS Nurse Delegation Special Focus on Diabetes",
            "DSHS Core Basic",
            "Adult CPR/First Aid/AED Course Skill Testing",
            "BLS Course Skill Testing",
            "DSHS 12 Hours Continuous Education Units",
            "DSHS Dementia Specialty",
            "DSHS Mental Health Specialty",
            "DSHS Safety and Orientation"
        ]
        //return the course view page
        res.render('admin/course/add', {  
            //csrfToken: req.csrfToken(), 
            seo_info: seo_page.admin_portal_seo_info, 
            courses: courses
        })
    },

    /**
     * get course schedules view for admin to enroll student 
     * params: String: 'add' or 'transfer' 
     * returns: array of courses starting today or later
     */

    getCourseSchedules: async (req, res, next) => {
        try{

            const today = moment().startOf('day').toDate()            

            const results = await db.collection('courses')                                        
                                    .orderBy('start_date')   
                                    .get()  

            const docs = results.docs

            const classes = docs.filter(doc => moment( doc.data().start_date.toDate() ).isAfter(moment(today)) )
                        .map(x=> {
                            start = x.data().start_date.toDate()
                            end = x.data().end_date ? x.data().end_date.toDate() : null
                        
                            return{                            
                                'end_date': end ? moment(end).format("MMM DD") : null, 
                                'name': x.data().name,                            
                                'start_date': moment(start).format("MMM DD"),
                                'type': x.data().type,
                                'id': x.id
                            }                        
                        })  

            if( classes.length > 0 ){            
                
                //return the course view page               
                res.render('admin/course/schedules', {
                    courses: course_classifier (classes),//groups courses by name, type e.g., CPR has even, day and weekend and BLS only day
                    choices: [
                        "Certified Nurse Assistant/CNA", 
                        "DSHS Home Care Aide/75 Hours",
                        "HCA to CNA Bridging", 
                        "DSHS Nurse Delegation (CORE) for NAs and HCAs",
                        "DSHS Nurse Delegation Special Focus on Diabetes",
                        "DSHS Core Basic",
                        "Adult CPR/First Aid/AED Course Skill Testing",
                        "BLS Course Skill Testing",
                        "DSHS 12 Hours Continuous Education Units",
                        "DSHS Dementia Specialty",
                        "DSHS Mental Health Specialty",
                        "DSHS Safety and Orientation"
                    ],                   
                    seo_info: seo_page.schedule_page_seo_info ,
                    transfer: req.params.type === 'transfer' ? true: false                             
                })
            }
            
        } catch(err) {
            console.log(err)
            res.status(500).json({
                message: `There has been an error getting the courses.`,
                err
            })
        }       

    },

    /**
     * get course view for admin to edit course dates
     * params: none
     * returns: page, seo information
     */
    editCourseView: (req, res, next ) => {
        res.render('admin/course/edit', { 
            // csrfToken: req.csrfToken(), 
            seo_info: seo_page.admin_portal_seo_info 
        })
    },

  
    getStudentRegisterForm: async ( req, res, next ) => {
        try{
             //get the course id
            const course_id = req.params.course_id           
            //find the course
            const results = await db.collection('courses').doc(course_id).get()
            //get the course data
            const course = results.data()
            //construct data about class - remove student array
            const data = {
                courseId: results.id,
                start_date: moment.utc(course.start_date.toDate()).tz('America/Los_Angeles').format("MMM D"),                                        
                end_date: course.end_date !== null ? moment.utc(course.end_date.toDate()).tz('America/Los_Angeles').format("MMM D")  : "",
                name: course.name,
                type: course.type
            }  
            //return the page with the relevant information
            res.render('admin/student/register', 
                                        { 
                                            // csrfToken: req.csrfToken(),
                                            update: false, 
                                            seo_info: seo_page.admin_portal_seo_info, 
                                            course: data, student: {} 
                                        })            

        } catch (error){
            console.log(error)
            throw(error)
        }        
    },
     /**
     * get student update form for admin to update student
     * params: String: course id, student id
     * returns: Object: course info, student info, seo info, page view
     */

    getStudentUpdateForm: async ( req, res, next ) => {
        try{          
            //get the student id
            const { course_id, student_id } = req.params  
            //find the course
            const courseQuery = await db.collection('courses').doc(course_id).get()
            //get the course data
            const course_results = courseQuery.data() 
            //find the student
            const studentQuery = await db.collection('students').doc(student_id).get()
            //get the course data
            const student_results = studentQuery.data()
            //construct data about student - remove payment array
            const student = {
                id: studentQuery.id,               
                address: student_results.address, 
                city: student_results.city, 
                comments: student_results.comments, 
                dob: student_results.dob ? moment.utc(student_results.dob.toDate()).format("YYYY-MM-DD"):"",
                email: student_results.email, 
                first: student_results.first, 
                last: student_results.last, 
                state: student_results.state, 
                status: student_results.status, 
                tel: student_results.tel, 
                zip: student_results.zip               
            }  
           
            //construct data about class - remove student array
            const course = {
                courseId: courseQuery.id,
                start_date: moment.utc(course_results.start_date.toDate()).tz('America/Los_Angeles').format("MMM D"),                                        
                end_date: course_results.end_date !== null ? moment.utc(course_results.end_date.toDate()).tz('America/Los_Angeles').format("MMM D")  : "",
                name: course_results.name,
                type: course_results.type
            }  
            //return the page with the relevant information
            res.render('admin/student/register', 
                                { 
                                    // csrfToken: req.csrfToken(),
                                    update : true, 
                                    seo_info : seo_page.admin_portal_seo_info, 
                                    student : student, 
                                    course : course 
                                })            

        } catch (error){
            console.log(error)
            throw(error)
        }        
    },
  
    /**
     * gets view to display student search results
     * params: none
     * returns: page, seo information
     */
    studentSearchResults: ( req, res, next ) => {
        res.render('admin/student/searchresults', { seo_info: seo_page.admin_portal_seo_info })
    },
    /**
     * get view for admin to transfer student from course to course 
     * params: none
     * returns: none
     */
    transferStudent: ( req, res, next ) => {
        res.render('admin/student/transferschedules', { seo_info: seo_page.admin_portal_seo_info })
    }   
}