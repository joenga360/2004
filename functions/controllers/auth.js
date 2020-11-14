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

            const { email, password } = req.body

            const result = await auth.signInWithEmailAndPassword(email, password)        
            
            //get the created user id
            const userUid = result.user.uid
           console.log('userUid --> ', userUid)
            if(userUid){
                console.log('Inside --- final')
                res.status(200).json({
                   // user
                    message: "Admin login successful",
                    redirect: true,
                    redirect_url: "/admin/dashboard"
                })
            }else {
                res.status(401).json({
                     message: "Admin login unsuccessful",
                     redirect: false,
                     redirect_url: "/admin/signin"
                 })
            }  
            
        } catch (error) {
            console.log('error ->', error)
            res.status(500).json({error})
        }
    },

    userLogOut: async (req, res) => {
        const user = firebase.auth().currentUser

        console.log('we are inside user log out')
        console.log('USER -> ', user.uid)
        console.log('req admin -> ', req.admin)
        //console.log('req auth -> ', req.auth)
        auth.signOut().then(function() {
            // Sign-out successful.
            console.log('We are signing out')
            req.admin = false
            res.redirect('/admin/signin')

          }).catch(function(error) {
            // An error happened.
            console.log('sign out error -> ', error)
          });
       // await auth.signOut()
    }
}