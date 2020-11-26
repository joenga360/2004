const admin = require('firebase-admin')

module.exports = {
    
    isAdmin: async ( req, res, next ) => {   
       
        //get the session cookie
        const sessionCookie = req.cookies.__session || ""
                    
        admin
            .auth()
            .verifySessionCookie(sessionCookie, true /** checkRevoked */)
            .then(() => {
                res.locals.admin = true
                next()
            })
            .catch((error) => {
                
                return res.redirect("/admin/signin")
            });

   
    }    
  
}