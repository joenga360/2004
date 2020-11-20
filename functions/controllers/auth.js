const firebase = require("firebase")
const admin = require("firebase-admin")

//create reference for firebase authentication service
const auth = firebase.auth()
//const seo_page = require('../client_helpers/seo_page_info')
// const sgMail = require('@sendgrid/mail')
// sgMail.setApiKey(process.env.SENDGRID_API_KEY)

module.exports = {
    
    //create admin or user using email, password and display name
    addUser: async (req, res, next) => {

        try {
            console.log("We are getting here....")
            //only users with the following emails allowed to be admins
            const adminEmails = ['training@excelcna.com', 'ngatuna05@gmail.com', 'gatunan@gmail.com']
            //get data
            const { email, password, name } = req.body
            //if user email is not in the allowed/admin emails, stop progress
            if(!adminEmails.includes(email)) {
                //res.direct to user dashboard
                return// res.status(200).json({ message: "Successfully added user", user: result.user }) 
            }            
            //create a user with
            const result = await auth.createUserWithEmailAndPassword(email, password)
            //get the created user id
            const userUid = result.user.uid
            //check if the user has been created
            if(userUid){
                console.log("Are we getting inside if...")
                //add profile/display name
                await result.user.updateProfile({
                    displayName : name
                })                       
               
                //set the admin customs to true
                await admin.auth().setCustomUserClaims(userUid, {
                    admin: true
                })
                console.log('Are we sending response back....????')
                res.status(201).json({                   
                     message: "Admin sign up successful",
                     redirect: true,
                     redirect_url: "/admin/dashboard"
                })
            } else {
                res.status(401).json({
                    message: "Admin sign up unsuccessful",
                    redirect: false,
                    redirect_url: "/admin/signup"
                })
            }
            
        } catch (error) {
            console.log(error)
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
                     console.log('DECODED ID TOKEN ', decodedIdToken)
                    // Only process if the user just signed in in the last 30 minutes.
                    if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 30 * 60) {
                        // Create session cookie and set it.
                        return admin.auth()
                            .createSessionCookie( idToken, { expiresIn })
                            .then((sessionCookie) => {
                                console.log('SESSION COOKIE IN AUTH CONTROLLLER', sessionCookie)
                                // Set cookie policy for session cookie.
                                const options = { maxAge: expiresIn, httpOnly: true /*, secure: true*/}
                                res.cookie('session', sessionCookie, options)
                                //res.end(JSON.stringify({ status: 'success' }))
                                res.status(200).json({               
                                    message: "Admin login successful",
                                    //redirect: true,
                                    redirect_url: "/admin/dashboard"
                                })

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
                        redirect_url: "/admin/signin"
                    })
                })   
            
            
        } catch (error) {
            console.log('error ->', error)
            res.status(500).json({error})
        }
    },

    userLogOut: async (req, res) => {
        try {
            res.clearCookie("session");
            req.admin = false
            res.redirect("/admin/signin")
        } catch (error) {
            // An error happened.
            console.log('sign out error -> ', error)
        }    
    }
}