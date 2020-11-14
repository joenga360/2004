const moment = require('moment-timezone')
const request = require('request')
const md5 = require('blueimp-md5')

module.exports = {   
    //email, first, last, tel, course.name, course.start_date, course.end_date
    studentData: (email, first_name, last_name, tel, course, start_date, end_date, student_id, course_id) => {
        //format start date
        const start =  moment.utc(start_date).format("MM/DD/YYYY")        
        //gutsy - tag subscriber
        // const tags = module.exports.tag(status) //.employerData()
   
        //format end date
        const end =  end_date ? moment.utc(end_date).format("MM/DD/YYYY") : null
     
        //construct data // tags,    
        const mc_data = {
                members: [
                    {
                        email_address: email,     
                        status: 'subscribed',
                       // tags,                  
                        merge_fields: {
                            FNAME: first_name,
                            LNAME: last_name,
                            PHONE: tel,
                            COURSE: course,
                            START: start,
                            END: end,
                            USER_ID: student_id, //user_id is used in the URLs found in transfer and post registration email bodies
                            COURSE_ID: course_id //user_id is used in the URLs found in transfer and post registration email bodies
                        }
                    }
                ]
        }

        return mc_data
    },

    /**
     * PARAMS: db_object: object of student status in database
     * PARAMS: client_object: object of student status in client
     * RETURNS: tag array with key from client_object with a value of true and a value of false in db_object
     */
    tagsDifference : (db_object, client_object) => {
        console.log("DB OBJECT ->", db_object)
        //create a tag array 
        const tags = []
        //select terms which to look for to insert in above tags array
        const terms = [ 'contact_made', 'course_start', 'walk_in', 'sponsored']
        //loop through student status database object
        for (let [key, value] of Object.entries(db_object)) {         
           
            //use keys because keys are identical in both client status and database status objects   
            //find difference in value between client status object and database status object using key
            if(terms.includes(key) && client_object[key] !== db_object[key]){               
                //get the key whose value in client status object is different from value in database status object
                //tags.push(db_key)          
                tags.push({"name": key, "status" : "active"})                
            }            
        }

        //return array if it has a length greater than 0
        if( tags.length > 0 ){ 
            //console.log('TAGS ', tags)
            return tags 
        } 
    },     
    
    /**
     * PARAMS: email : string, tags : array
     * hashes the email and tags student 
     * RETURN: No value
     */
    tagStudent: (email, tags) => {
        //get the email hash
        const email_hash = md5(email)
        console.log('EMAIL HASH ', email_hash)
        //create data to send to mailchimp API
        const data = JSON.stringify(tags)
        const options = {
            url: 'https://us4.api.mailchimp.com/3.0/lists/' + process.env.STUDENT_LIST +'/members/' + email_hash +'/tags',
            method: 'POST',           
            headers: {
                Authorization: "auth " + process.env.MAILCHIMP_API_KEY,
                "Content-Type" : "application/json"
            },
            body: data
        }
        //send data to mailchimp api
        request (options, (err, response, body) => {
            if(err) {
                console.log('ERROR #1',err)
                //return err
            } else {
                console.log('RESPONSE STATUS CODE -> ', response.statusCode)
                if (response.statusCode === 200) {
                    //return response
                    console.log(response)
                    //next()
                } else {
                    console.log('ERROR #2',err)
                   // return err
                }
            }
        }) 
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

    segment: async (email, segment_id, list_id ) => {
        //create an array to create posting body data 
        
        const data = {
            email_address : email
        } 

       
        //add body
       // const data = add ? members_to_add.push(email)  :  members_to_remove.push(email)
        console.log('JSON stringify data ->', data )
        const options = {
            url: 'https://us4.api.mailchimp.com/3.0/lists/' + list_id +'/segments/' + segment_id +'/members',
            method: 'POST',           
            headers: {
                Authorization: "auth " + process.env.MAILCHIMP_API_KEY,
                "Content-Type" : "application/json"
            },
            body: JSON.stringify(data)
        }
        //send data to mailchimp api
        request (options, (err, response, body) => {
            if(err) {
                console.log('ERROR #1',err)
                //return err
            } else {
              
                if (response.statusCode === 200) {
                    //return response
                    console.log('SEGMENT', response)
                    console.log("Every ok....")
                    //next()
                } else {
                    console.log('ERROR #2',err)
                   // return err
                }
            }
        })  
    },

    //a function that returns id to subscribe tor
    segmentURL: ( amount, name ) => {
        if(amount === 0 ){
            //return type of student as one who chooses to be waitlisted for any courses
            return 1709432              
        } else if (amount > 0 || amount <= 75) {
            //return type of student as one who pays $ 75.00 registration fees for HCA-CNA Bridging and CNA
            if(name === "Basic Life Support (BLS)"){
                return 1709440   
            }
            return 1709500                     
        } else {
             //return student as one who makes who pays for the course or makes a big chunk of payment
             //includes students who pay $ 65.00 for BLS and $ 80.00 for CPR/First Aid
            return 1709440            
        }
    },

    subscribe: async (postData, list_num) => {
        const data = JSON.stringify(postData)
        
        const options = {
            url: 'https://us4.api.mailchimp.com/3.0/lists/' + list_num,
            method: 'POST',           
            headers: {
                Authorization: "auth " + process.env.MAILCHIMP_API_KEY,
               "Content-Type" : "application/json"
            },
            body: data             
        }
        //send data to mailchimp api
        request (options, (err, response, body) => {
            if(err) {
                console.log('ERROR #1',err)
                //return err
            } else {
                console.log('RESPONSE ', response.statusCode )
                if (response.statusCode === 200) {
                    //return response
                    //console.log(response)
                    console.log("All is well in subscribe...")
                    //next()
                } else {
                    console.log('ERROR #2',err)
                   // return err
                }
            }
        })       
    }
}
