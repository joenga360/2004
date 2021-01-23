// const moment = require('moment')
// var QuickBooks = require('../quickbooks')
// const NodeCache = require( "node-cache" )
// const myCache = new NodeCache()
// QuickBooks.setOauthVersion('2.0')
// const request = require('request')

// const getQbo =  (args) => {
//     return new QuickBooks(
//         CONSUMER_KEY,
//         CONSUMER_SECRET,
//         args.token,
//         false,
//         args.companyid,
//         true, // use the Sandbox
//         true,// turn debugging on
//         55,
//         '2.0',
//         args.refresh_token
//     )
// }
// module.exports = {    

//     getRequestBody: async (req, res, next) => {
        
//         const auth = (new Buffer( CONSUMER_KEY + ':' +  CONSUMER_SECRET ).toString('base64'));

//         const postBody = {
//             url: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
//             headers: {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/x-www-form-urlencoded',
//                 Authorization: 'Basic ' + auth,
//             },
//             form: {
//                 grant_type: 'authorization_code',
//                 code: req.query.code,
//                 redirect_uri: 'http://localhost:5000/admin/callback/'  //Make sure this path matches entry in application dashboard
//             }
//         }
        
//         await request.post(postBody, function (e, r, data) {
//             const accessToken = JSON.parse(r.body)        
        
//             const qboObject = {
//               token: accessToken.access_token,    
//               companyid: req.query.realmId,
//               refresh_token: accessToken.refresh_token
//             }
 
//             return getQbo(qboObject)        
      
//         })
//     },

//     /**
//      * params: user's id, email, first name, last name, tel, and comments
//      * returns: Object for QBO posting
//      */
//     qbWebSignUp : ( id, first, last, tel, email, comments ) => {
        
//         //return new web sign ups
//         return newStudent = {
//             Id: id,
//             DisplayName: first + " " + last, 
//             GivenName: first,
//             FamilyName: last,
//             Notes: comments,
//             PrimaryPhone:  {
//                 FreeFormNumber: tel
//               },
//             sparse: true,
//             PrimaryEmailAddr: { Address: email }
//         }        

//     },

//     /**
//      * params: user's id, email, first name, last name, tel, address, city, and comments
//      * returns: Object for QBO posting
//      */

//     qbAdminSignUp : ( id, email, first, last, tel, address, city, comments ) => {
//         //return new web sign ups
//         return newStudent = {
//             Id: id,
//             DisplayName: first + " " + last, 
//             GivenName: first,
//             FamilyName: last,
//             Notes: comments,
//             PrimaryPhone:  {
//                 FreeFormNumber: tel
//             },
//             sparse: true,
//             PrimaryEmailAddr: { Address: email },
//             BillAddr: {
//                 "CountrySubDivisionCode": "WA", 
//                 "City": city, 
//                 "PostalCode": zip, 
//                 "Line1": address, 
//                 "Country": "USA"
//             }, 
//         }       
//     },

//     /**
//      * params: user's id,  first name, last name, and amount
//      * returns: Object for QBO posting
//      */

//     qbNewPayment : ( amount, id, first, last ) => {
//         //return new payment
//         return newPayment = {            
//             "TotalAmt": amount, 
//             "CustomerRef": {
//                 "value": id,
//                 "name": first + " " + last, 
//             }            
//         }
//     },

//     /**
//      * params: course's id, email, first name, last name, tel, address, city, and comments
//      * returns: Object for QBO posting
//      */
//     qbNewItem : ( course_id, course_name, course_start_date, course_end_date, course_type) => {
        
//         //create name of course
//         //e.g. Nov 1 - Nov 2 Day CNA Course
//         const course = course_end_date != null ? moment(course_start_date).format("MMM DD")  + ' ' + moment(course_end_date).format("MMM DD")  + ' ' + course_name +' '+ course_type + 'Course.' 
//                                                 : moment(course_start_date).format("MMM DD") + ' ' + course_name +' '+ course_type + 'Course.' 
//         //return item
        
//         return newItem = {
//             Name: course,
//             Type: "Service",
//             IncomeAccountRef: {
//                 name: "Sales of Product Income", 
//                 value: course_id
//             }, 
//         }
//     }
// }

