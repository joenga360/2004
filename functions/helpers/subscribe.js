const md5 = require('blueimp-md5')

const moment = require('moment-timezone')
const request = require('request')
const client = require("@mailchimp/mailchimp_marketing");

client.setConfig({
  apiKey: MAILCHIMP_API_KEY,
  server: "us4",
});


module.exports = {   
    //email, first, last, tel, course.name, course.start_date, course.end_date
    studentData: (email, first_name, last_name, tel, course, start_date, end_date, student_id, course_id) => {
        //format start date
        const start =  moment.utc(start_date.toDate()).format('MM/DD/YYYY')           
   
        //format end date
        const end =  end_date ? moment.utc(end_date.toDate()).format('MM/DD/YYYY') : null
        
        //construct and return data // tags,    
        return mc_data = {
               
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
    },



    /**
     * PARAMS: db_object: object of student status in database
     * PARAMS: client_object: object of student status in client
     * RETURNS: tag array with key from client_object with a value of true and a value of false in db_object
     */
    tagsDifference : (db_object, client_object) => {
        console.log("DB OBJECT ->", db_object)
        //create a tag array 
        let tags = []
        //select terms which to look for to insert in above tags array
        const terms = [ 'course_start', 'walk_in']
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
            url: 'https://us4.api.mailchimp.com/3.0/lists/' + STUDENT_LIST +'/members/' + email_hash +'/tags',
            method: 'POST',           
            headers: {
                Authorization: "auth " + MAILCHIMP_API_KEY,
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

    subscribe: async ( postData, list_id ) => {
        try {
             //stringify data
            // const data = JSON.stringify(postData)
            const response = await client.lists.addListMember(list_id, postData);
        
            console.log('SUBSCRIBE RESPONSE', response);


            // add a new member to the list
            // const add_new_member = {
            //     method: 'post',
            //     path: `/lists/${list_id}/members`,
            //     body: postData
            // }        

            // const results = await mailchimp.request( add_new_member )
            
            //  console.log('subscribe status code # 1 --> ', results.statusCode)
        
            // // console.log('subscribe status code # 2 --> ', results.status)    
        } catch (error) {
            console.log('ERROR --> ', error )
        }

       
        
       
          
    }
}
