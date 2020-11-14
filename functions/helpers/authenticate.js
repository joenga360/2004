const firebase = require('firebase')
const admin = require('firebase-admin')
const auth = firebase.auth()

module.exports = {
    
    isAdmin: async ( req, res, next ) => {
        //check if this is a user
        const user = firebase.auth().currentUser 
       // console.log(user.uid)
        if(user){
            //check if user is an admin
            const userRecord = await admin.auth().getUser(user.uid)
         
            const adminClaims = await userRecord.customClaims['admin']
          
            if(adminClaims){
                // req.admin = adminClaims
                next()
            }else{
                // req.admin = false
                res.redirect('/admin/signin')
            }
            
        } else{
            // req.admin = false
            res.redirect('/admin/signin')
        }           
    },
    
    isUser: () => {
        return ( req, res, next ) => {
            // listen for auth status changes
            auth.onAuthStateChanged(user => {
                if (user) {
                    user.getIdTokenResult().then(idTokenResult => {
                        user.admin = idTokenResult.claims.admin
                        console.log('USER -> ', user.admin)
                        if(!user.admin){
                            req.user = user
                            return next()
                        }else{
                            res.redirect('/signin')
                        }
                    })                   
                }
           })
        }
    }
}