const campaigns = {
    1: "EHCT Why Train With Us?",
    2: "EHCT Why Become a CNA?",
    3: "EHCT Cost Effective",
    4: "EHCT Flexible Schedule"
}

const campaignText = {

    "CNA": {
        "headers": {
            1: "Why take a CNA course with us? We have trained 10,000 + CNA students in the last 15 years.",
            2: "Take our CNA class and find a steady, secure CNA job!",
            3: "Wanna help you save on CNA tuition and start earning quickly as a CNA and so:",
            4: "Our program's CNA courses:"
        },

        "lists":{
            1: [
                "Our CNA program course graduates have been admitted to UW, WAZU, Seattle U and other great schools' healthcare programs.",
                "Our CNA course students work as CNAs, RNs, LPNs, Respiratory Therapists, etc",
                "Our CNA course students work as CNA @ Harborview, Swedish, Virginia Mason, Kaiser Permante etc."
            ],
            2: [                
                "The demand and the pay for CNAs is high and will greatly increase in the future.",
                "CNA is a secure, recession proof job that will always be in demand",
                "A CNA's job cannot be automated or outsourced",
                "CNAs work in hospitals, clinics, retirement communities and senior living etc."              
            ],       
            3: [
                "Our CNA course tuition is one of the most affordable the Puget Sound area.",
                "We assist you find a CNA job after completing our CNA class.",
                "We guide you about CNA course tuition reimbursement.",               
                "To help you start CNA training, we accept partial payment."
            ],
            4: [                 
                "Allow make up of missed hours with a future CNA class.",
                "Provide learning resources for use outside CNA class.",
                "Avail instructors for CNA training/skill enhancement .",
                "Are offered during weekends, days and evenings."
            ]
        }
    },

    "bridging":{
        "header": "Here are a few reasons why you should bridge to CNA:",
        "items":[
            "CNAs'pay is higher than HCAs'.",
            "CNA license/work experience is a prerequisite for healthcare programs e.g LPN, RN, Respiratory Therapy etc.",
            "CNAs can care for more critically ill patients than HCAs.",
            "CNAs can work in more settings such as hospital, clinic and nursing homes and HCAs cannot."
        ],
        "keywords": ["Home Care Aide", "HCA", "Home Care Aide to CNA bridging", "HCA - CNA bridging", "Caregiver", "Aide", "Companion"]
    },

    "cpr":{
        "header": "We make it easy to get your CPR/First Aid/AED (re)certifications:",
        "items":[
            "We offer our courses during weekdays and weekends.",
            "Our courses are offered during day and evening times.",
            "You can take the theory part of the class online and get skill tested  at our location (this is called blended learning/course).",
            "Our cards are American Heart Association cards."
        ],
        "keywords": [ "CPR", "First Aid", "AED", "Adult CPR", "Cardio Pulmonary Resuscitation", "Automated External Defibrillator"]
    },

    "bls":{
        "header": "We make it easy to get your BLS (re)certifications:",
        "items":[
            "We offer our courses during weekdays and weekends.",
            "Our courses are offered during day and evening times.",
            "You can take the theory part of the class online and get skill tested  at our location (this is called blended learning/course).",
            "Our cards are American Heart Association cards."
        ],
        "keywords": [ "Heartcode BLS Course Skill Testing", "Basic Life Support", "BLS", "AED", "CPR", "Cardio Pulmonary Resuscitation", "Automated External Defibrillator"]
    },

    "recruit":{
        "header":"Create an account to:",
        "items":[
            "enroll your staff for our courses at discounted prices for the first 3 months.",    
            "get 2 job postings for FREE (a $50.00 value) to recruit caregivers/CNAs.",            
            "create a profile that introduces your organization to the local community of caregivers and CNAs."
        ],

        "body": "To maintain your high quality of care, sponsor caregiver/CNA training with us or any other local trainer.  Doing so:",
        "bodyItems":[
            "grows your recruiting network.",
            "is cheaper than overtime or staffing agency costs for one 12 hours work-shift.",
            "reduces caregiver burnout/turnover.",  
            "demonstrates to your staff/recruits you value their personal/professional development." 
        ]
    }    
}

function courseName(x){

    const courseKeys = { 
        "cna":"CNA",
        "hca": "DSHS Home Care Aide/75 Hours",
        "cpr":"Adult CPR/First Aid/AED Course Skill Testing",
        "bls":"BLS Course Skill Testing",
        "bridging":"HCA to CNA Bridging",
        "delegation": "DSHS Nurse Delegation (CORE) for NAs and HCAs", 
        "diabetes": "DSHS Nurse Delegation Special Focus on Diabetes", 
        "core": "DSHS Core Basic",        
        "ceu": "DSHS 12 Hours Continuous Education Units", 
        "dementia": "DSHS Dementia Specialty", 
        "mh": "DSHS Mental Health Specialty", 
        "so": "DSHS Safety and Orientation"
    }
    
    return courseKeys[x]
}

function sortCampaigns(course, url){

    const length = url.length

    switch(length){
        case 1:
            return {
                course, 
                channel: "Google",             
                theme: campaigns[url[parseInt(length-1)]]
            }             
        
        default: 
            return {}
    }
}

module.exports = { sortCampaigns, campaignText,  courseName  }
