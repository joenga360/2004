const moment = require('moment-timezone')

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
       
        return {
            bls : courses.filter(course => course.name === "Basic Life Support (BLS)" && course.type === "Weekend"),
            bridging : {
                day_courses : courses.filter(course => course.name === "HCA-CNA Bridging" && course.type === "Day"),
                weekend_courses: courses.filter(course => course.name === "HCA-CNA Bridging" && course.type === "Weekend")
            },
            cna : {
                day_courses : courses.filter(course => course.name === "CNA" && course.type === "Day"),
                evening_courses : courses.filter(course => course.name === "CNA" && course.type === "Evening"),
                weekend_courses: courses.filter(course => course.name === "CNA" && course.type === "Weekend")
            },  
            cpr : {
                day_courses : courses.filter(course => course.name === "Adult CPR/FA" && course.type === "Day"),
                evening_courses : courses.filter(course => course.name === "Adult CPR/FA" && course.type === "Evening"),
                weekend_courses: courses.filter(course => course.name === "Adult CPR/FA" && course.type === "Weekend")                                        
            }
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
    }
}