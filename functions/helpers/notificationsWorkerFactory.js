const firebase = require("firebase")
const moment = require('moment')
const mailchimpClient = require('@mailchimp/mailchimp_transactional')( MANDRILL_API_KEY )
//create reference for firestore database
const db = firebase.firestore()

module.exports = {
  //send students who signed up in the last 6 months job openings created last 7 days
  notificationsWorkerFactory2: async () => {
    return {
      run: () => {
        //1. create time markers for the start and/or end of the week            
        const start = moment().subtract(7, 'day').startOf('day')
        const end = moment().subtract(1, 'day').endOf('day')
  
        //2.  get all jobs
        const allJobs = await db.collection('jobs')
                             .orderBy("created", "desc")
                             .get()

        //3.  filter jobs that have been created in the last 7 days
        const jobs = allJobs.filter(job => job.data().created >= start && job.data().created <= end )
                            .map(job => {
                              return {
                                id: job.id,
                                title: job.data().title,
                                name: job.data().facility_name
                              }
                            })

        if( jobs.length > 0 ) {
          //4.  create time marker of the last 6 months         
          const enrolledOn = moment().subtract(180, 'day').startOf('day')

          //5.  get all students who signed up in the last 6 months and send them job email notifications
          const allStudents = await db.collection('students')
                                .orderBy("enrolledOn", "desc")
                                .get()
 
          //6. filter students who enrolled within the last 6 months
          const students = allStudents.filter( x => x.data().enrolledOn >= enrolledOn )
 
          //7.  send students above jobs
          students.forEach( student => {
            
            await mailchimpClient.messages.sendTemplate({
              template_name: "daily-job-announcement",
              template_content: [],
              message: {
                from_email: 'jobs@excelcna.com',                        
                subject: `Daily CNA/Caregiver Job Openings`,                      
                track_opens: true,
                track_clicks: true,
                important: true,
                merge_language: "handlebars",
                merge_vars: [{
                    rcpt: student.data().email,
                    vars: [      
                        { name: 'JOBS', content:  jobs },
                        { name: 'STUDENT_NAME', content: student.data().first }                       
                    ]
                }],
                to: [
                    { email: student.data().email }
                ]
              }
            })      
          }) 
        }  
      }
    }
  },
  //read summary applicants to a job openings
  notificationsWorkerFactory3: () => {
    return {
      run: async () => {

         //1. create time markers for the start and/or end of the week            
        const start = moment().subtract(7, 'day').startOf('day')
        const end = moment().subtract(0, 'day').startOf('day')       
                                              
        //2.  get all jobs 
        const weekly_jobs =  await db.collection('jobs')
                                      .orderBy("created", "desc")
                                      .get()                                     
        
        //5. get jobs with more than 1 applicant and were posted within the last 7 days
        const jobs = weekly_jobs.filter( x => x.data().created >= start && x.data().created <= end )
                                .filter( x => x.data().applicants.length > 0 || x.data().propects.length > 0 )
                                .map( x => {
                                  return {
                                    id: x.id,
                                    title: x.data().title,
                                    facility_name: x.data().facility_name,
                                    applicants: x.data().applicants,
                                    prospects: x.data().propects,
                                    email: x.data().email
                                  }
                                })
  
        
        //send 
        await mailchimpClient.messages.sendTemplate({
          template_name: "student-applicant",
          template_content: [],
          message: {
              from_email: 'jobs@excelcna.com',                        
              subject: `Caregiver and CNA job applicants`,                      
              track_opens: true,
              track_clicks: true,
              important: true,
              merge_language: "handlebars",
              merge_vars: [{
                  rcpt: job.data().email,
                  vars: [
                      { name: 'JOBS', content: jobs },
                      { name: 'JOB_TITLE', content:  job.data().title },
                      { name: 'STUDENT_FULL_NAME', content: full_name },
                      { name: 'STUDENT_EMAIL', content: student.data().email },
                      { name: 'STUDENT_TEL', content: student.data().tel },
                      { name: 'COURSE', content: student.data().payments[0].course_name }                                
                  ]
              }],
              to: [
                  { email: job.data().email }
              ]
          } 
        }  
  
      }
    }
  }
}





//module.exports = notificationsWorkerFactory();