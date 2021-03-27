const firebase = require("firebase")
const admin = require("firebase-admin")
require('../config/var')
//const seo_page = require('../client_helpers/seo_page_info')
// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports = {
    
    //create admin or user using email, password and display name
    addUser: async (req, res, next) => {

        try {
  
            //only users with the following emails allowed to be admins
            const adminEmails = ['training@excelcna.com', 'ngatuna05@gmail.com', 'gatunan@gmail.com']
            //get data
            const { name, email } = req.body
            //if user email is not in the allowed/admin emails, stop progress
            if(!adminEmails.includes( email )) {
                //redirect to home page
                return
            }  
            
            const idToken = req.body.idToken.toString();

            const expiresIn = 60 * 60 * 24 * 5 * 1000;  
            
            const decodedIdToken = await admin.auth().verifyIdToken( idToken )

            await admin.auth().setCustomUserClaims(decodedIdToken.sub, {
                admin : true
            })

            await admin.auth().updateUser(decodedIdToken.sub, {               
                displayName: name,
            })           
            
            
            // Only process if the user just signed in in the last 30 minutes.
            if ( new Date().getTime() / 1000 - decodedIdToken.auth_time < 30 * 60 ) {
                // Create session cookie and set it.
                return admin.auth()
                    .createSessionCookie( idToken, { expiresIn })
                    .then((sessionCookie) => {
                        console.log('SESSION COOKIE IN AUTH CONTROLLLER', sessionCookie)
                        // Set cookie policy for session cookie.
                        const options = { maxAge: expiresIn, httpOnly: true , secure: COOKIE_SECURE_BOOLEAN }
                        
                        res.setHeader('Cache-Control', 'private')

                        res.cookie('__session', sessionCookie, options)                           
                        req.decodedCookie =  decodedIdToken
                        //res.end(JSON.stringify({ status: 'success' }))
                        res.status(200).json({               
                            message: "Admin signup successful",
                            //redirect: true,
                            redirect_url: "/admin/dashboard"
                        })

                    }, error => {
                        console.log('session cookie error ', error)    
                        // res.status(401).send('UNAUTHORIZED REQUEST!');
                        res.status(401).json({
                            message: "Admin sign up unsuccessful",
                            // redirect: false,
                            redirect_url: "/admin/signin"
                        })
                    })
        
            }
            // A user that was not recently signed in is trying to set a session cookie.
            // To guard against ID token theft, require re-authentication.                   
            res.status(401).json({
                message: "Your session expired - please log in again",
                // redirect: false,
                redirect_url: "/admin/signin"
            })
           
            
        } catch (error) {
         
            res.status(500).json({error})            
        }       
       
    },

    signInUser: async (req, res, next) => {

        try {

            const idToken = req.body.idToken.toString();

            const expiresIn = 60 * 60 * 24 * 5 * 1000;  

            admin.auth()
                 .verifyIdToken(idToken)
                 .then((decodedIdToken) => {
                   
                    // Only process if the user just signed in in the last 30 minutes.
                    if ( new Date().getTime() / 1000 - decodedIdToken.auth_time < 30 * 60 && decodedIdToken.admin ) {
                        // Create session cookie and set it.
                        return admin.auth()
                            .createSessionCookie( idToken, { expiresIn })
                            .then((sessionCookie) => {

                                // Set cookie policy for session cookie.
                                const options = { maxAge: expiresIn , httpOnly: true , secure: COOKIE_SECURE_BOOLEAN }
                               
                                res.setHeader('Cache-Control', 'private')
                               
                                res.cookie('__session', sessionCookie, options)                           
                               // res.cookie('session', sessionCookie, options)  
                                
                                res.end(JSON.stringify({ status: 'success' }))                              

                            }, error => {
                                console.log('session cookie error ', error)    
                               // res.status(401).send('UNAUTHORIZED REQUEST!');
                                res.status(401).json({
                                    message: "Admin login unsuccessful",
                                   // redirect: false,
                                    redirect_url: "/admin/signin"
                                })
                            })
                    }
                    // A user that was not recently signed in is trying to set a session cookie.
                    // To guard against ID token theft, require re-authentication.                   
                    res.status(401).json({
                        message: "Your session expired - please log in again",
                       // redirect: false,
                        redirect_url: "/"
                    })
                })   
            
            
        } catch (error) {
            console.log('error ->', error)
            res.status(500).json({error})
        }
    },

    userLogOut: async (req, res) => {
        try {           
            console.log('we are getting in USER LOG OUT')
            res.clearCookie('__session')
            //res.clearCookie("decoded")
           
            res.redirect("/admin/signin")
        } catch (error) {
            // An error happened.
            console.log('sign out error -> ', error)
        }    
    }
}