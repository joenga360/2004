const admin = require('firebase-admin')

module.exports = {
    
    isAdmin: async ( req, res, next ) => {   
        console.log('req cookies ', req.cookies)
       
        //get the session cookie
        //const sessionCookie = req.cookies.__session || ""
        const sessionCookie = req.cookies.session || ""
        console.log('session cookie in authenticate --> ', sessionCookie)
                    
        admin
            .auth()
            .verifySessionCookie(sessionCookie, true /** checkRevoked */)
            .then(() => {
                res.locals.admin = true
                next()
            })
            .catch((error) => {
                console.log('error in authenticate ', error)
                return res.redirect("/admin/signin")
            });

   
    }    
  
}