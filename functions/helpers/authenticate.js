const firebase = require('firebase')
const admin = require('firebase-admin')
// const auth = firebase.auth()

module.exports = {
    
    isAdmin: async ( req, res, next ) => {

        const sessionCookie = req.cookies.session || ""

        admin.auth()
            .verifyIdToken( sessionCookie, true /** checkRevoked */)
            .then(decodedIdToken => {
                if(new Date().getTime() / 1000 - decodedIdToken.auth_time < 30 * 60 && decodedIdToken.admin ){
                    next()
                }              
            }).catch((error) => {
                console.log('error in middleware --> ', error )
                res.redirect("/admin/signin");
            });
               
    }    
  
}