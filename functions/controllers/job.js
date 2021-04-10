const firebase = require("firebase")
const moment = require('moment')
//create reference for firestore database
const db = firebase.firestore()
const seo_page = require('../client_helpers/seo_page_info')
const { employerData, subscribe  } = require("../helpers/subscribe")
const sgMail = require('@sendgrid/mail')
const { courses_landing_seo_info } = require("../client_helpers/seo_page_info")
sgMail.setApiKey(SENDGRID_API)
const mailchimpClient = require('@mailchimp/mailchimp_transactional')( MANDRILL_API_KEY )


module.exports = {

    //read all the jobs and profiles
    allJobs: async(req, res, next)=>{        
        try{             
            //get all the jobs from all users in descending order - recent posts get listed highest
            const allJobs = await db.collection("jobs")
                                    .orderBy("created", "desc")
                                    .get()

            const dBjobs = allJobs.docs
   
            //jobs to be viewed by public
            const jobs = dBjobs.map( x => {
                            return {
                                id : x.id,                              
                                created : moment( x.data().created.toDate() ).format("MMM DD"),                             
                                title: x.data().title                                
                            }                
                        })
                                   
            console.log('jobs ', jobs)
            //res.status(200).json({jobs})
            res.render('site/jobs', { jobs: jobs, seo_info: seo_page.jobs_page_seo_info })              

        }catch(error){
            console.log(error)         
        }
    },
    //apply to a job
    applyJob: async( req, res, next ) => {
        try{
           console.log('are we getting here......', req.body)
            //get data from front end
            const { name, tel, email, certifications, id } = req.body
            //make sure 
            if( !email || !tel || !name ){
                return res.status(404).json({
                    message: 'You must enter name, tel, and name.'
                })                
            }        
            //find job using id
            const job = await db.collection('jobs').doc( id ).get()
            //check if the applicant has applied to this job
            const existing =  job.data().applicants.filter( x => x.name === name && x.email === email)
          
            //if the applicant has not applied, submit application
            if( existing.length > 0 ){
                return res.status(404).json({
                    'message': 'We see you have submitted an application for this job.  Search for another job to apply for.',
                    'success': false,
                    'redirect': false,
                    'url': '/job/all'
                })
                
            } else {

                //get the applicants array
                const applicants = job.data().applicants
                //add the new applicant to the applicants array
                applicants.unshift(
                    {
                        submitted : firebase.firestore.Timestamp.fromDate(new Date()), 
                        name,
                        tel,
                        email,
                        certifications
                    }
                )
                
                console.log('We are in else....', MANDRILL_API_KEY)
                //const num = existing + 1

                const response = await mailchimpClient.messages.sendTemplate({
                    'template_name': "simple-plain-email",
                    'template_content': [{
                        'name': 'body-table',
                        'content': '<tbody><tr><td valign="top" class="mcnTextContent" style="padding: 0px 18px 9px;color: #222222;font-family: Georgia, Times, " times="" new="" roman",="" serif;"=""><span style="font-size:14px"><span style="font-family:roboto,helvetica neue,helvetica,arial,sans-serif"><strong>Dear *|FNAME|*,</strong><br><br>Thanks for registering for our *|COURSE|* class.  To complete the registration, come to our office and take the math and English entrance exam (it is easy) or bring transcripts you have more than 30 college credits and pay the registration fee if you have not done so yet. <br><br> You will also collect *|COURSE|*  learning resources such as the text book, homework/question packets, abbreviation and definition worksheets.<br><br><strong><a href="https://www.doh.wa.gov/LicensesPermitsandCertificates/ProfessionsNewReneworUpdate/ApplyOnline/OnlineInstructions" target="_blank">Apply</a></strong> for NAR license<span style="color:#FF0000"><strong> IMMEDIATELY</strong></span>.  NAR will allow you to meet your clinical rotation requirements - the sooner you have your NAR the better you will be.  <br><br>See you soon!  </span></span></td></tr></tbody>'
                    }],
                    'message': {
                        'subject': 'Candidate application',
                        'from_email': 'jobs@excelcna.com',
                        'track_opens': true,
                        'track_clicks': true,
                        'important': true,
                        // 'merge_vars': {
                        //     rcpt: 'ngatuna05@gmail.com',
                        //     vars: [
                        //         { name: FNAME, content:'Don' },
                        //         { name: COURSE, content: 'CNA'}
                        //     ]
                        // },
                        to: [
                            {email: 'training@excelcna.com', name: 'Don Gatuna'}
                        ]
                    },
                });

                console.log('MANDRILL RESPONSE ---> ', response)

                // const msg = {
                //     to: `${ job.data().email }`,
                //     from: 'training@excelcna.com', 
                //     subject: `Caregiver #${num} : ${ job.data().title }`,//'Sending with Twilio SendGrid is Fun',
                //     text: 'Here is a caregivers/CNAs interested in your position:',
                //     html: `<ul><li>${ name }</li><li>Tel: ${ tel } Email: ${ email } </li> <li> ${ certifications }</li></ul>`,
                // }

                // await sgMail.send(msg)

                await db.collection('jobs').doc(id).update({
                    applicants
                })

                return res.status(200).json({
                    'message': 'You have submitted your application.',
                    'success': true,
                    'redirect': true,
                    'url': '/job/all'
                })
                
            }
        }catch(error){
            console.log("Stupid error ", JSON.stringify(error))
        }       
    },   
    //delete a job
    deleteJob: async(req, res, next)=>{
        
        try{
           
            const result = await Job.remove({_id: req.params.id})

            if(result.ok){
                //res.render('employer/jobs/listuserjobs', { seo_info: seo_page.jobs_page_seo_info })

                return res.status(200).json({
                    "redirect":true,
                    message: "The job has been removed"
                })
               
            }

        }catch(error){
            res.status(500).json({
                message: "There has been an error deleting your job",
                error
            })
        }
    },
    //get job applicants
    getJobApplicants: async(req, res, next) => {
        
        try{            
            //const id = 
            const job = await Job.findById( req.params.job_id )
     
            //create a job post without all the job details saved in the database
            const jobPost = {
                applicants: job.applicants,
                compensation: job.compensation,
                contact: job.contact,
                description: job.description,
                location: job.location,
                requirements: job.requirements,
                schedule: job.schedule,
                title: job.title,
                name: job.name
            }
      
            if(job){
                //res.status(200).json({ jobPost })
                res.render('employer/jobs/viewapplicants', { jobPost: jobPost, seo_info: seo_page.jobs_page_seo_info })
            }
            
        }catch(error){
            console.log(error)
            res.status(500).json({
                message: "There has been an error in your request",
                error
            })
        }
    },
    //get receipt page after job post
    getPostReceipt: async (req, res) => {
        try {
            res.render('employer/jobs/checkoutreceipt', { seo_info: seo_page.jobs_page_seo_info })
        } catch (error) {
             console.log(error)
        }
    },
    //create a job
    postJob: async( req, res ) => {
        console.log(`req body ${JSON.stringify(req.body)}`)
        //get the job post and poster details
        const { 
                address, compensation, description, requirements, email, facility_name, schedule, settings,
                tel,  title,
            } = req.body   
        //check if the employer offers reimbursement    
        const reimbursement = req.body.reimbursement ? req.body.reimbursement : "" 
        //check if the employer offers in house training
        const inhouse_training = req.body.inhouse_training ? req.body.inhouse_training : ""
        //check if the employer can be a clinical site
        const clinical = req.body.clinical ? req.body.clinical : ""

        try{ 
            // save job post in the collection
            const result = await db.collection('jobs').add({
                created : firebase.firestore.Timestamp.fromDate(new Date()),
                address, clinical, compensation, description, requirements, schedule, title,
                facility_name, email, tel, settings, reimbursement, inhouse_training,
                applicants: []
            })

            //subscribe employer to the employer e-mail list
            await subscribe (EMPLOYER_LIST, employerData(email, settings, facility_name, tel ))

            //send back           
            res.status(201).json({
                success: true,
                url: '/job/receipt',
                redirect: true,
                message: 'Your job post announcement has been successfully created!',
                id: result.id
            }) 

// v=spf1 include:_spf.google.com include:spf.mandrillapp.com ~all
	
// "v=spf1 include:_spf.firebasemail.com include:spf.mandrillapp.com ~all"
                                                       
        }catch(error){
            console.log(error)
            res.status(500).json({                
                message: "There has been an error saving your job",
                redirect: false,
                url: '/job',
                error
            })
        }
    },       
   
    //view single job for by an employer
    viewJobById: async(req, res, next) => {
        
        try{            
            //query the job collection using id
            const jobPost = await db.collection('jobs').doc(req.params.id).get()
            //create a job post without all the job details saved in the database

            const job = jobPost.data()
            console.log('job ', job)
      
            if(job){
                //res.status(200).json({ jobPost })
                res.render('employer/jobs/viewjob', 
                                { 
                                    jobPost: job, 
                                    id: req.params.id, 
                                    seo_info: seo_page.jobs_page_seo_info 
                                }
                            )
            }
            
        }catch(error){
            res.status(500).json({
                message: "There has been an error in your request",
                error
            })
        }
    },  

    /**
     * GET JOB PAGES
    */
   //get checkout page
    checkout: async ( req, res, next ) => {
        res.render('employer/jobs/checkout', {
            seo_info: seo_page.jobs_page_seo_info,
            STRIPE_PUBLIC_KEY: STRIPE_PUBLIC_KEY
        })
    },

    //get job posting page
    getJobPostForm: ( req, res, next ) => {
        res.render('employer/jobs/postjob', {seo_info: seo_page.jobs_page_seo_info})
    },
    //get job posting tips
    getJobPostingTips:(req, res, next) => {
        res.render('employer/jobs/jobtips', {seo_info: seo_page.jobs_page_seo_info})
    },
    //get job editing page
    getJobEditForm: async ( req, res, next ) => {
        try{            
            //const id = 
            const job = await Job.findById( req.params.id )
            //create a job post without all the job details saved in the database
            const jobPosting = {
                compensation: job.compensation,
                contact: job.contact,
                description: job.description,
                location: job.location,
                requirements: job.requirements,
                schedule: job.schedule,
                title: job.title,
                name: job.name,
                _id: job._id
            }
      
            if(job){
                //res.status(200).json({ jobPost })
                res.render('employer/jobs/editjob', { jobPosting: jobPosting, seo_info: seo_page.jobs_page_seo_info })
            }
            
        }catch(error){
            res.status(500).json({
                message: "There has been an error in your request",
                error
            })
        }

       // res.render('employer/jobs/editjob', {seo_info: seo_page.jobs_page_seo_info})
    },

    getJobPreview:  (req, res, next) => {
        res.render('employer/jobs/previewjob', {seo_info: seo_page.jobs_page_seo_info})
    },

    getJobReceipt:  (req, res, next) => {
        res.render('employer/jobs/checkoutreceipt',  {seo_info: seo_page.jobs_page_seo_info})
    },
    
    getJobContact:  (req, res, next) => {
        res.render('employer/jobs/contact',  
            {
                seo_info: seo_page.jobs_page_seo_info,
                //csrfToken: req.csrfToken()
            })
    }
    
}