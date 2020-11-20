const firebase = require('firebase')
const admin = require('firebase-admin')
// const auth = firebase.auth()

module.exports = {
    
    isAdmin: async ( req, res, next ) => {

        const sessionCookie = req.cookies.session || ""

        admin.auth()
            .verifySessionCookie( sessionCookie, true /** checkRevoked */)
            .then(() => {
                console.log( 'session cookie ', sessionCookie )
            // res.render("profile.html");
                next()
            }).catch((error) => {
                console.log('error in middleware --> ', error )
                res.redirect("/admin/signin");
            });
               
    }    
  
}