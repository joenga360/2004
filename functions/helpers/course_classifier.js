const moment = require('moment-timezone')
const { courseName } = require('../client_helpers/campaign') 
const firebase = require("firebase")
const db = firebase.firestore()


module.exports = {
/**
 * @params: array
 * returns an object containing arrays
*/
    course_classifier: (coursesArray) => {
       //Filter courses array using course_id, start_date and end_date        

        const courses =  coursesArray.map( course => {                             
            return {
                courseId: course.id,                                                
                start_date: course.start_date,                                        
                end_date: course.end_date !==null ? course.end_date : null,
                name: course.name,
                type: course.type
            }
        })
     
        console.log('THE COURSES ARRAY', courses )
       
        return {            
       
            cna : {
                day_courses : courses.filter(course => course.name === "Certified Nurse Assistant/CNA" || course.name == "CNA" && course.type === "Day"),
                evening_courses : courses.filter(course => course.name === "Certified Nurse Assistant/CNA" || course.name == "CNA"  && course.type === "Evening"),
                weekend_courses: courses.filter(course => course.name === "Certified Nurse Assistant/CNA" || course.name == "CNA"  && course.type === "Weekend")
            }, 

            hca : {
                day_courses : courses.filter(course => course.name === "DSHS Home Care Aide/75 Hours"  && course.type === "Day"),
                weekend_courses: courses.filter(course => course.name === "DSHS Home Care Aide/75 Hours" && course.type === "Weekend")
            },

            bridging : {
                day_courses : courses.filter(course => course.name === "HCA to CNA Bridging" && course.type === "Day"),                
                weekend_courses: courses.filter(course => course.name === "HCA to CNA Bridging" && course.type === "Weekend")                                        
            },            
            
            mh : {
                day_courses : courses.filter(course => course.name === "DSHS Mental Health Specialty" && course.type === "Day"),
                weekend_courses: courses.filter(course => course.name === "DSHS Mental Health Specialty" && course.type === "Weekend")
            },

            so : {
                day_courses : courses.filter(course => course.name === "DSHS Safety and Orientation" && course.type === "Day"),
                weekend_courses: courses.filter(course => course.name === "DSHS Safety and Orientation" && course.type === "Weekend")
            },

            dementia : {
                day_courses : courses.filter(course => course.name === "DSHS Dementia Specialty" && course.type === "Day"),
                weekend_courses: courses.filter(course => course.name ===  "DSHS Dementia Specialty" && course.type === "Weekend")
            },

            ceu : {
                day_courses : courses.filter(course => course.name === "DSHS 12 Hours Continuous Education Units" && course.type === "Day"),
                weekend_courses: courses.filter(course => course.name ===  "DSHS 12 Hours Continuous Education Units" && course.type === "Weekend")
            },

        }
    },
/**
 * @params: array of strings
 * return array of objects - each object contains course_type (eve, day, or weekend), course_name (cna, bls...), course start and end date
 */
    addCourses: ( course_array, course_name, course_type ) => {
        //return an empty object if course array has no dates
        if(course_array.length === 0) return []
        //loop through the course array 
        const courses = course_array.map(dates => {
            console.log('dates in map ', dates)
            if( dates !== ''){
                //get present year to append to class dates
                const year = moment().year()      
                    
                //split the dates 
                //for example Jul 1 - Jul 19 => ['Jul', '1', '-', 'Jul', '19']
                const course_date = dates.split(' ')           
                
                //const months = ['Jan', 'Feb', 'Mar', 'Apr']
                //construct start date
                const start_date = moment.tz(year + " "+ course_date[0]+" "+ course_date[1], "YYYY MMM D", "America/Los_Angeles")
                console.log('COURSE START DATE -> ', start_date)
                //construct end date
                //courses such as BLS and CPR/First Aid with out end date, have a null end date
                const end_date =  (course_date[2] === "-") ? moment.tz(year + " "+ course_date[3]+" "+ course_date[4], "YYYY MMM D", "America/Los_Angeles") : null

                return {                 
                    type: course_type,
                    name : course_name,
                    start_date: start_date.toDate(), 
                    end_date: course_date.length > 2 ? end_date.toDate()   : null                                   
                }
            } 
        }).filter(course => course != undefined) //somehow without the filter, courses without dates are being added

        return courses
    },

    /**
     * 
     * @param {String} code 
     * @param {String} id 
     * @returns {}
     */

    courseDbName : async ( code, id ) => {

        try {
             //get the full name of the course
            const full_course_name = courseName(code)

            //get the code
            if(
                full_course_name == "BLS Course Skill Testing" || 
                full_course_name == "Adult CPR/First Aid/AED Course Skill Testing" || 
                full_course_name == "DSHS Nurse Delegation (CORE) for NAs and HCAs" || 
                full_course_name == "DSHS Nurse Delegation Special Focus on Diabetes" 
            ) {
                //get courses by name 
                const results = await db.collection( 'reservations' ).doc( id ).get() 
                //convert data of results
                const course = results.data()  
                
                //if the course does NOT exist, let the user know so - redirect to the courses page
                if(!course){                 
                    return res.status(201).json({ message: 'No such course exists' })   
                } 

                //create course description to send to stripe
                return {
                    title: course.name +' course',
                    data : results.data(),
                    id: results.id,
                   // start_date: moment.tz(moment(), "America/Los_Angeles").format("MM/DD/YYYY")                   
                } 
                                        
            } else {
                //get results of search of courses collection using the course id
                const results = await db.collection('courses').doc( id ).get() 
                //convert data of results
                const course = results.data()
                //if the course does NOT exist, let the user know so - redirect to the courses page
                if(!course){                 
                    return res.status(201).json({ message: 'No such course exists' })   
                }    

                //create course description to send to stripe

                return {
                    title: moment.utc(course.start_date.toDate()).format("MMM DD") + ' ' + course.name + ' ' + course.type + ' course',                  
                    data: results.data(),
                    id: results.id
                 
                } 
               
            }
        } catch (error) {
            console.log('error ', error)
        }
    }
}