/**
 *  Not all courses have the same properties
 * The objects here are to be used to present info to users and admins
 */

 
 //Registration fees

const registration_fee = {
   
    "CNA" : 75,
    "DSHS Home Care Aide/75 Hours" : 75,
    "Adult CPR/First Aid/AED Course Skill Testing" : 50,
    "BLS Course Skill Testing" : 40,
    "HCA to CNA Bridging" : 75,
    "DSHS Nurse Delegation (CORE) for NAs and HCAs" : 120, 
    "DSHS Nurse Delegation Special Focus on Diabetes" : 120, 
    "DSHS Core Basic" : 75,        
    "DSHS 12 Hours Continuous Education Units" : 105, 
    "DSHS Dementia Specialty" : 105, 
    "DSHS Mental Health Specialty" : 105,
    "DSHS Safety and Orientation" : 60 
}

//Regular tuition

const regular_price = {
    "CNA" : 725,
    "DSHS Home Care Aide/75 Hours" : 575,
    "Adult CPR/First Aid/AED Course Skill Testing" : 50,
    "BLS Course Skill Testing" : 40,
    "HCA to CNA Bridging" : 535,
    "DSHS Nurse Delegation (CORE) for NAs and HCAs" : 110, 
    "DSHS Nurse Delegation Special Focus on Diabetes" : 110, 
    "DSHS Core Basic" : 375,        
    "DSHS 12 Hours Continuous Education Units" : 105, 
    "DSHS Dementia Specialty" : 100, 
    "DSHS Mental Health Specialty" : 100,
    "DSHS Safety and Orientation" : 60    
}


const courseIndex = {"CNA":"metric1", "HCA-CNA Bridging":"metric2", "Basic Life Support (BLS)":"metric3", "Adult CPR/FA":"metric4"}

const stripeKeys = {
    publishable_key: "pk_live_qtbyYZpbhxzGjlY4EY4upGnt00A6TsO7jW"  
}

const gaUI = {id: "UA-147163628"}


module.exports = { courseIndex, regular_price, registration_fee, stripeKeys, gaUI}