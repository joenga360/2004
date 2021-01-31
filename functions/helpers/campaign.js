const campaigns = {
    1: "EHCT Why Train With Us?",
    2: "EHCT Why Become a CNA?",
    3: "EHCT Cost Effective",
    4: "EHCT Flexible Schedule"
}

const campaignText = {

    "CNA": {
        "headers": {
            1: "Why train with us? We have trained 10,000 + CNA students in the last 15 years.  Some of our graduates:",
            2: "Why become a CNA?",
            3: "Wanna help you save money and start earning quickly and so:",
            4: "Schedules are hard to adjust so we:"
        },

        "lists":{
            1: [
                "Have been accepted to UW, WAZU, Seattle U and other great schools.",
                "Work as CNAs, RNs, LPNs, Respiratory Therapists, etc",
                "Work @ Harborview, Swedish, Virginia Mason, Kaiser Permante etc."
            ],
            2: [
                "CNA is a personally and a professionally enriching career.",
                "The demand and the pay for CNAs is high and will greatly increase in the future.",
                "CNA license/work experience is a prerequisite for healthcare programs e.g LPN, RN, Respiratory Therapy etc.",
                "Finally, CNAs work in hospitals, clinics, retirement communities etc "
            ],       
            3: [
                "Our tuition cost is one of the lowest in the Puget Sound area.",
                "We assist you find a job.",
                "We guide you about tuition reimbursement.",               
                "We accept partial payment."
            ],
            4: [ 
                "Offer CNA training during weekends, days and evenings.",
                "Allow make up of missed hours with a future CNA class.",
                "Avail learning resources to use outside CNA class.",
                "Avail instructors for skill enhancement training."
            ]
        }
    },

    "bridging": {
        "header": "Here are a few reasons why you should bridge to CNA:",
        "items": [
            "CNAs'pay is higher than HCAs'.",
            "CNA license/work experience is a prerequisite for healthcare programs e.g LPN, RN, Respiratory Therapy etc.",
            "CNAs can care for more critically ill patients than HCAs.",
            "CNAs can work in more settings such as hospital, clinic and nursing homes and HCAs cannot."
        ],
        "keywords": ["Home Care Aide", "HCA", "Home Care Aide to CNA bridging", "HCA - CNA bridging", "Caregiver", "Aide", "Companion"]
    },

    "cpr":{
        "header": "We make it easy to get your CPR/First Aid/AED (re)certifications:",
        "items": [
            "We offer our courses during weekdays and weekends.",
            "Our courses are offered during day and evening times.",
            "You can take the theory part of the class online and get skill tested  at our location (this is called blended learning/course).",
            "Our cards are American Heart Association cards."
        ],
        "keywords": [ "CPR", "First Aid", "AED", "Adult CPR", "Cardio Pulmonary Resuscitation", "Automated External Defibrillator"]
    },

    "bls":{
        "header": "We make it easy to get your BLS (re)certifications:",
        "items": [
            "We offer our courses during weekdays and weekends.",
            "Our courses are offered during day and evening times.",
            "You can take the theory part of the class online and get skill tested  at our location (this is called blended learning/course).",
            "Our cards are American Heart Association cards."
        ],
        "keywords": [ "Basic Life Support", "BLS", "AED", "CPR", "Cardio Pulmonary Resuscitation", "Automated External Defibrillator"]
    },

    "recruit":{
        "header":"Create an account to:",
        "items": [
            "enroll your staff for our courses at discounted prices for the first 3 months.",    
            "get 2 job postings for FREE (a $50.00 value) to recruit caregivers/CNAs.",            
            "create a profile that introduces your organization to the local community of caregivers and CNAs."
        ],

        "body": "To maintain your high quality of care, sponsor caregiver/CNA training with us or any other local trainer.  Doing so:",
        "bodyItems": [
            "grows your recruiting network.",
            "is cheaper than overtime or staffing agency costs for one 12 hours work-shift.",
            "reduces caregiver burnout/turnover.",  
            "demonstrates to your staff/recruits you value their personal/professional development." 
        ]
    }    
}

//Gets the abbreviated name of a course and returns the complete name of the course

function courseName(x){

    const courseKeys = { 
        
        "bls": "Basic Life Support (BLS)",
        "bridging": "HCA to CNA Bridging",
        "core": "DSHS Core Basic Training",
        "ceu": "DSHS 12 Hours Continuous Education Units",
        "cna": "CNA",
        "cpr": "Adult CPR/FA",        
        "delegation": "DSHS Nurse Delegation (CORE) for NAs and HCAs",
        "dementia": "DSHS Dementia Specialty Training",
        "diabetes": "DSHS Nurse Delegation Special Focus on Diabetes",
        "so": "DSHS Safety and Orientation Training"
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
