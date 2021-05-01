const { all } = require("bluebird")
const firebase = require("firebase")
const moment = require('moment')
const mailchimpClient = require('@mailchimp/mailchimp_transactional')( MANDRILL_API_KEY )
//create reference for firestore database
const db = firebase.firestore()

//module.exports = {
  //Every Monday at 8:00 am, send students who signed up in the last 6 months job openings created last 7 days
  const notifyStudents = async () => {
   // return {
     // run: async () => {
        console.log('notifying students')
        //1. create time markers for the start and/or end of the week            
        const start = moment().subtract(7, 'day').startOf('day')
        const end = moment().subtract(1, 'day').endOf('day')
  
        //2.  get all jobs
        const allJobs = await db.collection('jobs')
                             .orderBy("created", "desc")
                             .get()
       allJobs.docs.forEach(x => console.log('ID -> ', x.data()))

      // let start =  moment(doc.data().start_date.toDate() )
        //3.  filter jobs that have been created in the last 7 days
        const jobs = allJobs.docs.filter(job => moment(job.data().created.toDate()).isAfter(start) 
                                                && moment(job.data().created.toDate()).isBefore(end) 
                                 ).map(job => {
                                  return {
                                    id: job.id,
                                    title: job.data().title,
                                    name: job.data().facility_name
                                  }
                                })
                            
        console.log('jobs in notifications ', jobs, 'and length: ', jobs.length )

        if( jobs.length > 0 ) {
          //4.  create time marker of the last 6 months         
          const enrolledOn = moment().subtract(180, 'day').startOf('day')

          //5.  get all students who signed up in the last 6 months and send them job email notifications
          const allStudents = await db.collection('students')
                                .orderBy("enrolledOn", "desc")
                                .get()
 
          //6. filter students who enrolled within the last 6 months
          const students = allStudents.docs.filter( x => moment(x.data().enrolledOn.toDate()).isAfter(enrolledOn) )
                                      .map(x => {
                                        return {
                                          name: `${x.data().first} ${x.data().last}`,
                                          email: `${x.data().email}`
                                        }
                                      })

          console.log('students ', students )

          return
 
          //7.  send students above jobs
          students.forEach( async (student) => {
            
            await mailchimpClient.messages.sendTemplate({
              template_name: "daily-job-announcement",
              template_content: [],
              message: {
                from_email: 'jobs@excelcna.com',                        
                subject: `CNA/Caregiver Job Openings In the Past Week`,                      
                track_opens: true,
                track_clicks: true,
                important: true,
                merge_language: "handlebars",
                merge_vars: [{
                    rcpt: student.email,
                    vars: [      
                        { name: 'JOBS', content:  jobs },
                        { name: 'STUDENT_NAME', content: student.name}                       
                    ]
                }],
                to: [
                    { email: student.email }
                ]
              }
            })      
          }) 
        }  
     // }
    //}
  }
  //Every Monday 8 a.m., send summary applicants and prospect  to a job openings
 const notifyEmployers = async () => {
    // return {
    //   run: async () => {

         //1. create time markers for the start and/or end of the week            
        const start = moment().subtract(7, 'day').startOf('day')
        const end = moment().subtract(0, 'day').startOf('day')   
        
        console.log('stupid start ', start, 'and end ', end )
                                              
        //2.  get all jobs 
        const weekly_jobs =  await db.collection('jobs')
                                      .orderBy("created", "desc")
                                      .get()                                     
        
        //5. get jobs with more than 1 applicant and were posted within the last 7 days
        const jobs = weekly_jobs.docs.filter( x => x.data().created >= start && x.data().created <= end )
                               // .filter( x => x.data().applicants.length > 0 || x.data().propects.length > 0 )
                                .map( x => {
                                  return {
                                    id: x.id,
                                    title: x.data().title,
                                    facility_name: x.data().facility_name,
                                    // applicants: x.data().applicants,
                                    // prospects: x.data().propects,
                                    email: x.data().email
                                  }
                                })
  
        console.log('jobs....', jobs )

        return
        //send 
        jobs.forEach(async(job) => {
          await mailchimpClient.messages.sendTemplate({
            template_name: "student-applicant",
            template_content: [],
            message: {
                from_email: 'jobs@excelcna.com',                        
                subject: `Weekly Caregiver and CNA job applicants`,                      
                track_opens: true,
                track_clicks: true,
                important: true,
                merge_language: "handlebars",
                merge_vars: [{
                    rcpt: job.email,
                    vars: [
                      { name: 'APPLICANTS', content: job.applicants },
                      { name: 'PROSPECTIVES', content: job.prospects },
                      { name: 'JOB_ID', content: job.id },
                      { name: 'ORGANIZATION', content: job.facility_name },
                      { name: 'TITLE', content: job.title }                                                       
                    ]
                }],
                to: [
                    { email: job.email }
                ]
            } 
          })
        })           
    //   }
    // }
  }


module.exports = notifyEmployers()
module.exports = notifyStudents()



//module.exports = { notifyEmployers() notifyStudents() }