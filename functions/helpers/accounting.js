const moment = require('moment')
var QuickBooks = require('../quickbooks')
const NodeCache = require( "node-cache" )
const myCache = new NodeCache()
QuickBooks.setOauthVersion('2.0')


const getQbo =  (args) => {
    return new QuickBooks(
        CONSUMER_KEY,
        CONSUMER_SECRET,
        args.token,
        false,
        args.companyid,
        true, // use the Sandbox
        true,// turn debugging on
        55,
        '2.0',
        args.refresh_token
    )

}
module.exports = {    

    /**
     * params: user's id, email, first name, last name, tel, and comments
     * returns: Object for QBO posting
     */
    qbWebSignUp : ( id, first, last, tel, email, comments ) => {
        
        //return new web sign ups
        const newStudent = {
            Id: id,
            DisplayName: first + " " + last, 
            GivenName: first,
            FamilyName: last,
            Notes: comments,
            PrimaryPhone:  {
                FreeFormNumber: tel
              },
            sparse: true,
            PrimaryEmailAddr: { Address: email }
        } 
        
        const qboCache = myCache.get('qbo-cache')
        // save the access token somewhere on behalf of the logged in user
        console.log('qboCache ---> ', qboCache)
        const qbo = getQbo( qboCache ) 

        qbo.createCustomer(newStudent, (err, customer) => {
            if(err) return err
            console.log('customer ---->', customer)
            return customer
        })
    },

    /**
     * params: user's id, email, first name, last name, tel, address, city, and comments
     * returns: Object for QBO posting
     */

    qbAdminSignUp : ( id, email, first, last, tel, address, city, comments ) => {
        //return new web sign ups
        return newStudent = {
            Id: id,
            DisplayName: first + " " + last, 
            GivenName: first,
            FamilyName: last,
            Notes: comments,
            PrimaryPhone:  {
                FreeFormNumber: tel
            },
            sparse: true,
            PrimaryEmailAddr: { Address: email },
            BillAddr: {
                "CountrySubDivisionCode": "WA", 
                "City": city, 
                "PostalCode": zip, 
                "Line1": address, 
                "Country": "USA"
            }, 
        }       
    },

    /**
     * params: user's id,  first name, last name, and amount
     * returns: Object for QBO posting
     */

    qbNewPayment : ( amount, id, first, last ) => {
        //return new payment
        return newPayment = {            
            "TotalAmt": amount, 
            "CustomerRef": {
                "value": id,
                "name": first + " " + last, 
            }            
        }
    },

    /**
     * params: course's id, email, first name, last name, tel, address, city, and comments
     * returns: Object for QBO posting
     */
    qbNewItem : ( course_id, course_name, course_start_date, course_end_date, course_type) => {
        
        //create name of course
        //e.g. Nov 1 - Nov 2 Day CNA Course
        const course = course_end_date != null ? moment(course_start_date).format("MMM DD")  + ' ' + moment(course_end_date).format("MMM DD")  + ' ' + course_name +' '+ course_type + 'Course.' 
                                                : moment(course_start_date).format("MMM DD") + ' ' + course_name +' '+ course_type + 'Course.' 
        //return item
        
        return newItem = {
            Name: course,
            Type: "Service",
            IncomeAccountRef: {
                name: "Sales of Product Income", 
                value: course_id
            }, 
        }
    }
}

