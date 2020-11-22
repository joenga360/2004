const firebase = require('firebase')
const admin = require('firebase-admin')
// const auth = firebase.auth()

module.exports = {
    
    isAdmin: async ( req, res, next ) => {

        const decodedCookie = req.cookies.decoded || ""

        console.log('decoded cookie in authenticate ', decodedCookie)
        // admin.auth()
        //     .verifyIdToken( sessionCookie, true /** checkRevoked */)
        //     .then(decodedIdToken => {
                if(new Date().getTime() / 1000 - decodedCookie.auth_time < 30 * 60 && decodedCookie.admin ){
                    next()
                }   else {
                    res.redirect("/admin/signin");
                }           
            // }).catch((error) => {
            //     console.log('error in middleware --> ', error )
                
            // });
               
    }    
  
}