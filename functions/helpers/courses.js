/**
 *  Not all courses have the same properties
 * The objects here are to be used to present info to users and admins
 */
const Courses = {
  CNA: {
    cost: 725,
    discount: 625,
    length: ['3 weeks', '6 weekends'],
    location: ['Des Moines', 'Tacoma'],
    type: ['day', 'evening', 'weekend'],
    dates: '',
    times: ['9:00 a.m. to 3:00 p.m.', '3:00 p.m. to 9:00 p.m.', '2:00 p.m. to 10:00 p.m.']
  },
  "HCA - CNA Bridging": {
    cost: 450,
    discount: 415,
    length: '3 days',
    location: '',
    type: ['day', 'evening', 'weekend'],
    dates: '',
    times: ''
  },
  '75 Hours HCA': {
    cost: 550,
    length: '3 weeks',
    location: '',
    type: ['day', 'evening', 'weekend'],
    dates: '',
    times: ['9:00 a.m. to 3:00 p.m.', '3:00 p.m. to 9:00 p.m.', '2:00 p.m. to 10:00 p.m.']
  },
  "Mental Health": {
    cost: 80,
    length: '6 hours',
    location: '',
    dates: '',
    times: ''
  },
  Dementia: {
    cost: 80,
    length: '6 hours',
    location: '',
    dates: '',
    times: ''
  },
  "Nurse Delegation": {
    cost: 60,
    length: '9 hours',
    location: '',
    type: ['instructor led', 'self-study'],
    dates: '',
    times: ''
  },
  Diabetes: {
    cost: 60,
    length: '3 hours',
    location: '',
    type: ['instructor led', 'self-study'],
    dates: '',
    times: ''
  },
  "Safety and Orientation": {
    cost: 50,
    length: '6 hours',
    location: '',
    type: ['instructor led', 'online'],
    dates: '',
    times: ''
  },
  'CPR/FA': {
    cost: 80,
    discount: 70,
    length: '6 hours',
    location: '',
    dates: '',
    times: ''
  },
  'Continuous Education Units': {
    cost: 90,
    length: '12 hours',
    type: ['instructor led', 'online']
  },
  'Core Basic Training': {
    cost: 450,
    length: '53 hours',
    location: '',
    dates: '',
    times: ''
  }
}

const courseIndex = {"CNA":"metric1", "HCA-CNA Bridging":"metric2", "Basic Life Support (BLS)":"metric3", "Adult CPR/FA":"metric4"}

const Locations = {
  'Des Moines': {
    address: '22659 Pacific Highway South Suite 301 Des Moines WA 98198',
    tel: "206 271 1946",
    email: 'desmoines@excelcna.com',
    website: 'www.excelcna.com'
  },
  Tacoma: {
    address: '1612 South Mildred Suite A Tacoma WA 98465',
    tel: "253 426 5000",
    email: 'tacoma@excelcna.com',
    website: 'www.excelcna.com'
  }
}

module.exports = { Courses, courseIndex, Locations }