const admin = require('firebase-admin')

module.exports = {
    
    isAdmin: async ( req, res, next ) => {
        //get the decoded cookie
        const decodedCookie = req.cookies.decoded || ""
        //get the session cookie
        const sessionCookie = req.cookies.session || ""
        //console.log('TIME PASSED --> ', timepassed)
        switch( decodedCookie.admin ){
            case true:
                //console.log( 'is this true....?', new Date().getTime() / 1000 - decodedCookie.auth_time < 30 * 60 )               
              
                if( new Date().getTime() / 1000 - decodedCookie.auth_time < 30 * 60 ) {
                    
                    admin
                        .auth()
                        .verifySessionCookie(sessionCookie, true /** checkRevoked */)
                        .then(() => {
                            return next()
                        })
                        .catch((error) => {
                            
                            return res.redirect("/admin/signin")
                        });

                } else {
                    console.log('*********ARE WE GETTING HERE AT ALL????????')
                    res.clearCookie("session")
                    res.clearCookie("decoded")    
                
                    return res.redirect("/admin/signin");    
                }
                
                break

            default:
                console.log('GETTING HERE BEFORE ERRORS....')
               
                return res.redirect("/courses")
        }
    }    
  
}