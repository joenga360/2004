const md5 = require('md5')
const moment = require('moment-timezone')
const request = require('request')
const client = require("@mailchimp/mailchimp_marketing");
const { codeName } = require('./course_classifier');


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
        console.log('start-date ', start_date, 'start ', start)
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
            console.log('object ', tags, 'hash', md5(email.toLowerCase()), 'and email ', email, 'and student list ', STUDENT_LIST)
            const response = await client.lists.updateListMemberTags(
                STUDENT_LIST,
                md5(email.toLowerCase()),
                { tags }
            )

            console.log('fucking mailchimp responses', response)
        } catch (error) {
            //console log the error
            console.log(error)     
        }        
    },


   
    employerData: (email, org_name) => {
         // Construct req data
        const mc_data = {
            members: [
                {
                    email_address: email,
                    status: 'subscribed',
                    merge_fields: {
                        NAME: org_name,
                    }
                }
            ]
        }

        return mc_data
    },
    /**
     * PARAMS: student status object about student - contact_made, course_start, walk_in, sponsored  
     * loop the object to find object keys whose value is true
     * RETURN: array of keys whose value is true
     */
    tag: (object1) => {
         //create a tag array to store tags          
        const tags = [] 
        //return empty array if the object is null
        if(Object.keys(object1).length === 0 ) return tags
       
        for (let [key, value] of Object.entries(object1)) {
            //if value is true, push key to tags array
            if(value === true){ tags.push({"name": key, "status": "active"}) }
        }
        console.log("TAGS ", tags)
        //return tags array
        return tags     
    },

    segment: async ( email, list_id, segment_id ) => {
        try {
            const response = await client.lists.createSegmentMember(
                list_id,
                segment_id,
                { email_address: email }
            )
    
            console.log( 'SEGMENT RESPONSE', response )   
        } catch (error) {
            console.log( 'SEGMENT ERROR -> ', error )
        }       
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

    subscribe: async ( postData, list_id ) => {
        try {
             //stringify data
            // const data = JSON.stringify(postData)
            const response = await client.lists.addListMember(list_id, postData);
        
            console.log('SUBSCRIBE RESPONSE', response.status, 'and', response.statusCode)
          
        } catch (error) {
            console.log('ERROR --> ', error )
        }

       
        
       
          
    }
}
