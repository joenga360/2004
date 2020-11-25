const admin = require('firebase-admin')

module.exports = {
    
    isAdmin: async ( req, res, next ) => {

        console.log('REQUEST OBJECT ---> ', req )
        //get the decoded cookie
        const decodedCookie = req.decodedCookie     
        
        //get the session co =  
        const sessionCookie = req.cookies.session || ""
        //console.log(req.cookies)
        console.log('SESSION COOKIE --> ', sessionCookie )
        console.log('DECODED COOKIE --> ', decodedCookie)
        //console.log('TIME PASSED --> ', timepassed)
        switch( decodedCookie.admin ){
            case true:                          
              
                if( new Date().getTime() / 1000 - decodedCookie.auth_time < 30 * 60 ) {
                    
                    admin
                        .auth()
                        .verifySessionCookie(sessionCookie, true /** checkRevoked */)
                        .then(() => {
                          next()
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
                console.log('DECODED COOKIE --> ', decodedCookie, "and --->",  new Date().getTime() / 1000 - decodedCookie.auth_time < 30 * 60 )
                res.clearCookie("session")
                res.clearCookie("decoded") 
               
                return res.redirect("/courses")
        }
    }    
  
}