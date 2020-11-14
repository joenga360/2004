/**
 *  Not all courses have the same properties
 * The objects here are to be used to present info to users and admins
 */

 //Registration fees

const registration_fee = {
    "CNA": 75,       
    'Adult CPR/FA': 80,    
    "HCA-CNA Bridging": 75,   
    "Basic Life Support (BLS)": 65,
    "Job posting": 25
}

//Regular tuition

const regular_price = {
    "CNA": 675,       
    'Adult CPR/FA': 80,    
    "HCA-CNA Bridging": 450,   
    "Basic Life Support (BLS)": 65    
}

const discount_price = {
    "CNA": 625,       
    'Adult CPR/FA': 70,    
    "HCA-CNA Bridging": 415,   
    "Basic Life Support (BLS)": 65    
}

const courseIndex = {"CNA":"metric1", "HCA-CNA Bridging":"metric2", "Basic Life Support (BLS)":"metric3", "Adult CPR/FA":"metric4"}

const stripeKeys = {
    publishable_key: "pk_live_qtbyYZpbhxzGjlY4EY4upGnt00A6TsO7jW"  
}

const gaUI = {id: "UA-147163628"}


module.exports = { discount_price, courseIndex, regular_price, registration_fee, stripeKeys, gaUI}