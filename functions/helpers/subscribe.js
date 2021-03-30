const md5 = require('md5')
const moment = require('moment-timezone')
const client = require("@mailchimp/mailchimp_marketing");


client.setConfig({
  apiKey: MAILCHIMP_API_KEY,
  server: "us4",
})


module.exports = {   
    //email, first, last, tel, course.name, course.start_date, course.end_date
    studentData: (email, first_name, last_name, tel, course, start_date, end_date, student_id, course_id, tags, code) => {
        //format start date
        const start = (start_date != 'Reserve') ? moment.utc(start_date.toDate()).format('MM/DD/YYYY') :   
                                                  moment.tz(moment(), "America/Los_Angeles").format("MM/DD/YYYY")     
   
        //format end date
        const end =  end_date ? moment.utc(end_date.toDate()).format('MM/DD/YYYY') : null
     
        //construct and return data // tags,    
        return mc_data = {               
            email_address: email,     
            status: 'subscribed',
            tags,                  
            merge_fields: {
                FNAME: first_name,
                LNAME: last_name,
                PHONE: tel,
                COURSE: course,
                START: start,
                END: end,
                CODE: code,
                USER_ID: student_id, //user_id is used in the URLs found in transfer and post registration email bodies
                COURSE_ID: course_id //user_id is used in the URLs found in transfer and post registration email bodies
            }              

        }
    },  

    /**
     * @param: Array of objects, string
     * @returns: Nothing
     */
    
    //email 
    updateStudentTags : async ( email, tags ) => {
        try {
            await client.lists.updateListMemberTags(
                STUDENT_LIST,
                md5(email.toLowerCase()),
                { tags }
            )

        } catch (error) {
            //console log the error
            console.log(error)     
        }        
    },
   
    employerData: ( email, settings, org_name, tel ) => {
        // Construct req data
        const mc_data = {
            email_address: email,
            status: 'subscribed',
            tags: settings,                          
            merge_fields: {
                NAME: org_name,
                PHONE: tel
            }        
        }

        return mc_data
    },

    //a function that returns id to subscribe to
    segmentURL: ( amount, name, course_start ) => {

        if(course_start){
            return 1709440 
        }

        if(amount === 0 ){
            //return type of student as one who chooses to be waitlisted for any courses
            return 4438132   //waitlist         
        } else if (amount > 0 && amount <= 75) {
            //return type of student as one who pays $ 75.00 registration fees for HCA-CNA Bridging and CNA
            if(name === "BLS Course Skill Testing" || name === "Adult CPR/First Aid/AED Course Skill Testing"){
                return 1709440   //
            }
            return 1709500                     
        } else {
             //return student as one who makes who pays for the course or makes a big chunk of payment
             //includes students who pay $ 65.00 for BLS and $ 80.00 for CPR/First Aid
            return 1709440            
        }
    },

    subscribe: async ( list_id, postData ) => {
        try {            
            // const data = JSON.stringify(postData)
            await client.lists.addListMember( list_id, postData )    
          
        } catch (error) {
            console.log('ERROR --> ', error )
        }         
    }
}
