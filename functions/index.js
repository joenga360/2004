const functions = require('firebase-functions')
const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const engines = require('consolidate')
const path = require('path')
const favicon = require('serve-favicon')
const cookieParser = require('cookie-parser')
const csrf = require('csurf')
const bodyParser = require('body-parser')
const cors = require('cors')
const firebase = require("firebase")
const { setEnvironment }= require('./config/var')

const app = express()

app.use(cors({ origin:true }))

const admin = require("firebase-admin")
const serviceAccount = require("./config/exhct2004-firebase-adminsdk.json")

firebase.initializeApp({
    apiKey: "AIzaSyCsnmzIFaMRMNNuAPDrbAwDkWOkpuUT5no",
    authDomain: "exhct2004.firebaseapp.com",
    databaseURL: "https://exhct2004.firebaseio.com",
    projectId: "exhct2004",
    storageBucket: "exhct2004.appspot.com",
    messagingSenderId: "1077932241776",
    appId: "1:1077932241776:web:a77060932c8b12b73055b5",
    measurementId: "G-7WCNC0TMEM"
  })

  
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://exhct2004.firebaseio.com"
 })

//firebase.analytics()
//set up views
app.use(expressLayouts)

// View Engine
app.engine('ejs', engines.ejs)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

//set favicon
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(favicon("./public/favicon.ico"))
//the order here is very important
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
const csrfProtection = csrf({ cookie:true })

app.use(cookieParser())
app.use(csrfProtection)
//app.use(express.static(path.join(__dirname, 'public')))
app.use(express.static("./public"))
//set the environment variables
setEnvironment()   
//Get user info and set csurf cooke
app.use( async( req, res, next ) => {
    res.locals.admin = false
    res.locals.lead = false
    //set csurf cookie
    res.cookie("XSRF-TOKEN", req.csrfToken())
    //get firebase user
    const user = firebase.auth().currentUser
    //if user
    if(user!= null){        
        //get userid
        const userRecord = await admin.auth().getUser(user.uid)
        //check if the user has admin privileges
        const adminClaims = await userRecord.customClaims['admin']    
        //if the user has admin privileges, set admin to true and proceed
        if(adminClaims){
            res.locals.admin = true
            next()
        }
        
     } else next()
})

console.log('Before routes...')
app.use('/', require('./routes/site'))
app.use('/admin', require('./routes/admin'))
app.use('/auth', require('./routes/auth'))
app.use('/courses', require('./routes/course'))
app.use('/job', require('./routes/job'))
app.use('/students', require('./routes/student'))

exports.app = functions.https.onRequest(app)