const stripe = require('stripe')(STRIPE_SECRET_KEY)
/**
 * params: course_id: String, payments: student.payment array in student object stored in Database
 * filters student payments using course and sum the payments
 * return: sum of student payments in DB
 */


function studentPayments(course_id, payments) {
  //create payment varialbe
  const total_payment = payments.filter(payment => payment.course_id === course_id).reduce((initial, payment) => {
    //return payment amount
    return payment.amount + initial;
  }, 0);
  return total_payment;
}

async function charge(card_id, customer_id, amount, item_description) {
    const charge = await stripe.charges.create({
      amount: amount * 100,
      currency: 'usd',
      description: item_description,
      source: card_id,
      customer: customer_id
    })

    return charge.id
 // console.log("Here is the charge id ", charge.id)
}

async function createCustomer(email, first = "", last = "", tel = "") {
  const customer = await stripe.customers.create({
    email,
    name: first + ' ' + last,
    phone: tel
  })
  return customer.id;
}

async function createCard(customer_id, token) {
  const card = await stripe.customers.createSource(customer_id, {
    source: token
  });
  return {
    id: card.id,
    last4: card.last4
  };
}

async function retrieveCustomer(customer_id) {
  const customer = await stripe.customers.retrieve(customer_id);
  return customer.id;
}

async function retrieveCard(customer_id, card_id) {
  const card = await stripe.customers.retrieveSource(customer_id, card_id);
  return {
    id: card.id,
    last4: card.last4
  };
}

module.exports = {
  charge,
  createCustomer,
  createCard,
  retrieveCard,
  retrieveCustomer,
  studentPayments
}

// charge: (card_id, customer_id, amount, item_description) => {    
//     stripe.charges.create({
//         amount: amount*100,
//         currency: 'usd',
//         description: item_description,
//         source: card_id,
//         customer: customer_id
//     }, chargeResults)           
// },
// createCard: (token) => {
//     return function( err, customer ){
//         if(err) {throw new Error(err)}
//         stripe.customers.createSource( customer.id, {source: token}, charge(customer.id) )
//     }        
// },
// createCustomer: (token, email, first = "", last = "", tel = "") => {
//     stripe.customers.create({ 
//         email,
//         name: first + ' ' + last,
//         phone: tel
//     }, createCard(token) )
// }