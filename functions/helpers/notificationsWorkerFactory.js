const firebase = require("firebase")
const moment = require('moment')
//create reference for firestore database
const db = firebase.firestore()

const notificationsWorkerFactory = function () {
  return {
    run: function () {
      //[ Course.selectCourses(), Job.selectJobs() ] 
      Course.selectCourses();
    }
  };
};

module.exports = notificationsWorkerFactory();