const admin = require('firebase-admin')

module.exports = {
    
    isAdmin: async ( req, res, next ) => {          
       
        //get the session cookie
        //const sessionCookie = req.cookies.__session || ""
        const sessionCookie = req.cookies.session || ""       
                    
        admin
            .auth()
            .verifySessionCookie(sessionCookie, true /** checkRevoked */)
            .then(() => {
                res.locals.admin = true
                next()
            })
            .catch((error) => {
                console.log('error in authenticate ', error)
                res.redirect("/admin/signin")
            })   
    } 
}