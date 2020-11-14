const QuestionService = require('../client_helpers/QuestionService')
const SkillService = require('../client_helpers/SkillService')
const seo_page = require('../client_helpers/seo_page_info')
const campaign = require('../client_helpers/campaign')
const { registration_fee} = require('../client_helpers/courses.js')
const moment = require('moment-timezone')
const {course_classifier} = require('../helpers/course_classifier')
const { campaignText, courseName } = require('../client_helpers/campaign') 
const firebase = require("firebase")
const { getJobPostForm, getJobPreview } = require('./job')
const seo_page_info = require('../client_helpers/seo_page_info')
const db = firebase.firestore()


module.exports = {
    //1. Get the home page
    getHomePage: (req, res) => {
        res.set('Cache-Control', 'public, max-age=300, s-maxage=600')
        res.render('site/home', {seo_info: seo_page.home_page_seo_info})
    },
    //2. Get why post page
    getWhyPostPage: (req, res) => {
        res.render('site/whypost',  {seo_info: seo_page.whypost_page_seo_info})
    },
    //3. Get the questions page
    getQuestionsPage: (req, res) => {
        //construct quiz using 10 questions
        const quiz = new QuestionService(10)
        //randomize the questions
        quiz.randomizeQuestions()
    
        const questions = quiz.questions  
       
        const answerChoices = ['A', 'B', 'C', 'D']
       
        res.render('site/questions', { seo_info: seo_page.questions_page_seo_info, questions, answerChoices })                             
                                    
    },
    //4. Get the employer sign in page
    getSignInPage: (req, res) => {
        res.render('site/signin', { seo_info: seo_page.signin_page_seo_info })
    },
    //5. Get the employer sign up page
    getSignUpPage: (req, res) => {
        const campaignText = campaign.campaignText.recruit
        // const campaignText = campaignText["recruit"]["header"]
        res.render('site/leadsignup', {campaignText: campaignText, seo_info: seo_page.signup_page_seo_info})    
        //res.status(200).json({campaignText})
    },    
    //7. Get the course registration form
    getCourseRegistrationForm: async (req, res) => {    
        try {  
            console.log('params --> ', req.params)
            //get the course id
            const { course_id, course }  = req.params  
            //find the course
            const query = await db.collection('courses').doc(course_id).get()
            //construct data about class - remove student array
            const results = query.data()
           // console.log("COURSE -> ", results)

            const data = {
                courseId: query.id,                                                
                start_date: moment(results.start_date.toDate()).tz('America/Los_Angeles').format("MMM D"),                                        
                end_date: results.end_date !== null ? moment(results.end_date.toDate()).tz('America/Los_Angeles').format("MMM D")  : "",
                name: results.name,
                type: results.type
            }      
            
            const lead = course != undefined ? true : false
            console.log('LEAD IS -> ', lead)
            res.render('site/studentsignup', 
                        {  
                            seo_info: seo_page.register_page_seo_info, 
                            lead: lead,
                            course: data,
                            fees: registration_fee,
                            STRIPE_PUBLIC_KEY: STRIPE_PUBLIC_KEY
                        })
            
        } catch (error) {
            console.log(error)
            // throw error(error)
        }      
    },
    //8. Get the receipt page
    getReceiptPage: (req, res) => {
        res.set('Cache-Control', 'public, max-age=300, s-maxage=600')
        res.render('site/success', { seo_info: seo_page.payment_page_seo_info })
    },
    //9. Get the videos page
    getVideosPage: (req, res) => {
        
        const skill_videos = new SkillService()
    
        skill_videos.randomizeSkills()
    
        const cna_videos = skill_videos.allVideos//.slice(0,8)
    
        var videos = []
        var chunkSize = 3
        for (var i = 0; i < cna_videos.length; i += chunkSize) {
            videos.push(cna_videos.slice(i, i + chunkSize))
        }
    
        res.render('site/videos', {videos: videos, seo_info: seo_page.videos_page_seo_info})
        //res.status(200).json({videos})
    },
    //10. Get the employer sign in page
    getAdminSignInPage: (req, res) => {
        res.set('Cache-Control', 'public, max-age=300, s-maxage=600')
        res.render('site/adminsignin', {seo_info: seo_page.admin_signin_page_seo_info })
    },
    //11. Get the employer sign up page
    getAdminSignUpPage: (req, res) => {
        res.set('Cache-Control', 'public, max-age=300, s-maxage=600')
        const campaignText = campaign.campaignText.recruit
       // const campaignText = campaignText["recruit"]["header"]
        res.render('site/adminsignup', { campaignText: campaignText, seo_info: seo_page.admin_signup_page_seo_info })    
        //res.status(200).json({campaignText})
    },   
    
    //12. Get CNA lead course schedule page
    getLeadCourses: async ( req, res ) => {          
        try{     
           
            res.set('Cache-Control', 'public, max-age=300, s-maxage=600')                                 
            
            //get start of today
            const today = moment().startOf('day')
            //get the long name of course stored in database
            const course_name = courseName(req.params.name)

            console.log('COURSE NAME -> ', course_name)
            //get courses by name 
            const results = await db.collection('courses') 
                                .where('name','==', `${course_name}` )                                       
                                .orderBy('start_date')   
                                .get()  
            //
            const docs = results.docs

            //sort the docs to get classes starting today or later
            const classes = docs.filter( doc => moment( doc.data().start_date.toDate() ).isSameOrAfter(today) && doc.data().name === course_name)
                                .map( doc => {                                    
                                    return{                            
                                        'end_date': doc.data().end_date ? moment(doc.data().end_date.toDate()).format("MMM DD") : null, 
                                        'name': doc.data().name,                            
                                        'start_date': moment(doc.data().start_date.toDate()).format("MMM DD"),
                                        'type': doc.data().type,
                                        'id': doc.id
                                    }                        
                                }) 
                   
            //classify the courses as either day, evening, weekend
            const courses = course_classifier( classes )                
            //get a random number between 1 and 4 - includes both 1 & 4
            const number = Math.floor( Math.random() * 4 + 1)
        
            //get the header of campaign information 
            const header = req.params.name === 'cna' ?  campaignText['CNA']['headers'][number] : campaignText[req.params.name].header
            //get the lists of CNA campaign lists
            const items = req.params.name === 'cna' ? campaignText['CNA']['lists'][number] : campaignText[req.params.name].items
            //return classes, seo information and campaign information
            console.log('classes -> ', classes.length)
            if( classes.length > 0 ){
                res.locals.lead = true
                res.render('site/leadcourseschedules', {
                //res.status(201).json({
                    course: courses[req.params.name],
                    name: course_name,
                    items: items,
                    header: header,                   
                    seo_info: seo_page[req.params.name + "_page_seo_info"]                                              
                })

            }else{
                res.status(404).json({
                    message: `No ${course_name} courses at the moment.  Check with us later.`
                })
                //req.flash("error", "No courses at the moment.")

               // res.redirect('/')             
            }            
        }catch(err){
            console.log(err)
            res.status(500).json({
                message: `There has been an error getting the courses.`,
                err
            })
        }  
    }, 
    
    getCourses: async (req, res, next) => { 
        try {
            res.set('Cache-Control', 'public, max-age=300, s-maxage=600')
            const today = moment().startOf('day').toDate()            

            const results = await db.collection('courses')                                        
                                    .orderBy('start_date')   
                                    .get()  

            const docs = results.docs

            const classes = docs.filter(doc => moment( doc.data().start_date.toDate() ).isSameOrAfter(moment(today)) )
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

           
            if(classes.length > 0 ) {
                //res.status(201).json({message: "Future public courses", courses: course_classifier(classes) })
                res.render('site/schedule', {
                    classes:  course_classifier(classes),
                    choices: ["CNA", "HCA-CNA Bridging", "Adult CPR/FA", "Basic Life Support (BLS)"],                                       
                    seo_info: seo_page.schedule_page_seo_info                                         
                })
            }          
        } catch (error) {
            console.log(error)
        }
    },
 
}